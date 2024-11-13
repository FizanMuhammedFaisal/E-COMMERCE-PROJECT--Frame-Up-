import asyncHandler from "express-async-handler"
import Cart from "../models/cartModel.js"
import Product from "../models/productModel.js"
import Order from "../models/orderModel.js"
import Razorpay from "razorpay"
import crypto from "crypto"
import { v4 as uuidv4 } from "uuid"
import { getCartDetails, applyCoupon } from "../utils/helperUtils.js"
import Wallet from "../models/walletModel.js"
import PDFDocument from "pdfkit"

import mongoose, { isValidObjectId } from "mongoose"
import Coupon from "../models/couponModel.js"

///
//
const getOrdersAdmin = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    const error = new Error("No userId")
    error.statusCode = 400
    return next(error)
  }
  const orders = await Order.find({ userId: user._id })
    .select("-userId")
    .sort({ createdAt: -1 })
  console.log(orders)
  if (!orders) {
    const error = new Error("No Orders")
    error.statusCode = 400
    return next(error)
  }
  res.status(200).json({ message: "orders served", orders })
})
//
const cancelOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.body
  const userId = req.user._id
  let Message
  if (!orderId) {
    const error = new Error("Order ID is required for cancellation.")
    error.statusCode = 400
    return next(error)
  }

  const order = await Order.findById(orderId)

  if (!order) {
    const error = new Error("Order not found.")
    error.statusCode = 404
    return next(error)
  }
  if (order.userId.toString() !== userId) {
    const error = new Error("You are not authorized to cancel this order.")
    error.statusCode = 403
    return next(error)
  }

  if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
    const error = new Error(
      "Order cannot be cancelled. It has already been shipped or delivered.",
    )
    error.statusCode = 400
    return next(error)
  }

  let wallet = await Wallet.findOne({ userId: order.userId })
  if (order.paymentStatus === "Paid") {
    if (!wallet) {
      wallet = new Wallet({
        userId: order.userId,
        balance: 0,
        transactions: [],
      })
    }

    wallet.balance +=
      order.subtotal +
      order.taxAmount +
      order.shippingCost -
      order.couponAmount -
      order.discount

    wallet.transactions.push({
      type: "refund",
      amount: order.totalAmount,
      description: `Refund for order ${order._id}`,
    })

    await wallet.save()
  }

  order.orderStatus = "Cancelled"

  for (const item of order.items) {
    item.status = "Cancelled"
    const product = await Product.findById(item.productId)
    if (product) {
      product.stock += item.quantity
      await product.save()
    }
  }
  await order.save()

  return res.status(200).json({
    message: Message,
    order,
    walletBalance: wallet.balance,
  })
})

//
//
const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params
  if (!orderId) {
    const error = new Error("No Order Id")
    error.statusCode = 400
    return next(error)
  }
  const order = await Order.findById(orderId)

  res.status(200).json({ success: true, order })
})
const getOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  const skip = (page - 1) * limit

  try {
    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const totalOrders = await Order.countDocuments()
    const totalPages = Math.ceil(totalOrders / limit)
    let hasMore = true
    if (page > totalPages) {
      hasMore = false
    }
    res.status(200).json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
      hasMore,
    })
  } catch (err) {
    const error = new Error("error fetching orders")
    error.statusCode = 400
    return next(error)
  }
})
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id
  if (!userId) {
    const error = new Error("No User")
    error.statusCode = 400
    return next(error)
  }
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  const skip = (page - 1) * limit

  try {
    const orders = await Order.find({ userId: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const totalOrders = await Order.countDocuments({ userId: userId })
    const totalPages = Math.ceil(totalOrders / limit)
    let hasMore = true
    if (page > totalPages) {
      hasMore = false
    }
    res.status(200).json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
      hasMore,
    })
  } catch (err) {
    const error = new Error("error fetching orders")
    error.statusCode = 400
    return next(error)
  }
})
//
//
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderId, newStatus } = req.body

  try {
    const order = await Order.findById(orderId)

    if (!order) {
      const error = new Error("Order not found")
      error.statusCode = 404
      return next(error)
    }

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        message: "Cannot update a canceled order",
      })
    }

    if (
      order.paymentMethod === "Cash on Delivery" &&
      newStatus === "Delivered"
    ) {
      order.paymentStatus = "Paid"
    }
    order.items.forEach((item) => {
      if (item.status === order.orderStatus) {
        item.status = newStatus
      }
    })
    order.orderStatus = newStatus

    // Update the status of each item in the order which matched the order status

    const updatedOrder = await order.save()
    if (!updatedOrder) {
      const error = new Error("order not found")
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    })
  } catch (er) {
    console.log(er)
    const error = new Error("failed to update user status")
    error.statusCode = 500
    return next(error)
  }
})
//
const updateProductStock = async (updatedCart) => {
  for (const item of updatedCart) {
    if (item.quantity > 0) {
      const result = await Product.findByIdAndUpdate(item.productId, {
        $inc: { productStock: -item.quantity },
      })
      if (!result) {
        throw new Error(`Stock update failed for product ${item.productId}`)
      }
    }
  }
}

const clearCart = async (userId) => {
  const result = await Cart.findOneAndUpdate({ userId }, { items: [] })
  if (!result) {
    throw new Error("Failed to clear cart")
  }
}
const initiateOrder = asyncHandler(async (req, res, next) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    shippingCost,
    taxAmount,
    appliedCouponCode,
  } = req.body.data
  const user = req.user
  const userId = new mongoose.Types.ObjectId(req.user._id)

  try {
    let outOfStock = false
    const productIds = items.map((item) => item.productId)
    const products = await Product.find({ _id: { $in: productIds } }).lean()

    const updatedCart = items.map((item) => {
      const product = products.find((p) => p._id.equals(item.productId))
      if (!product || product.productStock === 0) {
        outOfStock = true
        return { ...item }
      }
      const updatedQuantity = Math.min(product.productStock, item.quantity)
      return {
        ...item,
        quantity: updatedQuantity,
        price: product.productPrice,
      }
    })

    if (outOfStock) {
      return res.status(400).json({
        updatedCart,
        message: "Some items are out of stock",
        outOfStock,
      })
    }

    const cartDetails = await getCartDetails(userId)

    if (!cartDetails || !cartDetails[0]) {
      const error = new Error("Order creation failed")
      error.statusCode = 400
      return next(error)
    }

    const orderItems = updatedCart.map((item) => {
      const cartItem = cartDetails[0].items.find(
        (cartItem) =>
          cartItem.productId.toString() === item.productId.toString(),
      )

      // Calculate individual item discount
      const itemDiscount = cartItem.maxDiscount || 0

      return {
        productId: item.productId,
        productName: cartItem.productName,
        quantity: item.quantity,
        price: cartItem.productPrice,
        thumbnailImage: cartItem.thumbnailImage,
        discount: itemDiscount, // Individual item discount
        status: "Pending", // Default status as per schema
      }
    })

    const subtotal = Math.ceil(cartDetails[0].subtotal)
    const discount = Math.ceil(cartDetails[0].discount)
    const totalPrice = Math.ceil(cartDetails[0].totalPrice)
    let totalAmount = Math.ceil(totalPrice + taxAmount + shippingCost)

    // Apply coupons if provided
    let couponAmount = 0
    if (appliedCouponCode) {
      try {
        couponAmount = await applyCoupon(appliedCouponCode, totalPrice)
        totalAmount -= Math.ceil(couponAmount)
      } catch (err) {
        const error = new Error(err)
        error.statusCode = 400
        return next(error)
      }
    }

    // Checking wallet balance and setting payment status
    let paymentStatus = "Pending"
    const wallet = await Wallet.findOne({ userId: user._id })
    if (paymentMethod === "Wallet") {
      if (wallet.balance < totalAmount) {
        const error = new Error("Not enough Balance in Wallet.")
        error.statusCode = 400
        return next(error)
      }
      paymentStatus = "Paid"
    }

    // Create the new order matching the schema structure
    const newOrder = await Order.create({
      userId: user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      orderStatus: "Pending",
      subtotal,
      totalAmount,
      shippingCost,
      discount, // Product-level discounts from cart
      taxAmount,
      couponCode: appliedCouponCode,
      couponAmount, // Coupon discount amount
    })

    // Deduct amount from wallet if applicable
    if (paymentMethod === "Wallet") {
      wallet.balance -= totalAmount
      wallet.transactions.push({
        type: "order",
        amount: totalAmount,
        description: `Made Order ${newOrder._id}`,
      })
      await wallet.save()
    }

    await updateProductStock(updatedCart)
    await clearCart(user._id)

    res.status(200).json({
      order: newOrder,
      message: "Order placed successfully and cart cleared!",
    })
  } catch (error) {
    console.error("Error placing order:", error)
    res
      .status(500)
      .json({ message: "An error occurred while placing the order", error })
  }
})

//
//for razor pay order intiating
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID,
  key_secret: process.env.RAZOR_PAY_KEY_SECRET,
})

const createRazorpayOrder = asyncHandler(async (req, res, next) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    shippingCost,
    taxAmount,
    appliedCouponCode,
  } = req.body.data
  const user = req.user
  const userId = new mongoose.Types.ObjectId(req.user._id)
  let updatedCart = []
  let originalCartItems = []
  let newOrder = null

  try {
    // Get original cart items for rollback if needed
    const originalCart = await Cart.findOne({ userId: user._id })
    if (originalCart) {
      originalCartItems = originalCart.items
    }

    // Check product stock
    const productIds = items.map((item) => item.productId)
    const products = await Product.find({ _id: { $in: productIds } }).lean()

    let outOfStock = false
    updatedCart = items.map((item) => {
      const product = products.find((p) => p._id.equals(item.productId))
      if (!product || product.productStock === 0) {
        outOfStock = true
        return {
          ...item,
          quantity: 0,
          price: product ? product.productPrice : 0,
        }
      }
      const updatedQuantity = Math.min(product.productStock, item.quantity)
      return {
        ...item,
        quantity: updatedQuantity,
        price: product.productPrice,
      }
    })

    if (outOfStock) {
      return res.status(400).json({
        updatedCart,
        message: "Some items are out of stock",
        outOfStock,
      })
    }

    // Get cart details for pricing and discount information
    const cartDetails = await getCartDetails(userId)
    if (!cartDetails || !cartDetails[0]) {
      const error = new Error("Order creation failed")
      error.statusCode = 400
      return next(error)
    }

    // Map cart items to match the itemsSchema structure
    const orderItems = updatedCart.map((item) => {
      const cartItem = cartDetails[0].items.find(
        (cartItem) =>
          cartItem.productId.toString() === item.productId.toString(),
      )

      // Get individual item discount
      const itemDiscount = cartItem.maxDiscount || 0

      return {
        productId: item.productId,
        productName: cartItem.productName,
        quantity: item.quantity,
        price: cartItem.productPrice,
        thumbnailImage: cartItem.thumbnailImage,
        discount: itemDiscount, // Individual item discount
        status: "Pending", // Default status as per schema
      }
    })

    // Calculate order totals
    const subtotal = Math.ceil(cartDetails[0].subtotal)
    const discount = Math.ceil(cartDetails[0].discount)
    const totalPrice = Math.ceil(cartDetails[0].totalPrice)
    let totalAmount = Math.ceil(totalPrice + taxAmount + shippingCost)

    // Apply coupon if provided
    let couponAmount = 0
    if (appliedCouponCode) {
      try {
        couponAmount = await applyCoupon(appliedCouponCode, totalPrice)
        totalAmount -= Math.ceil(couponAmount)
      } catch (err) {
        const error = new Error(err)
        error.statusCode = 400
        return next(error)
      }
    }

    // Create order with schema-matched structure
    newOrder = await Order.create({
      userId: user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",
      shippingCost,
      subtotal,
      totalAmount,
      discount, // Product-level discounts from cart
      taxAmount,
      couponCode: appliedCouponCode,
      couponAmount, // Coupon discount amount
    })

    await clearCart(user._id)

    // Handle Razorpay order creation
    if (paymentMethod === "Razor Pay") {
      try {
        const options = {
          amount: totalAmount * 100, // Amount in paise
          currency: "INR",
          receipt: `order_rcptid_${uuidv4().slice(0, 10)}`,
          payment_capture: 1,
        }

        const razorpayOrder = await razorpay.orders.create(options)

        // Update order with razorpay order ID
        await Order.findByIdAndUpdate(newOrder._id, {
          razorpayOrderId: razorpayOrder.id,
        })

        const orderData = {
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          orderId: newOrder._id,
          name: newOrder.shippingAddress.name,
          contact: newOrder.shippingAddress.phoneNumber,
        }

        return res.status(200).json({ orderData })
      } catch (err) {
        console.error(err)
        return next(new Error("Razor Pay order failed"))
      }
    } else {
      return res.status(200).json({
        order: newOrder,
        message: "Order placed successfully and cart cleared!",
      })
    }
  } catch (error) {
    console.error("Error placing order:", error)

    // Rollback changes if order was created
    if (newOrder) {
      await Order.findByIdAndDelete(newOrder._id)
    }

    // Restore product stock
    for (const item of updatedCart) {
      if (item.quantity > 0) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { productStock: item.quantity },
        })
      }
    }

    // Restore original cart
    await Cart.findOneAndUpdate(
      { userId: user._id },
      { items: originalCartItems },
    )

    return res.status(500).json({
      message: "An error occurred while placing the order. Rollback completed.",
      error,
    })
  }
})

//
//
const verifyPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body.paymentResponse
  const { orderId } = req.body
  if (
    !orderId ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    const error = new Error("Required Fields Missing")
    error.statusCode = 400
    return next(error)
  }
  const order = await Order.findById(orderId)
  if (order.orderStatus === "Cancelled") {
    //issue a refund
    console.log("issue refundedd")
    const amount = order.totalAmount
    console.log(amount)
    const wallet = await Wallet.findOne({ userId: order.userId })
    wallet.balance += amount
    wallet.transactions.push({
      type: "refund",
      amount,
      description: `Refund added to wallet ${amount} for order Cancelled ${order._id}`,
    })
    wallet.save()
  }
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZOR_PAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex")

  console.log("Expected Signature:", expectedSignature)
  console.log("Received Signature:", razorpay_signature)

  const isSignatureValid = expectedSignature === razorpay_signature

  if (!isSignatureValid) {
    return res.status(400).json({ message: "Payment verification failed" })
  }

  // Update order status in your database
  try {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus: "Paid" },
        { new: true },
      )
      await updateProductStock(order.items)
    } catch (error) {
      console.log(error)
    }

    return res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update order" })
  }
})
//
const retryPayment = asyncHandler(async (req, res, next) => {
  const { orderId } = req.body
  try {
    console.log(orderId)
    const order = await Order.findById(orderId)

    if (!order) {
      const error = new Error("No order has been made.")
      error.statusCode = 400
      return next(error)
    }

    if (order.paymentStatus === "Paid") {
      const error = new Error("Invalid or Already Paid.")
      error.statusCode = 400
      return next(error)
    }
    if (order.orderStatus === "Cancelled") {
      const error = new Error("Order Already Cancelled")
      error.statusCode = 400
      return next(error)
    }
    let razorpayOrderId = order.razorpayOrderId

    if (!razorpayOrderId) {
      const options = {
        amount: order.totalAmount * 100,
        currency: "INR",
        receipt: `retry_rcptid_${order._id}`,
        payment_capture: 1,
      }

      const razorpayOrder = await razorpay.orders.create(options)
      razorpayOrderId = razorpayOrder.id

      order.razorpayOrderId = razorpayOrderId
      await order.save()
    }

    // Send the Razorpay order ID and other details to the frontend
    const orderData = {
      razorpayOrderId,
      amount: order.totalAmount * 100,
      orderId: order._id,
      name: order.shippingAddress.name,
      contact: order.shippingAddress.phoneNumber,
    }

    res.status(200).json({ orderData })
  } catch (error) {
    console.error("Error in retrying payment:", error)
    return res.status(500).json({ message: "Retry payment failed", error })
  }
})
//
//
const cancelOrderAdmin = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params

  if (!orderId) {
    const error = new Error("id Required for cancelling")
    error.statusCode = 400
    return next(error)
  }
  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: "Cancelled" },
    { new: true },
  )
  if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
    const error = new Error(
      "Order cannot be cancelled. It has already been shipped or delivered.",
    )
    error.statusCode = 400
    return next(error)
  }

  if (order.paymentStatus === "Paid") {
    let wallet = await Wallet.findOne({ userId: order.userId })

    if (!wallet) {
      wallet = new Wallet({
        userId: order.userId,
        balance: 0,
        transactions: [],
      })
    }
    const amount =
      order.subtotal +
      order.taxAmount +
      order.shippingCost -
      order.couponAmount -
      order.discount
    console.log(amount)
    wallet.balance += amount
    wallet.transactions.push({
      type: "refund",
      amount: order.totalAmount,
      description: `Refund for order ${order._id}`,
    })

    await wallet.save()
  }
  if (order) {
    res.status(200).json({ message: "cancellation successfull", order })
  }
})
//
//
const getInvoiceDownloadURL = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Invalid order ID" })
  }

  const order = await Order.findById(orderId)
    .populate("items.productId")
    .populate("userId")

  if (!order) {
    return res.status(404).json({ message: "Order not found" })
  }

  const pdfDoc = new PDFDocument({ margin: 50 })

  // Set headers for the PDF
  res.setHeader("Content-Type", "application/pdf")
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice_${orderId}.pdf`,
  )

  pdfDoc.pipe(res)

  // ====== Header Section ======
  pdfDoc
    .fontSize(26)
    .fillColor("#2B5D6E")
    .text("Frame Up", { align: "left" })
    .fontSize(14)
    .fillColor("black")
    .text("1234 Main Street, Kochi, Kerala")
    .text("Email: support@frameup.com")
    .moveDown(1)

  pdfDoc
    .fontSize(20)
    .text("Order Invoice", { align: "center", underline: true })
    .moveDown(0.5)

  // ====== Order Details ======
  pdfDoc
    .fontSize(12)
    .text(`Order ID: ${orderId}`, { align: "right" })
    .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, {
      align: "right",
    })
    .moveDown(1.5)

  // ====== Billing Information ======
  pdfDoc
    .fontSize(14)
    .fillColor("#007ACC")
    .text("Billing Information:", { underline: true })
    .fillColor("black")
    .moveDown(0.5)
    .fontSize(12)
    .text(`Name: ${order.shippingAddress.name}`)
    .text(`Address: ${order.shippingAddress.address}`)
    .text(
      `City: ${order.shippingAddress.city}, State: ${order.shippingAddress.state}`,
    )
    .text(`Postal Code: ${order.shippingAddress.postalCode}`)
    .text(`Phone: ${order.shippingAddress.phoneNumber}`)
    .moveDown(1.5)

  // ====== Order Summary Header ======
  pdfDoc
    .fontSize(14)
    .fillColor("#007ACC")
    .text("Order Summary:", { underline: true })
    .fillColor("black")
    .moveDown(0.5)

  // ====== Table Headers ======
  const tableTop = pdfDoc.y
  pdfDoc
    .fontSize(12)
    .text("Item", 50, tableTop, { continued: true, underline: true })
    .text("Quantity", 250, tableTop, { continued: true, underline: true })
    .text("Price", 350, tableTop, { continued: true, underline: true })
    .text("Total", 450, tableTop, { underline: true })

  const formatCurrency = (amount) =>
    `Rs ${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`

  // ====== Items Loop ======
  let positionY = tableTop + 20
  order.items.forEach((item, index) => {
    pdfDoc
      .fontSize(12)
      .text(`${index + 1}. ${item.productName}`, 50, positionY)
      .text(`${item.quantity}`, 250, positionY)
      .text(formatCurrency(item.price), 350, positionY) // Format each price
      .text(formatCurrency(item.quantity * item.price), 450, positionY) // Format total
    positionY += 20
  })

  // ====== Order Totals ======
  pdfDoc
    .moveDown(1)
    .fontSize(14)
    .fillColor("#007ACC")
    .text("Order Details:", { underline: true })
    .fillColor("black")
    .fontSize(12)
    .moveDown(0.5)
    .text(`Subtotal: ${formatCurrency(order.subtotal)}`, 400)
    .text(`Shipping Cost: ${formatCurrency(order.shippingCost)}`, 400)
    .text(`Discount: -${formatCurrency(order.discount)}`, 400)
    .text(`Coupon Discount: -${formatCurrency(order.couponAmount)}`, 400)
    .text(`Tax: ${formatCurrency(order.taxAmount)}`, 400)
    .moveDown(0.5)
    .fontSize(16)
    .fillColor("#007ACC")
    .text(`Total Amount: ${formatCurrency(order.totalAmount)}`, 400)
  // ====== Footer Section ======
  pdfDoc
    .moveDown(2)
    .fontSize(10)
    .fillColor("black")
    .text(
      "Thank you for your order! For any questions, please contact our support team.",
      { align: "center", lineGap: 6 },
    )

  pdfDoc.end()
})

//

// Helper function to calculate the refund amount for an order item
const calculateRefundAmount = (order, canceledItem) => {
  // Basic item calculations
  const itemSubtotal = canceledItem.price * canceledItem.quantity
  const itemDiscount = canceledItem.discount * canceledItem.quantity

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

// Main controller function for cancelling order item
const cancelOrderItem = asyncHandler(async (req, res, next) => {
  const { orderId, itemId } = req.body
  const userId = req.user._id
  let message = ""

  // Input validation
  if (
    !orderId ||
    !itemId ||
    !mongoose.isValidObjectId(orderId) ||
    !mongoose.isValidObjectId(itemId)
  ) {
    const error = new Error("No required data to cancel order.")
    error.statusCode = 400
    return next(error)
  }

  // Find order and wallet
  const order = await Order.findById(orderId)
  const wallet = await Wallet.findOne({ userId })

  if (!order) {
    const error = new Error("Order Not Found.")
    error.statusCode = 400
    return next(error)
  }

  if (!wallet) {
    const error = new Error("Wallet Not Found.")
    error.statusCode = 400
    return next(error)
  }

  // Find the item to cancel
  const itemIndex = order.items.findIndex(
    (item) => item._id.toString() === itemId,
  )
  if (itemIndex === -1) {
    const error = new Error("Item Not Found.")
    error.statusCode = 404
    return next(error)
  }

  const canceledItem = order.items[itemIndex]

  // Validate item can be cancelled
  if (canceledItem.status === "Cancelled") {
    const error = new Error("Item is already cancelled.")
    error.statusCode = 400
    return next(error)
  }

  if (
    [
      "Return Initialized",
      "Return Accepted",
      "Return Rejected",
      "Return Completed",
    ].includes(canceledItem.status)
  ) {
    const error = new Error("Cannot cancel item in return process.")
    error.statusCode = 400
    return next(error)
  }

  // Update item status to 'Cancelled'
  order.items[itemIndex].status = "Cancelled"
  let refundAmount
  // Check if all items are canceled
  const allItemsCanceled = order.items.every(
    (item) => item.status === "Cancelled",
  )
  // all item calcele
  if (allItemsCanceled) {
    refundAmount = order.totalAmount - order.cancelledAmount
  } else {
    // Calculate refund using helper function
    let { total, breakdown } = calculateRefundAmount(order, canceledItem)
    refundAmount = total
  }

  // Update order totals
  order.cancelledAmount += refundAmount
  order.discount -= canceledItem.discount * canceledItem.quantity

  // For fixed coupon amount, reduce proportionally
  if (order.couponAmount > 0) {
    const itemProportion =
      (canceledItem.price * canceledItem.quantity) / order.subtotal
    order.couponAmount -= order.couponAmount * itemProportion
  }

  // Prevent negative values
  order.totalAmount = Math.max(0, order.totalAmount)
  order.subtotal = Math.max(0, order.subtotal)
  order.discount = Math.max(0, order.discount)
  order.couponAmount = Math.max(0, order.couponAmount)

  if (allItemsCanceled) {
    order.orderStatus = "Cancelled"
    order.couponAmount = 0
  } else {
    // Update order status to reflect partial cancellation
    const hasDelivered = order.items.some((item) => item.status === "Delivered")
    if (hasDelivered) {
      order.orderStatus = "Partially Returned"
    }
  }

  // Add refund to wallet
  wallet.balance += refundAmount
  wallet.transactions.push({
    type: "refund",
    amount: refundAmount,
    description: `Refund for cancelled item from order ${orderId}`,
    orderId: order._id,
  })

  // Save changes
  await Promise.all([order.save(), wallet.save()])

  message = `Order item cancelled successfully. ₹${refundAmount} credited to wallet.`

  return res.status(200).json({
    success: true,
    message,
    order,
    walletBalance: wallet.balance,
    refundAmount,
  })
})

export default cancelOrderItem
//
const cancelOrderItemAdmin = asyncHandler(async (req, res, next) => {
  const { orderId, itemId } = req.body

  if (!orderId || !itemId) {
    const error = new Error(
      "Order ID and Item ID are required for cancellation",
    )
    error.statusCode = 400
    return next(error)
  }

  const order = await Order.findById(orderId)
  if (!order) {
    const error = new Error("Order not found")
    error.statusCode = 404
    return next(error)
  }

  if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
    const error = new Error(
      "Order cannot be cancelled. It has already been shipped or delivered.",
    )
    error.statusCode = 400
    return next(error)
  }

  const itemIndex = order.items.findIndex(
    (item) => item._id.toString() === itemId,
  )
  if (itemIndex === -1) {
    const error = new Error("Item not found in order.")
    error.statusCode = 404
    return next(error)
  }

  const canceledItem = order.items[itemIndex]
  canceledItem.status = "Cancelled"

  let refundAmount = canceledItem.price

  if (order.couponCode) {
    const coupon = await Coupon.findOne({ code: order.couponCode })

    if (coupon) {
      const couponProportion = order.couponAmount / order.subtotal

      if (coupon.discountType === "percentage") {
        const itemDiscount = canceledItem.price * couponProportion
        refundAmount = canceledItem.price - itemDiscount
      } else if (coupon.discountType === "fixed") {
        const itemFixedDiscount =
          (canceledItem.price / order.subtotal) * coupon.discountAmount
        refundAmount = canceledItem.price - itemFixedDiscount
      }

      // Re-check if remaining order qualifies for coupon usage
      const remainingOrderTotal = order.subtotal - canceledItem.price
      if (remainingOrderTotal < coupon.minPurchaseAmount) {
        refundAmount += order.couponAmount
        order.couponAmount = 0 // Reset coupon amount if eligibility is lost
      }
    }
  }

  const allItemsCanceled = order.items.every(
    (item) => item.status === "Cancelled",
  )
  if (allItemsCanceled) {
    order.orderStatus = "Cancelled"
  }

  await order.save()

  // Process refund in wallet if payment is paid
  if (order.paymentStatus === "Paid") {
    let wallet = await Wallet.findOne({ userId: order.userId })

    if (!wallet) {
      wallet = new Wallet({
        userId: order.userId,
        balance: 0,
        transactions: [],
      })
    }

    wallet.balance += refundAmount
    wallet.transactions.push({
      type: "refund",
      amount: refundAmount,
      description: `Partial refund for item ${canceledItem.productName} in order ${order._id}`,
    })

    await wallet.save()
  }

  res.status(200).json({ message: "Cancellation successful", order })
})

export {
  initiateOrder,
  getOrdersAdmin,
  cancelOrder,
  getOrderDetails,
  getOrders,
  updateOrderStatus,
  createRazorpayOrder,
  verifyPayment,
  retryPayment,
  cancelOrderAdmin,
  getUserOrders,
  getInvoiceDownloadURL,
  cancelOrderItem,
  cancelOrderItemAdmin,
}
