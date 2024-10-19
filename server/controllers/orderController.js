import asyncHandler from 'express-async-handler'
import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

const initiateOrder = asyncHandler(async (req, res, next) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    shippingCost,
    discount,
    taxAmount,
    totalAmount,
    subtotal
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
        return { ...item, quantity: 0 }
      }

      const updatedQuantity =
        product.productStock < item.quantity
          ? product.productStock
          : item.quantity
      return {
        ...item,
        quantity: updatedQuantity
      }
    })
    console.log('asdfdasdfasdfa')
    console.log(updatedCart)
    console.log('asdfdasdfasdfa')

    if (outOfStock) {
      return res.status(400).json({
        updatedCart,
        message: 'Some items are out of stock',
        outOfStock
      })
    }

    // Create a new Order
    const newOrder = new Order({
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
      subtotal
    })

    await newOrder.save()
    // Deduct stock
    for (const item of updatedCart) {
      const product = await Product.findByIdAndUpdate(item.productId, {
        $inc: { productStock: -item.quantity }
      })
    }

    // Clear the user's cart
    await Cart.findOneAndUpdate({ userId: user._id }, { items: [] })
    console.log(paymentMethod)
    if (paymentMethod === 'Razor Pay') {
      req.orderDetails = newOrder
      next()
    } else {
      res.status(200).json({
        order: newOrder,
        message: 'Order placed successfully and cart cleared!'
      })
    }
  } catch (error) {
    console.error('Error placing order:', error)
    res
      .status(500)
      .json({ message: 'An error occurred while placing the order', error })
  }
})
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
  console.log('order cancellled')
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
//
//
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderId, newStatus } = req.body
  console.log(orderId, newStatus)

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: newStatus },
      { new: true }
    )

    if (!updatedOrder) {
      const error = new Error('order not found')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order: updatedOrder
    })
  } catch (er) {
    const error = new Error('failed to update user status')
    error.statusCode = 500
    return next(error)
  }
})
//
//
//for razor pay order intiating

const createOrder = asyncHandler(async (req, res, next) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    shippingCost,
    discount,
    taxAmount,
    totalAmount,
    subtotal
  } = req.body.data

  const user = req.user
  const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_KEY_SECRET
  })
  if (!totalAmount || isNaN(totalAmount)) {
    return res.status(400).json({ message: 'Invalid total amount' })
  }

  let newOrder = null
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
        return { ...item, quantity: 0 }
      }

      const updatedQuantity =
        product.productStock < item.quantity
          ? product.productStock
          : item.quantity

      return { ...item, quantity: updatedQuantity }
    })

    if (outOfStock) {
      return res.status(400).json({
        updatedCart,
        message: 'Some items are out of stock',
        outOfStock
      })
    }

    newOrder = new Order({
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
      subtotal
    })

    await newOrder.save()

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

    const cartUpdateResult = await Cart.findOneAndUpdate(
      { userId: user._id },
      { items: [] }
    )
    if (!cartUpdateResult) {
      throw new Error('Failed to clear cart')
    }

    if (paymentMethod === 'Razor Pay') {
      try {
        const options = {
          amount: totalAmount * 100,
          currency: 'INR',
          receipt: `order_rcptid_${uuidv4().slice(0, 10)}`,
          payment_capture: 1
        }
        console.log(options)
        const razorpayOrder = await razorpay.orders.create(options)
        const orderData = {
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          orderId: newOrder._id,
          name: newOrder.shippingAddress.name,
          contact: newOrder.shippingAddress.phoneNumber
        }
        console.log(orderData)
        res.status(200).json({ orderData })
      } catch (err) {
        console.log(err)
        const error = new Error('razor pay order failed')
        error.statusCode = 500
        return next(error)
      }
    } else {
      res.status(200).json({
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

    res.status(500).json({
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
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: 'Paid' },
      { new: true }
    )

    console.log(order)
    return res
      .status(200)
      .json({ success: true, message: 'Payment verified successfully' })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Failed to update order' })
  }
}
export {
  initiateOrder,
  getOrdersAdmin,
  cancelOrder,
  getOrderDetails,
  getOrders,
  updateOrderStatus,
  createOrder,
  verifyPayment
}
