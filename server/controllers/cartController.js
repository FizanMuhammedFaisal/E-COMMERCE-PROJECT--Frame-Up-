import asyncHandler from 'express-async-handler'
import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'
import { getCartDetails } from '../utils/cartUtils.js'
const addToCart = asyncHandler(async (req, res, next) => {
  const user = req.user
  const { productId, quantity } = req.body

  if (!productId || !quantity || quantity < 1) {
    const error = new Error('Invalid product data')
    error.statusCode = 400
    return next(error)
  }

  // cart fetch
  let cart = await Cart.findOne({ userId: req.user.id })
  if (!cart) {
    cart = new Cart({
      userId: req.user.id,
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
  const user = req.user
  if (!user) {
    const error = new Error('Invalid user')
    error.statusCode = 400
    return next(error)
  }
  const cart = await getCartDetails(user._id)
  console.log(cart)
  if (!cart || cart.length === 0) {
    return res.status(404).json({ message: 'Cart not found' })
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
  console.log(cart)

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

  cart.items[productIndex].quantity = newQuantity
  await cart.save()

  const quantity = cart.items[productIndex].quantity
  res.status(200).json({
    message: 'Product quantity updated successfully',
    quantity: quantity
  })
})
//
// for checking the stock of cart

export { addToCart, fetchCart, removeFromCart, updateQuantity }
