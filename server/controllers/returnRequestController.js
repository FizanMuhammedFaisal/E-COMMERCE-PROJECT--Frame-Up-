import asyncHandler from "express-async-handler"
import Return from "../models/returnModel.js"
import Order from "../models/orderModel.js"
import Wallet from "../models/walletModel.js"
import Product from "../models/productModel.js"

const createReturnRequest = asyncHandler(async (req, res, next) => {
  const { orderId, reason } = req.body
  if (!orderId || !reason) {
    const error = new Error("Order ID and reason are required")
    error.statusCode = 400
    return next(error)
  }

  const order = await Order.findById(orderId)

  if (!order) {
    const error = new Error("Order not found")
    error.statusCode = 404
    return next(error)
  }
  // order.orderStatus = 'Return Initialized'
  await order.save()
  const returnRequest = await Return.create({
    orderId,
    userId: req.user.id,
    reason,
    requestedAt: Date.now(),
  })

  res.status(201).json({
    message: "Return request submitted successfully",
    returnRequest,
    order,
  })
})
const calculateRefundAmount = (order, item) => {
  // Basic item calculations
  const itemSubtotal = item.price * item.quantity
  const itemDiscount = item.discount * item.quantity

  // Calculate item's proportion of total order
  const itemProportion = itemSubtotal / order.subtotal

  // Calculate proportional coupon amount
  const itemCouponAmount =
    order.couponAmount > 0 ? order.couponAmount * itemProportion : 0

  // Calculate proportional tax and shipping
  const itemTaxAmount = order.taxAmount * itemProportion

  // Calculate final refund
  const refundAmount = Math.ceil(
    itemSubtotal + // Base price * quantity
      itemTaxAmount - // Proportional tax
      itemDiscount - // Item discount
      itemCouponAmount, // Proportional coupon discount
  )

  return {
    total: refundAmount,
    breakdown: {
      itemSubtotal,
      itemDiscount,
      couponAmount: itemCouponAmount,
      proportionalTax: itemTaxAmount,
    },
  }
}

const updateReturnRequest = asyncHandler(async (req, res, next) => {
  const { requestId, newStatus } = req.body
  const user = req.user._id

  if (!requestId || !user || !newStatus) {
    const error = new Error("Cannot update Request")
    error.statusCode = 400
    return next(error)
  }

  try {
    const returnRequest = await Return.findById(requestId)
    if (!returnRequest) {
      return res.status(404).json({ message: "Return request not found" })
    }

    const order = await Order.findById(returnRequest.orderId)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    let wallet = await Wallet.findOne({ userId: order.userId })
    if (!wallet) {
      wallet = new Wallet({
        userId: order.userId,
        balance: 0,
        transactions: [],
      })
    }

    if (["Return Accepted", "Return Rejected"].includes(order.orderStatus)) {
      const error = new Error("Return Request Already Settled")
      error.statusCode = 400
      return next(error)
    }
    let refundAmount
    if (newStatus === "Accept") {
      returnRequest.status = "Approved"

      if (returnRequest.productId) {
        const itemIndex = order.items.findIndex(
          (item) => item._id.toString() === returnRequest.productId.toString(),
        )

        if (itemIndex === -1) {
          const error = new Error("Product not found in the order")
          error.statusCode = 404
          return next(error)
        }

        const item = order.items[itemIndex]
        item.status = "Return Accepted"

        const { total, breakdown } = calculateRefundAmount(order, item)
        refundAmount = total
        order.cancelledAmount = refundAmount
        wallet.balance += refundAmount
        wallet.transactions.push({
          type: "refund",
          amount: refundAmount,
          description: `Partial refund for product  in order ${order._id}`,
        })

        await Product.updateOne(
          { _id: returnRequest.productId },
          { $inc: { productStock: 1 } },
        )
      } else {
        // Handle full order return
        order.orderStatus = "Return Accepted"
        const totalRefund =
          order.subtotal + order.taxAmount - order.couponAmount - order.discount
        order.cancelledAmount = totalRefund
        wallet.balance += totalRefund
        wallet.transactions.push({
          type: "refund",
          amount: totalRefund,
          description: `Full refund for order ${order._id}`,
        })

        const productIds = order.items.map((item) => item.productId)
        await Product.updateMany(
          { _id: { $in: productIds } },
          { $inc: { productStock: 1 } },
        )
      }

      await wallet.save()
    } else if (newStatus === "Reject") {
      returnRequest.status = "Rejected"

      if (returnRequest.productId) {
        // Handle item-level return rejection
        const itemIndex = order.items.findIndex(
          (item) => item._id.toString() === returnRequest.productId.toString(),
        )

        if (itemIndex === -1) {
          const error = new Error("Product not found in the order")
          error.statusCode = 404
          return next(error)
        }

        order.items[itemIndex].status = "Return Rejected"
      } else {
        // Handle full order return rejection
        order.orderStatus = "Return Rejected"
      }
    } else {
      const error = new Error("Invalid status for return request")
      error.statusCode = 400
      return next(error)
    }

    const updatedReturnRequest = await returnRequest.save()
    await order.save()

    res.status(200).json({
      message: `Return request ${newStatus}`,
      newStatus: updatedReturnRequest.status,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error processing the return request",
      error: error.message,
    })
  }
})

//
const getReturnRequests = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  const skip = (page - 1) * limit

  try {
    const requests = await Return.find()
      .skip(skip)
      .limit(limit)
      .sort({ requestedAt: -1 })

    const totalOrders = await Return.countDocuments()
    const totalPages = Math.ceil(totalOrders / limit)
    let hasMore = true
    if (page > totalPages) {
      hasMore = false
    }
    res.status(200).json({
      requests,
      currentPage: page,
      totalPages,
      totalOrders,
      hasMore,
    })
  } catch {
    const error = new Error("Cannot get Data.")
    error.statusCode = 400
    return next(error)
  }
})
//
const createSingleReturnRequest = asyncHandler(async (req, res) => {
  const { orderId, reason, itemId } = req.body
  if (!orderId || !reason || !itemId) {
    const error = new Error("Order ID and reason are required")
    error.statusCode = 400
    return next(error)
  }

  const order = await Order.findById(orderId)
  if (!order) {
    const error = new Error("Order not found")
    error.statusCode = 404
    return next(error)
  }
  const itemIndex = order.items.findIndex(
    (item) => item._id.toString() === itemId,
  )
  order.items[itemIndex].status = "Return Initialized"

  const allItemsReturning = order.items.every((item) =>
    ["Return Initialized", "Return Accepted", "Return Rejected"].includes(
      item.status,
    ),
  )

  const anyItemsReturned = order.items.some((item) =>
    ["Return Accepted", "Return Completed"].includes(item.status),
  )

  if (order.items.every((item) => item.status === "Return Completed")) {
    order.orderStatus = "Return Completed"
  } else if (allItemsReturning) {
    order.orderStatus = "Return Processing"
  } else if (anyItemsReturned) {
    order.orderStatus = "Partially Returned"
  }

  await order.save()

  console.log(order)
  const returnRequest = await Return.create({
    orderId,
    productId: itemId,
    userId: order.userId,
    reason,
    requestedAt: Date.now(),
  })

  res.status(201).json({
    message: "Return request submitted successfully",
    returnRequest,
    order,
  })
})
export {
  createReturnRequest,
  updateReturnRequest,
  getReturnRequests,
  createSingleReturnRequest,
}
