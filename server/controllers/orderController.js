import asyncHandler from 'express-async-handler'
import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'

const initiateOrder = asyncHandler(async (req, res) => {
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
    console.log(newOrder)
    await newOrder.save()
    // Deduct stock
    for (const item of updatedCart) {
      const product = await Product.findByIdAndUpdate(item.productId, {
        $inc: { productStock: -item.quantity }
      })
    }

    // Clear the user's cart
    await Cart.findOneAndUpdate({ userId: user._id }, { items: [] })

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
///
//
const getOrders = asyncHandler(async (req, res) => {
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
export { initiateOrder, getOrders, cancelOrder }
