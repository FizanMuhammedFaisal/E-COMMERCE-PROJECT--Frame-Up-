import asyncHandler from 'express-async-handler'
import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { getCartDetails, applyCoupon } from '../utils/cartUtils.js'
import Wallet from '../models/walletModel.js'

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

  if (order.paymentStatus !== 'Paid') {
    const error = new Error(
      'Cancellation not possible. Payment has not been made.'
    )
    error.statusCode = 400
    return next(error)
  }

  let wallet = await Wallet.findOne({ userId: order.userId })

  if (!wallet) {
    wallet = new Wallet({
      userId: order.userId,
      balance: 0,
      transactions: []
    })
  }

  wallet.balance += order.totalAmount

  wallet.transactions.push({
    type: 'refund',
    amount: order.totalAmount,
    description: `Refund for order ${order._id}`
  })

  await wallet.save()

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

    const subtotal = cartDetails[0].subtotal
    const totalDiscount = cartDetails[0].totalDiscount
    const totalPrice = cartDetails[0].totalPrice
    let totalAmount = Math.floor(totalPrice + taxAmount + shippingCost)
    let couponDiscount = 0
    console.log(appliedCouponCode)
    if (appliedCouponCode) {
      try {
        couponDiscount = await applyCoupon(appliedCouponCode, totalPrice)
        console.log(couponDiscount)
        totalAmount -= couponDiscount
      } catch (err) {
        const error = new Error(err)
        error.statusCode = 400
        return next(error)
      }
    }

    // Create a new Order
    const newOrder = await Order.create({
      userId: user._id,
      items: updatedCart,
      shippingAddress,
      paymentMethod,
      shippingCost,
      discount: totalDiscount,
      taxAmount,
      totalAmount,
      orderStatus: 'Pending',
      paymentStatus: 'Pending',
      subtotal,
      couponCode: appliedCouponCode,
      couponAmount: couponDiscount
    })

    // Deduct stock
    // Clear the user's cart
    await clearCart(user._id)
    await updateProductStock(updatedCart)

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

    const subtotal = cartDetails[0].subtotal
    const totalDiscount = cartDetails[0].totalDiscount
    const totalPrice = cartDetails[0].totalPrice
    let totalAmount = Math.floor(totalPrice + taxAmount + shippingCost)
    console.log(totalAmount)
    let couponDiscount = 0
    console.log(appliedCouponCode)
    if (appliedCouponCode) {
      try {
        couponDiscount = await applyCoupon(appliedCouponCode, totalPrice)
        console.log(couponDiscount)
        totalAmount -= couponDiscount
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
      discount: totalDiscount,
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
        console.log(newOrder)
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
  console.log(orderId)
  console.log(orderId)
  console.log(orderId)
  console.log(orderId)
  console.log(orderId)
  console.log(orderId)
  console.log('Payment Response:', req.body)
  console.log('Secret Key:', process.env.RAZOR_PAY_KEY_SECRET)

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
  console.log(orderId)
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
  if (order) {
    res.status(200).json({ message: 'cancellation successfull', order })
  }
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
  getUserOrders
}
