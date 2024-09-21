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
    dimensions,
    productYear,
    productStock,
    productInformation
  } = req.body

  console.log(req.body)

  try {
    const processedProductCategory = {
      themes: productCategory.themes.map(theme => theme.value),
      styles: productCategory.styles.map(style => style.value),
      techniques: productCategory.techniques.map(technique => technique.value)
    }
    // Combine all category IDs into a single array
    const productCategories = [
      ...processedProductCategory.themes,
      ...processedProductCategory.styles,
      ...processedProductCategory.techniques
    ]
    console.log(processedProductCategory, productCategories)

    // Create the product using the extracted IDs
    const newProduct = await Product.create({
      productName,
      productPrice,
      productDescription,
      productImages,
      thumbnailImage,
      weight,
      dimensions,
      productCategories,
      productYear,
      productStock,
      productInformation
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

// @dec for listing products
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  const filter = {}

  if (themes) {
    filter.Themes = { $in: themes.split(',') } // Assumes Themes field is an array in the database
  }
  if (styles) {
    filter.Styles = { $in: styles.split(',') } // Assumes Styles field is an array in the database
  }
  if (techniques) {
    filter.Techniques = { $in: techniques.split(',') } // Assumes Techniques field is an array in the database
  }

  // Filtering by price range
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split(',').map(Number)
    filter.productPrice = { $gte: minPrice, $lte: maxPrice }
  }
  try {
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('productCategories')
    const totalItems = await Product.countDocuments()

    res.json({ products, totalItems })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' })
  }
})
// @dec for listing products
const getProductById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params

    const product = await Product.findById(id)
      .populate('productCategories') // Populate category details
      .exec()

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    console.log(product)
    res.json(product) // Return the product data
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ message: 'Server error' })
  }
})
//
const updateProduct = async (req, res) => {
  const { id } = req.params
  const {
    productName,
    productDescription,
    productPrice,
    productCategories,
    dimensions,
    weight,
    productYear,
    productStock
  } = req.body
  console.log(req.body)
  const getCategoryIds = categories => {
    return categories.map(category => category._id)
  }

  const categoriesIds = getCategoryIds(productCategories)
  try {
    // Find the product and update it
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      {
        productName,
        productDescription,
        productPrice,
        productCategories: categoriesIds,
        dimensions,
        weight,
        productYear,
        productStock
      },
      { new: true, runValidators: true }
    )

    // Check if the product was found
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Send the updated product as the response
    res.status(200).json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    res
      .status(500)
      .json({ message: 'Failed to update product. Please try again.' })
  }
}
//
const updateProductStatus = asyncHandler(async (req, res) => {
  const productId = req.params.id
  const { status } = req.body
  console.log(status, productId)

  const user = await Product.findByIdAndUpdate(
    { _id: productId },
    { status },
    { new: true }
  )
  if (!user) {
    return res.status(400).json({ message: 'product not found' })
  }

  setTimeout(() => {
    return res.status(200).json({ message: 'status updated sucessfully' })
  }, 100)
})
//

const getProductsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit
  const includeBlocked = req.query.includeBlocked === 'true'

  // Create the filter based on the user's request
  const filter = includeBlocked ? {} : { status: { $ne: 'Blocked' } }
  try {
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('productCategories')
    const totalItems = await Product.countDocuments()

    res.json({ products, totalItems })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' })
  }
})

//
export {
  addProducts,
  getProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  getProductsAdmin
}
