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
  try {
    // Create the product using Product.create()
    const newProduct = await Product.create({
      productName,
      productPrice,
      productCategory,
      productDescription,
      productImages,
      thumbnailImage,
      weight,
      dimensions
    })

    // Send success response with the created product
    res.status(201).json(newProduct)
  } catch (error) {
    // Send error response if there is an issue
    console.error(error.message)
    res
      .status(500)
      .json({ message: 'Error adding product', error: error.message })
  }
})

export { addProducts }
