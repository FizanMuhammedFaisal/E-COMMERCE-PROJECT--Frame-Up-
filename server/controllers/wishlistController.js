import asyncHandler from 'express-async-handler'
import Wishlist from '../models/wishlistModel.js'
import mongoose from 'mongoose'

const addToWishlist = asyncHandler(async (req, res, next) => {
  const user = req.user
  const { productId } = req.body

  let wishlist = await Wishlist.findOne({ userId: user._id })

  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId: user._id,
      items: [productId]
    })
  } else {
    if (!wishlist.items.includes(productId)) {
      wishlist.items.push(productId)
      await wishlist.save()
    } else {
      return res
        .status(400)
        .json({ message: 'Product is already in the wishlist.' })
    }
  }

  res
    .status(201)
    .json({ message: 'Product added to wishlist successfully.', wishlist })
})
//
const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = req.user
  const { productId } = req.body

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product ID.' })
  }

  let wishlist = await Wishlist.findOneAndDelete(
    { userId: user._id },
    { $pull: { items: productId } },
    { new: true }
  ).populate('items')

  if (!wishlist) {
    const error = new Error('no wishlist found')
    error.statusCode = 404
    return next(error)
  }
  res.status(200).json({ message: 'Product removed from wishlist.', wishlist })
})
const getWishlist = asyncHandler(async (req, res, next) => {
  const user = req.user

  let wishlist = await Wishlist.findOne({ userId: user._id }).populate('items')

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: user._id, items: [] })
  }

  if (wishlist) {
    return res.status(200).json({ wishlist })
  }
  const error = new Error('server error')
  error.statusCode = 500
  return next(error)
})

//
//
export { addToWishlist, getWishlist, removeFromWishlist }
