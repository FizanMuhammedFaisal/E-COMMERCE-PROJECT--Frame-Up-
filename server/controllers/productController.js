import mongoose from 'mongoose'
import Category from '../models/categoryModel.js'
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
  const {
    sortBy,
    themes,
    styles,
    techniques,
    priceRange,
    aA_zZ,
    zZ_aA,
    includeCategories
  } = req.query
  console.log(aA_zZ, zZ_aA, priceRange)
  const filter = {}
  const priceFilter = {}
  // Category filters
  const categoryNames = [
    ...(themes ? themes.split(',') : []),
    ...(styles ? styles.split(',') : []),
    ...(techniques ? techniques.split(',') : [])
  ]

  if (categoryNames.length) {
    const categories = await Category.find({ name: { $in: categoryNames } })
    const categoryIds = categories.map(cat => cat._id)
    if (categoryIds.length) {
      filter.productCategories = { $in: categoryIds }
    }
  }

  // Filtering by price range
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split(',').map(Number)
    filter.productPrice = { $gte: minPrice, $lte: maxPrice }
    priceFilter.productPrice = { $gte: minPrice, $lte: maxPrice }
  }

  let sortOption = {}
  if (sortBy === 'priceLowToHigh') {
    sortOption.productPrice = 1 // Ascending
  } else if (sortBy === 'priceHighToLow') {
    sortOption.productPrice = -1 // Descending
  }
  if (aA_zZ === 'true') {
    sortOption.productName = 1 // Ascending
  } else if (zZ_aA === 'true') {
    sortOption.productName = -1 // Descending
  }

  try {
    // Fetch filtered, paginated, and sorted products
    const productsQuery = Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortOption)
      .collation({ locale: 'en', strength: 2 })
      .populate('productCategories')

    // Total number of items after applying filters (for pagination purposes)
    const countQuery = Product.countDocuments(filter)

    let categoriesQuery
    if (includeCategories === 'true') {
      categoriesQuery = Product.aggregate([
        { $match: priceFilter },
        { $unwind: '$productCategories' },
        {
          $lookup: {
            from: 'categories',
            localField: 'productCategories',
            foreignField: '_id',
            as: 'categoryDetails'
          }
        },
        { $unwind: '$categoryDetails' },
        {
          $group: {
            _id: {
              categoryId: '$categoryDetails._id',
              categoryName: '$categoryDetails.name',
              categoryType: '$categoryDetails.type'
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            categoryId: '$_id.categoryId',
            categoryName: '$_id.categoryName',
            categoryType: '$_id.categoryType',
            count: 1,
            _id: 0
          }
        },
        { $sort: { categoryType: 1, categoryName: 1 } }
      ])
    }

    // Execute all queries concurrently
    const [products, totalItems, categoryCounts] = await Promise.all([
      productsQuery,
      countQuery,
      categoriesQuery
    ])

    const availableCategories = {
      Themes: [],
      Styles: [],
      Techniques: []
    }

    if (categoryCounts) {
      categoryCounts.forEach(category => {
        const { categoryType } = category
        if (categoryType === 'Theme') {
          availableCategories.Themes.push(category)
        } else if (categoryType === 'Style') {
          availableCategories.Styles.push(category)
        } else if (categoryType === 'Technique') {
          availableCategories.Techniques.push(category)
        }
      })
    }
    console.log(Math.ceil(totalItems / limit))

    res.json({
      products,
      totalItems,
      availableCategories,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit)
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Error fetching products' })
  }
})

// @dec for listing products
const getProductById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    const product = await Product.findById(id)
      .populate('productCategories')
      .exec()

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
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

  // Create the filter based on the user's request
  try {
    const products = await Product.find({})
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
//

const getSearched = asyncHandler(async (req, res) => {
  const query = req.query.q
  try {
    if (!query) {
      return res.status(400).json({ message: 'No search query provided.' })
    }
    const regex = new RegExp(query, 'i')
    const [products, categories] = await Promise.all([
      Product.find(
        {
          $or: [
            { productName: { $regex: regex } },
            { description: { $regex: regex } }
          ]
        },
        { productName: 1, thumbnailImage: 1, productPrice: 1, _id: 1 }
      ).limit(5),
      Category.find({ name: { $regex: regex } }, { name: 1, _id: 1 }).limit(5)
    ])
    console.log(products, categories)
    return res.json({ products, categories })
  } catch (error) {
    console.error('Error searching for products:', error)
    return res
      .status(500)
      .json({ message: 'Server error. Please try again later.' })
  }
})

export {
  addProducts,
  getProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  getProductsAdmin,
  getSearched
}
