import asyncHandler from 'express-async-handler'
import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'
import { getCartDetails } from '../utils/helperUtils.js'
import mongoose from 'mongoose'
const addToCart = asyncHandler(async (req, res, next) => {
  console.log(req.body)
  const userId = new mongoose.Types.ObjectId(req.user._id)
  const { productId, quantity } = req.body
  if (!productId || !quantity || quantity < 1) {
    const error = new Error('Invalid product data')
    error.statusCode = 400
    return next(error)
  }

  // cart fetch
  console.log(userId)
  let cart = await Cart.findOne({ userId: userId })
  console.log(cart)
  if (!cart) {
    cart = new Cart({
      userId: userId,
      items: [],
      subtotal: 0,
      discount: 0,
      totalPrice: 0
    })
  }

  const productIds = cart.items.map(item => item.productId.toString())
  productIds.push(productId)

  //fetching all products needed
  const products = await Product.find({ _id: { $in: productIds } })
  const requestedProduct = products.find(
    product => product._id.toString() === productId
  )
  if (!requestedProduct) {
    const error = new Error('Product not found')
    error.statusCode = 404
    return next(error)
  }

  // check stock for the requested product
  let totalQuantityInCart = quantity
  const existingItemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId
  )

  if (existingItemIndex > -1) {
    totalQuantityInCart += cart.items[existingItemIndex].quantity
  }

  if (totalQuantityInCart > requestedProduct.productStock) {
    const error = new Error(
      'Not enough stock available for the total quantity requested'
    )
    error.statusCode = 400
    return next(error)
  }

  // Update the cart
  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity
  } else {
    cart.items.push({ productId, quantity })
  }

  // recalcuate the subtotal
  cart.subtotal = cart.items.reduce((acc, item) => {
    const product = products.find(
      p => p._id.toString() === item.productId.toString()
    )
    return acc + item.quantity * product.productPrice
  }, 0)

  // Save the cart
  await cart.save()
  await cart.populate(
    'items.productId',
    'productName productPrice thumbnailImage'
  )

  console.log('Populated Cart Items:', cart.items)

  const data = cart.items.map((item, i) => ({
    productPrice: item.productId.productPrice,
    productName: item.productId.productName,
    thumbnailImage: item.productId.thumbnailImage,
    quantity: item.quantity,
    productId: item.productId._id
  }))
  return res.status(200).json({
    message: 'Product added to cart successfully',
    cart: {
      items: data,
      subtotal: cart.subtotal
    }
  })
})

// for fetching cart
//
const fetchCart = asyncHandler(async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.user._id)
  if (!userId) {
    const error = new Error('Invalid user')
    error.statusCode = 400
    return next(error)
  }
  const cart = await getCartDetails(userId)
  console.log(cart)
  if (!cart) {
    const error = new Error('cart Not Fount')
    error.statusCode = 400
    return next(error)
  }
  let outOfStock = false // Initialize the out-of-stock flag
  const productIds = cart[0].items.map(item => item.productId)
  const products = await Product.find({ _id: { $in: productIds } }).lean()

  const updatedItems = cart[0].items.map(item => {
    const product = products.find(p => p._id.equals(item.productId))
    if (!product || product.productStock === 0) {
      outOfStock = true
      return {
        ...item,
        quantity: 0
      }
    }
    return item
  })

  if (outOfStock) {
    return res.status(200).json({
      cart: { ...cart[0], items: updatedItems },
      message: 'Some items are out of stock',
      outOfStock
    })
  }

  res.status(200).json({
    cart: cart[0],
    success: true
  })
})

//
//@decp for removing the product form cart
const removeFromCart = asyncHandler(async (req, res, next) => {
  const user = req.user
  const productId = req.params.productId

  if (!productId) {
    const error = new Error('No ProductId')
    error.statusCode = 400
    return next(error)
  }
  const cart = await Cart.findOne({ userId: user._id })
  if (!cart) {
    const error = new Error('User has no cart')
    error.statusCode = 400
    return next(error)
  }
  const productIndex = cart.items.findIndex(
    p => p.productId.toString() === productId
  )

  // If the product is not found in the cart, throw an error
  if (productIndex === -1) {
    const error = new Error('Product not found in the cart')
    error.statusCode = 404
    return next(error)
  }

  cart.items.splice(productIndex, 1)
  await cart.save()
  res.status(200).json({
    message: 'Product removed from cart successfully'
  })
})
//
//@descp for updaiting the quantity of product
const updateQuantity = asyncHandler(async (req, res, next) => {
  const { productId, quantityChange } = req.body
  if (!productId || quantityChange === undefined) {
    const error = new Error('No valid fields')
    error.statusCode = 400
    return next(error)
  }

  const user = req.user

  // if not cart
  const cart = await Cart.findOne({ userId: user._id })
  if (!cart) {
    const error = new Error('User has no cart')
    error.statusCode = 400
    return next(error)
  }

  const productIndex = cart.items.findIndex(
    p => p.productId.toString() === productId
  )

  // If the product is not found in the cart
  if (productIndex === -1) {
    const error = new Error('Product not found in the cart')
    error.statusCode = 404
    return next(error)
  }

  const newQuantity = cart.items[productIndex].quantity + quantityChange

  if (newQuantity < 1) {
    const error = new Error('Quantity cannot be less than 1')
    error.statusCode = 400
    return next(error)
  }

  // Check stock availability
  const product = await Product.findById(productId)
  if (!product) {
    const error = new Error('Product not found')
    error.statusCode = 404
    return next(error)
  }
  // check is there is stock avialble
  if (newQuantity > product.productStock) {
    const error = new Error('Not enough stock available')
    error.statusCode = 400
    return next(error)
  }
  const userId = new mongoose.Types.ObjectId(req.user._id)
  cart.items[productIndex].quantity = newQuantity
  await cart.save()
  const cartDetails = await getCartDetails(userId)
  console.log(cartDetails)
  const quantity = cart.items[productIndex].quantity
  console.log(
    quantity,
    cartDetails[0]?.subtotal,
    cartDetails[0]?.discount,
    cartDetails[0]?.totalPrice
  )
  res.status(200).json({
    success: true,
    data: {
      quantity: quantity,
      subtotal: cartDetails[0]?.subtotal,
      discount: cartDetails[0]?.discount,
      totalPrice: cartDetails[0]?.totalPrice
    }
  })
})
//
// for checking the stock of cart

export { addToCart, fetchCart, removeFromCart, updateQuantity }
