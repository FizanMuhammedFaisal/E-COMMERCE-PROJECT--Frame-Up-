import asyncHandler from 'express-async-handler'
import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { getCartDetails, applyCoupon } from '../utils/cartUtils.js'
import Wallet from '../models/walletModel.js'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import mongoose from 'mongoose'

///
//
const getOrdersAdmin = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    const error = new Error('No userId')
    error.statusCode = 400
    return next(error)
  }
  const orders = await Order.find({ userId: user._id })
    .select('-userId')
    .sort({ createdAt: -1 })
  console.log(orders)
  if (!orders) {
    const error = new Error('No Orders')
    error.statusCode = 400
    return next(error)
  }
  res.status(200).json({ message: 'orders served', orders })
})
//
const cancelOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.body
  const userId = req.user.id
  if (!orderId) {
    const error = new Error('Order ID is required for cancellation.')
    error.statusCode = 400
    return next(error)
  }

  const order = await Order.findById(orderId)

  if (!order) {
    const error = new Error('Order not found.')
    error.statusCode = 404
    return next(error)
  }

  if (order.userId.toString() !== userId) {
    const error = new Error('You are not authorized to cancel this order.')
    error.statusCode = 403
    return next(error)
  }

  if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
    const error = new Error(
      'Order cannot be cancelled. It has already been shipped or delivered.'
    )
    error.statusCode = 400
    return next(error)
  }

  let wallet = await Wallet.findOne({ userId: order.userId })
  if (order.paymentStatus === 'Paid') {
    if (!wallet) {
      wallet = new Wallet({
        userId: order.userId,
        balance: 0,
        transactions: []
      })
    }

    wallet.balance +=
      order.subtotal +
      order.taxAmount +
      order.shippingCost -
      order.couponAmount -
      order.discount

    wallet.transactions.push({
      type: 'refund',
      amount: order.totalAmount,
      description: `Refund for order ${order._id}`
    })

    await wallet.save()
  }

  order.orderStatus = 'Cancelled'
  await order.save()

  return res.status(200).json({
    message: 'Cancellation successful and amount refunded to  wallet.',
    order,
    walletBalance: wallet.balance
  })
})

//
//
const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params
  if (!orderId) {
    const error = new Error('No Order Id')
    error.statusCode = 400
    return next(error)
  }
  const order = await Order.findById(orderId)
  console.log(order)
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
      hasMore
    })
  } catch (err) {
    const error = new Error('error fetching orders')
    error.statusCode = 400
    return next(error)
  }
})
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id
  if (!userId) {
    const error = new Error('No User')
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
      hasMore
    })
  } catch (err) {
    const error = new Error('error fetching orders')
    error.statusCode = 400
    return next(error)
  }
})
//
//
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderId, newStatus } = req.body
  console.log(orderId, newStatus)
  if (newStatus === 'Delivered') {
  }
  try {
    const order = await Order.findById(orderId)
    console.log(order)
    if (
      order.paymentMethod === 'Cash on Delivery' &&
      newStatus === 'Delivered'
    ) {
      console.log('makinf payment')
      order.paymentStatus = 'Paid'
      order.orderStatus = newStatus
    } else {
      order.orderStatus = newStatus
      console.log('upating it')
    }
    const updatedOrder = await order.save()
    if (!updatedOrder) {
      const error = new Error('order not found')
      error.statusCode = 404
      return next(error)
    }
    console.log(updatedOrder)
    res.status(200).json({
      message: 'Order status updated successfully',
      order: updatedOrder
    })
  } catch (er) {
    console.log(er)
    const error = new Error('failed to update user status')
    error.statusCode = 500
    return next(error)
  }
})
//
const updateProductStock = async updatedCart => {
  for (const item of updatedCart) {
    if (item.quantity > 0) {
      const result = await Product.findByIdAndUpdate(item.productId, {
        $inc: { productStock: -item.quantity }
      })
      if (!result) {
        throw new Error(`Stock update failed for product ${item.productId}`)
      }
    }
  }
}

const clearCart = async userId => {
  const result = await Cart.findOneAndUpdate({ userId }, { items: [] })
  if (!result) {
    throw new Error('Failed to clear cart')
  }
}
const initiateOrder = asyncHandler(async (req, res, next) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    shippingCost,
    taxAmount,
    appliedCouponCode
  } = req.body.data
  const user = req.user

  try {
    let outOfStock = false
    const productIds = items.map(item => item.productId)
    const products = await Product.find({ _id: { $in: productIds } }).lean()

    const updatedCart = items.map(item => {
      const product = products.find(p => p._id.equals(item.productId))
      if (!product || product.productStock === 0) {
        outOfStock = true
        return {
          ...item,
          quantity: 0,
          price: product ? product.productPrice : 0
        }
      }
      const updatedQuantity = Math.min(product.productStock, item.quantity)
      return { ...item, quantity: updatedQuantity, price: product.productPrice }
    })

    if (outOfStock) {
      return res.status(400).json({
        updatedCart,
        message: 'Some items are out of stock',
        outOfStock
      })
    }

    const cartDetails = await getCartDetails(user._id)
    if (!cartDetails) {
      const error = new Error('Order creation failed')
      error.statusCode = 400
      return next(error)
    }

    const subtotal = Math.ceil(cartDetails[0].subtotal)
    const discount = Math.ceil(cartDetails[0].discount)
    console.log(discount)
    const totalPrice = Math.ceil(cartDetails[0].totalPrice)
    let totalAmount = Math.ceil(totalPrice + taxAmount + shippingCost)

    //apply coupons if provided
    let couponDiscount = 0
    if (appliedCouponCode) {
      try {
        couponDiscount = await applyCoupon(appliedCouponCode, totalPrice)
        totalAmount -= Math.ceil(couponDiscount)
      } catch (err) {
        const error = new Error(err)
        error.statusCode = 400
        return next(error)
      }
    }

    // Cheking wallet balnce and if not balance then rejecting
    let paymentStatus = 'Pending'
    const wallet = await Wallet.findOne({ userId: user._id })
    if (paymentMethod === 'Wallet') {
      if (wallet.balance < totalAmount) {
        const error = new Error('Not enough Balance in Wallet.')
        error.statusCode = 400
        return next(error)
      }
      paymentStatus = 'Paid'
    }

    // Create the new order
    const newOrder = await Order.create({
      userId: user._id,
      items: updatedCart,
      shippingAddress,
      paymentMethod,
      shippingCost,
      discount,
      taxAmount,
      totalAmount,
      orderStatus: 'Pending',
      paymentStatus,
      subtotal,
      couponCode: appliedCouponCode,
      couponAmount: couponDiscount
    })

    //Deduct amount
    if (paymentMethod === 'Wallet') {
      wallet.balance -= totalAmount
      wallet.transactions.push({
        type: 'order',
        amount: totalAmount,
        description: `Made Order ${newOrder._id}`
      })
      await wallet.save()
    }

    await updateProductStock(updatedCart)
    await clearCart(user._id)

    res.status(200).json({
      order: newOrder,
      message: 'Order placed successfully and cart cleared!'
    })
  } catch (error) {
    console.error('Error placing order:', error)
    res
      .status(500)
      .json({ message: 'An error occurred while placing the order', error })
  }
})

//
//for razor pay order intiating
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID,
  key_secret: process.env.RAZOR_PAY_KEY_SECRET
})

const createRazorpayOrder = asyncHandler(async (req, res, next) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    shippingCost,
    taxAmount,
    appliedCouponCode
  } = req.body.data
  console.log(req.body.data)
  const user = req.user

  let updatedCart = []
  let originalCartItems = []

  try {
    const originalCart = await Cart.findOne({ userId: user._id })
    if (originalCart) {
      originalCartItems = originalCart.items
    }

    const productIds = items.map(item => item.productId)
    const products = await Product.find({ _id: { $in: productIds } }).lean()

    let outOfStock = false
    updatedCart = items.map(item => {
      const product = products.find(p => p._id.equals(item.productId))
      if (!product || product.productStock === 0) {
        outOfStock = true
        return {
          ...item,
          quantity: 0,
          price: product ? product.productPrice : 0
        } // Out of stock
      }
      const updatedQuantity =
        product.productStock < item.quantity
          ? product.productStock
          : item.quantity
      return { ...item, quantity: updatedQuantity, price: product.productPrice }
    })

    if (outOfStock) {
      return res.status(400).json({
        updatedCart,
        message: 'Some items are out of stock',
        outOfStock
      })
    }

    const cartDetails = await getCartDetails(user._id)

    if (!cartDetails) {
      const error = new Error('order creation Failed')
      error.statusCode = 400
      return next(error)
    }
    const subtotal = Math.ceil(cartDetails[0].subtotal)
    const discount = Math.ceil(cartDetails[0].discount)
    console.log(discount)
    const totalPrice = Math.ceil(cartDetails[0].totalPrice)
    let totalAmount = Math.ceil(totalPrice + taxAmount + shippingCost)

    //apply coupons if provided
    let couponDiscount = 0
    if (appliedCouponCode) {
      try {
        couponDiscount = await applyCoupon(appliedCouponCode, totalPrice)
        totalAmount -= Math.ceil(couponDiscount)
      } catch (err) {
        const error = new Error(err)
        error.statusCode = 400
        return next(error)
      }
    }

    console.log(totalAmount)
    const newOrder = await Order.create({
      userId: user._id,
      items: updatedCart,
      shippingAddress,
      paymentMethod,
      shippingCost,
      discount,
      taxAmount,
      totalAmount,
      orderStatus: 'Pending',
      paymentStatus: 'Pending',
      subtotal,
      couponCode: appliedCouponCode,
      couponAmount: couponDiscount
    })

    await updateProductStock(updatedCart)
    await clearCart(user._id)

    if (paymentMethod === 'Razor Pay') {
      try {
        const options = {
          amount: newOrder.totalAmount * 100,
          currency: 'INR',
          receipt: `order_rcptid_${uuidv4().slice(0, 10)}`,
          payment_capture: 1
        }
        const razorpayOrder = await razorpay.orders.create(options)
        const orderData = {
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          orderId: newOrder._id,
          name: newOrder.shippingAddress.name,
          contact: newOrder.shippingAddress.phoneNumber
        }
        return res.status(200).json({ orderData })
      } catch (err) {
        console.error(err)
        return next(new Error('Razor Pay order failed'))
      }
    } else {
      return res.status(200).json({
        order: newOrder,
        message: 'Order placed successfully and cart cleared!'
      })
    }
  } catch (error) {
    console.error('Error placing order:', error)

    if (newOrder) {
      await Order.findByIdAndDelete(newOrder._id)
    }

    for (const item of updatedCart) {
      if (item.quantity > 0) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { productStock: item.quantity }
        })
      }
    }

    await Cart.findOneAndUpdate(
      { userId: user._id },
      { items: originalCartItems }
    )

    return res.status(500).json({
      message: 'An error occurred while placing the order. Rollback completed.',
      error
    })
  }
})

//
//
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body.paymentResponse
  const { orderId } = req.body

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZOR_PAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  console.log('Expected Signature:', expectedSignature)
  console.log('Received Signature:', razorpay_signature)

  const isSignatureValid = expectedSignature === razorpay_signature

  if (!isSignatureValid) {
    return res.status(400).json({ message: 'Payment verification failed' })
  }

  // Update order status in your database
  try {
    console.log(orderId)
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus: 'Paid' },
        { new: true }
      )
      console.log(order)
    } catch (error) {
      console.log(error)
    }

    return res
      .status(200)
      .json({ success: true, message: 'Payment verified successfully' })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Failed to update order' })
  }
}
//
const retryPayment = asyncHandler(async (req, res, next) => {
  const { orderId } = req.body
  console.log(orderId)
  try {
    const order = await Order.findById(orderId)

    if (!order || order.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Invalid or already paid order' })
    }

    let razorpayOrderId = order.razorpayOrderId

    if (!razorpayOrderId) {
      const options = {
        amount: order.totalAmount * 100,
        currency: 'INR',
        receipt: `retry_rcptid_${order._id}`,
        payment_capture: 1
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
      contact: order.shippingAddress.phoneNumber
    }

    res.status(200).json({ orderData })
  } catch (error) {
    console.error('Error in retrying payment:', error)
    return res.status(500).json({ message: 'Retry payment failed', error })
  }
})
//
//
const cancelOrderAdmin = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params

  if (!orderId) {
    const error = new Error('id Required for cancelling')
    error.statusCode = 400
    return next(error)
  }
  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: 'Cancelled' },
    { new: true }
  )
  if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
    const error = new Error(
      'Order cannot be cancelled. It has already been shipped or delivered.'
    )
    error.statusCode = 400
    return next(error)
  }

  if (order.paymentStatus === 'Paid') {
    let wallet = await Wallet.findOne({ userId: order.userId })

    if (!wallet) {
      wallet = new Wallet({
        userId: order.userId,
        balance: 0,
        transactions: []
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
      type: 'refund',
      amount: order.totalAmount,
      description: `Refund for order ${order._id}`
    })

    await wallet.save()
  }
  if (order) {
    res.status(200).json({ message: 'cancellation successfull', order })
  }
})
//
//
const getInvoiceDownloadURL = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params
  console.log('asdfasdf')
  console.log(req.params)
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: 'Invalid order ID' })
  }

  const order = await Order.findById(orderId)
    .populate('items.productId')
    .populate('userId')
  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  const pdfDoc = new PDFDocument({ margin: 50 })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=invoice_${orderId}.pdf`
  )

  pdfDoc.pipe(res)

  pdfDoc.fontSize(20).text('Order Invoice', { align: 'center' }).moveDown(0.5)

  pdfDoc
    .fontSize(12)
    .text(`Order ID: ${orderId}`, { align: 'right' })
    .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, {
      align: 'right'
    })
    .moveDown(1.5)

  pdfDoc
    .fontSize(14)
    .text('Billing Information:', { underline: true })
    .moveDown(0.5)
    .fontSize(12)
    .text(`Name: ${order.shippingAddress.name}`)
    .text(`Address: ${order.shippingAddress.address}`)
    .text(
      `City: ${order.shippingAddress.city}, State: ${order.shippingAddress.state}`
    )
    .text(`Postal Code: ${order.shippingAddress.postalCode}`)
    .text(`Phone: ${order.shippingAddress.phoneNumber}`)
    .moveDown(1.5)

  pdfDoc.fontSize(14).text('Order Summary:', { underline: true }).moveDown(0.5)

  order.items.forEach((item, index) => {
    pdfDoc
      .fontSize(12)
      .text(`${index + 1}. ${item.productName}`)
      .text(`   Quantity: ${item.quantity} x $${item.price.toFixed(2)}`)
      .text(`   Total: $${(item.quantity * item.price).toFixed(2)}`)
      .moveDown(0.5)
  })

  pdfDoc
    .moveDown(1)
    .fontSize(14)
    .text('Order Details:', { underline: true })
    .fontSize(12)
    .text(`Subtotal: $${order.subtotal.toFixed(2)}`)
    .text(`Shipping Cost: $${order.shippingCost.toFixed(2)}`)
    .text(`Discount: -$${order.discount.toFixed(2)}`)
    .text(`Coupon Discount: -$${order.couponAmount.toFixed(2)}`)
    .text(`Tax: $${order.taxAmount.toFixed(2)}`)
    .moveDown(0.5)
    .fontSize(14)
    .text(`Total Amount: $${order.totalAmount.toFixed(2)}`, { align: 'right' })

  pdfDoc
    .moveDown(2)
    .fontSize(10)
    .text(
      'Thank you for your order! For any questions, please contact our support team.',
      { align: 'center', lineGap: 6 }
    )

  pdfDoc.end()
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
  getInvoiceDownloadURL
}
