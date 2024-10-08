import asyncHandler from 'express-async-handler'
import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'

const addToCart = asyncHandler(async (req, res, next) => {
  const user = req.user
  console.log(user._id)
  const { productId, price, quantity } = req.body

  // Validate input
  if (!productId || !quantity || quantity < 1 || !price) {
    const error = new Error('Invalid product data')
    error.statusCode = 400
    return next(error)
  }

  // Check if the product exists
  const product = await Product.findById(productId)
  if (!product) {
    const error = new Error('Product not found')
    error.statusCode = 404
    return next(error)
  }

  console.log(`Product stock: ${product.productStock}`)
  console.log(`Requested quantity: ${quantity}`)

  // Fetch the cart for the user
  let cart = await Cart.findOne({ userId: req.user.id })
  if (!cart) {
    cart = new Cart({ userId: req.user.id, items: [] })
  }

  // Find the item in the cart
  const existingItemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId
  )

  let totalQuantityInCart = quantity
  if (existingItemIndex > -1) {
    // Add the quantity already in the cart to the requested quantity
    totalQuantityInCart += cart.items[existingItemIndex].quantity
  }

  // Check if the combined quantity exceeds the stock
  if (totalQuantityInCart > product.productStock) {
    const error = new Error(
      'Not enough stock available for the total quantity requested'
    )
    error.statusCode = 400
    return next(error)
  }

  // Update the cart
  if (existingItemIndex > -1) {
    // If the product is already in the cart, just update the quantity
    cart.items[existingItemIndex].quantity += quantity
  } else {
    // If the product is not in the cart, add it
    cart.items.push({ productId, price, quantity })
  }

  // Save the cart
  await cart.save()

  // Populate the product details
  await cart.populate('items.productId', 'productName thumbnailImage')

  const populatedItems = cart.items.map(item => ({
    productId: item.productId._id,
    productName: item.productId.productName,
    thumbnailImage: item.productId.thumbnailImage,
    quantity: item.quantity,
    price: item.price
  }))

  console.log(cart.items)

  return res.status(200).json({
    message: 'Product added to cart successfully',
    items: populatedItems
  })
})

// for fetching cart
//
const fetchCart = asyncHandler(async (req, res, next) => {
  const user = req.user
  if (!user) {
    const error = new Error('invalid user')
    error.statusCode = 400
    return next(error)
  }
  console.log(user)
  const cart = await Cart.findOne({ userId: user._id })
    .populate('items.productId', 'productName thumbnailImage')
    .lean()

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' })
  }

  let outofstock = false
  const productIds = cart.items.map(item => item.productId._id)
  const products = await Product.find({ _id: { $in: productIds } }).lean()

  const updatedCart = cart.items.map(item => {
    const product = products.find(p => p._id.equals(item.productId._id))

    if (!product || product.productStock === 0) {
      outofstock = true
      return { ...item, quantity: 0 }
    }

    const updatedQuantity =
      product.stock < item.quantity ? product.stock : item.quantity
    return { ...item, quantity: updatedQuantity }
  })

  cart.items = updatedCart.map(item => ({
    productId: item.productId._id,
    productName: item.productId.productName,
    thumbnailImage: item.productId.thumbnailImage,
    quantity: item.quantity,
    price: item.price
  }))

  res.status(200).json({
    cart: {
      userId: cart.userId,
      items: cart.items,
      subtotal: cart.subtotal,
      totalPrice: cart.totalPrice,
      updatedAt: cart.updatedAt,
      status: cart.status,
      discount: cart.discount
    },
    success: true,
    outofstock
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
  console.log(req.body)

  if (!productId || quantityChange === undefined) {
    const error = new Error('No valid fields')
    error.statusCode = 400
    return next(error)
  }

  const user = req.user
  console.log(typeof quantityChange)
  console.log(user)

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
