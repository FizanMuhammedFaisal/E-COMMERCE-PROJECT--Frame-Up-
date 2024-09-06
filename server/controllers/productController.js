import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'

const addProducts = asyncHandler(async (req, res) => {
  const {
    productName,
    productPrice,
    productCategory,
    productDescription,
    productImages,
    thumbnailImage,
    weight,
    dimensions
  } = req.body
  console.log(req.body)
  res.status(200).json('al good')
})

export { addProducts }
