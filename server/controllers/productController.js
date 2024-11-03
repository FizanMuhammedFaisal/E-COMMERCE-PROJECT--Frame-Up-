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
    productInformation,
    artistName,
    discountPrice
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
    console.log(artistName)

    // Create the product using the extracted IDs
    const newProduct = await Product.create({
      productName,
      productPrice,
      discountPrice,
      productDescription,
      productImages,
      thumbnailImage,
      artist: artistName.id,
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

// @dec for listing products-/filtered/discounted
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit
  const {
    searchData,
    sortBy,
    themes,
    styles,
    techniques,
    priceRange,
    aA_zZ,
    zZ_aA,
    includeCategories
  } = req.query

  const filter = { status: 'Active' }
  const priceFilter = { status: 'Active' }

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

  // Search functionality
  if (searchData) {
    const searchRegex = new RegExp(searchData, 'i') // 'i' for case-insensitive search
    filter.$or = [
      { productName: { $regex: searchRegex } },
      { productDescription: { $regex: searchRegex } }
    ]
  }

  let sortOption = {}
  if (sortBy === 'priceLowToHigh') {
    sortOption.productPrice = 1
  } else if (sortBy === 'priceHighToLow') {
    sortOption.productPrice = -1
  }
  if (aA_zZ === 'true') {
    sortOption.productName = 1
  } else if (zZ_aA === 'true') {
    sortOption.productName = -1
  }
  if (Object.keys(sortOption).length === 0) {
    sortOption.createdAt = -1
  }
  console.log(sortOption)
  try {
    // Fetch filtered, paginated, and sorted products
    const productsQuery = Product.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'discounts',
          let: { productId: '$_id', categoryIds: '$productCategories' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$targetId', '$$productId'] }, //product dicount
                    { $in: ['$targetId', '$$categoryIds'] } // category discount
                  ]
                }
              }
            },
            {
              $match: {
                $and: [
                  { status: 'Active' },
                  {
                    $or: [
                      {
                        startDate: { $lte: new Date() },
                        endDate: { $gte: new Date() }
                      },
                      {
                        startDate: { $exists: false },
                        endDate: { $exists: false }
                      }
                    ]
                  }
                ]
              }
            }
          ],
          as: 'discounts'
        }
      },
      {
        $unwind: {
          path: '$discounts',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          productDiscount: {
            $cond: [
              { $eq: ['$discounts.targetId', '$_id'] },
              {
                $cond: [
                  { $eq: ['$discounts.discountType', 'percentage'] },
                  {
                    $multiply: [
                      '$productPrice',
                      { $divide: ['$discounts.discountValue', 100] }
                    ]
                  },
                  '$discounts.discountValue'
                ]
              },
              0
            ]
          },
          categoryDiscount: {
            $cond: [
              { $in: ['$discounts.targetId', '$productCategories'] },
              {
                $cond: [
                  { $eq: ['$discounts.discountType', 'percentage'] },
                  {
                    $multiply: [
                      '$productPrice',
                      { $divide: ['$discounts.discountValue', 100] }
                    ]
                  },
                  '$discounts.discountValue'
                ]
              },
              0
            ]
          }
        }
      },
      {
        $addFields: {
          maxDiscount: {
            $cond: [
              { $gt: ['$productDiscount', '$categoryDiscount'] },
              '$productDiscount',
              '$categoryDiscount'
            ]
          },
          // add applied to the array
          appliedDiscount: {
            $cond: [
              { $gt: ['$productDiscount', '$categoryDiscount'] },
              '$discounts',
              '$discounts'
            ]
          }
        }
      },
      {
        $addFields: {
          discountPrice: {
            $cond: [
              { $gt: ['$maxDiscount', 0] },
              { $subtract: ['$productPrice', '$maxDiscount'] },
              null
            ]
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          mergedProduct: { $mergeObjects: '$$ROOT' }, //merge everything
          maxDiscount: { $first: '$maxDiscount' },
          appliedDiscount: { $first: '$appliedDiscount' }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$mergedProduct',
              {
                discountPrice: '$discountPrice'
              }
            ]
          }
        }
      },
      { $sort: sortOption },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'categories',
          localField: 'productCategories',
          foreignField: '_id',
          as: 'productCategories'
        }
      },
      {
        $lookup: {
          from: 'artists',
          localField: 'artist',
          foreignField: '_id',
          as: 'artist'
        }
      },
      {
        $unwind: {
          path: '$artist',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).collation({ locale: 'en', strength: 2 })

    // Total number of items after applying filters (for pagination purposes)
    const countQuery = Product.countDocuments(filter)

    let categoriesQuery = null
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
    // console.log(products)
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
    console.log(id)
    const ObjectId = mongoose.Types.ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    const product = await Product.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'discounts',
          let: { productId: '$_id', categoryIds: '$productCategories' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$targetId', '$$productId'] }, //product dicount
                    { $in: ['$targetId', '$$categoryIds'] } // category discount
                  ]
                }
              }
            },
            {
              $match: {
                $and: [
                  { status: 'Active' },
                  {
                    $or: [
                      {
                        startDate: { $lte: new Date() },
                        endDate: { $gte: new Date() }
                      },
                      {
                        startDate: { $exists: false },
                        endDate: { $exists: false }
                      }
                    ]
                  }
                ]
              }
            }
          ],
          as: 'discounts'
        }
      },
      {
        $unwind: {
          path: '$discounts',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          productDiscount: {
            $cond: [
              { $eq: ['$discounts.targetId', '$_id'] },
              {
                $cond: [
                  { $eq: ['$discounts.discountType', 'percentage'] },
                  {
                    $multiply: [
                      '$productPrice',
                      { $divide: ['$discounts.discountValue', 100] }
                    ]
                  },
                  '$discounts.discountValue'
                ]
              },
              0
            ]
          },
          categoryDiscount: {
            $cond: [
              { $in: ['$discounts.targetId', '$productCategories'] },
              {
                $cond: [
                  { $eq: ['$discounts.discountType', 'percentage'] },
                  {
                    $multiply: [
                      '$productPrice',
                      { $divide: ['$discounts.discountValue', 100] }
                    ]
                  },
                  '$discounts.discountValue'
                ]
              },
              0
            ]
          }
        }
      },
      {
        $addFields: {
          maxDiscount: {
            $cond: [
              { $gt: ['$productDiscount', '$categoryDiscount'] },
              '$productDiscount',
              '$categoryDiscount'
            ]
          },
          // add applied to the array
          appliedDiscount: {
            $cond: [
              { $gt: ['$productDiscount', '$categoryDiscount'] },
              '$discounts',
              '$discounts'
            ]
          }
        }
      },
      {
        $addFields: {
          discountPrice: {
            $cond: [
              { $gt: ['$maxDiscount', 0] },
              { $subtract: ['$productPrice', '$maxDiscount'] },
              null
            ]
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          mergedProduct: { $mergeObjects: '$$ROOT' }, //merge everything
          maxDiscount: { $first: '$maxDiscount' },
          appliedDiscount: { $first: '$appliedDiscount' }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$mergedProduct',
              {
                discountPrice: '$discountPrice'
              }
            ]
          }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'productCategories',
          foreignField: '_id',
          as: 'productCategories'
        }
      },
      {
        $lookup: {
          from: 'artists',
          localField: 'artist',
          foreignField: '_id',
          as: 'artist'
        }
      },
      {
        $unwind: {
          path: '$artist',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).exec()
    console.log(product)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ product })
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
    productStock,
    thumbnailImage,
    productImages,
    artist
  } = req.body
  console.log(req.body)
  const getCategoryIds = categories => {
    return categories.map(category => category._id)
  }

  try {
    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    const categoriesIds = productCategories
      ? getCategoryIds(productCategories)
      : product.productCategories
    // for cheking if there is alredy this present(needed this for upating images on admin side)
    const addNewURLs = (existingUrls, newUrls) => {
      const updatedUrls = [...existingUrls]
      newUrls.forEach(url => {
        if (!existingUrls.includes(url)) {
          updatedUrls.push(url)
        }
      })
      return updatedUrls
    }

    // to add them if they only exist
    const updatedThumbnailImage = thumbnailImage
      ? addNewURLs(product.thumbnailImage, thumbnailImage)
      : product.thumbnailImage

    const updatedProductImages = productImages
      ? addNewURLs(product.productImages, productImages)
      : product.productImages

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      {
        productName,
        productDescription,
        productPrice,
        productCategories: categoriesIds,
        dimensions,
        weight,
        productYear,
        productStock,
        artist,
        thumbnailImage: updatedThumbnailImage,
        productImages: updatedProductImages
      },
      { new: true }
    )
      .populate('productCategories')
      .exec()

    res.status(200).json({ updatedProduct })
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

  return res
    .status(200)
    .json({ message: 'status updated sucessfully', success: true })
})
//

const getProductsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit
  const search = req.query.search
  const includeCategories = req.query.includeCategories
  console.log(search)
  function getProducts(products = []) {
    return products.map(product => {
      return { productName: product.productName, _id: product._id }
    })
  }
  if (includeCategories) {
    if (search) {
      console.log('inside serach')
      const regex = new RegExp(search, 'i')
      const Ufproducts = await Product.find({ productName: { $regex: regex } })
        .skip(skip)
        .limit(limit)
      const totalCount = await Product.countDocuments({
        name: { $regex: search, $options: 'i' }
      })
      const totalPages = Math.ceil(totalCount / limit)

      if (Ufproducts) {
        const products = getProducts(Ufproducts)
        return res.json({
          products,
          hasNextPage: page < totalPages,
          currentPage: Number(page),
          totalPages
        })
      } else {
        const error = new Error('error finding user')
        error.statusCode = 400
        return next(error)
      }
    } else {
      try {
        const Ufproducts = await Product.find({}).skip(skip).limit(limit)
        const totalCount = await Product.countDocuments({})
        const totalPages = Math.ceil(totalCount / limit)
        if (Ufproducts) {
          const products = getProducts(Ufproducts)
          res.json({
            products,
            hasNextPage: page < totalPages,
            currentPage: Number(page),
            totalPages
          })
        }
      } catch (error) {
        res.status(500).json({ message: 'Error fetching products' })
      }
    }
  } else {
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
      Category.find(
        { name: { $regex: regex } },
        { name: 1, _id: 1, type: 1 }
      ).limit(5)
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
//
const getProductCards = asyncHandler(async (req, res, next) => {
  const products = await Product.find({}).sort({ productStock: 1 }).limit(9)

  const Products = products.map((product, i) => {
    return {
      image: product.thumbnailImage,
      title: product.productName,
      price: product.productPrice,
      id: product._id
    }
  })
  res.status(200).json({ message: 'fetched Products', Products })
})
//
const getRelatedProducts = asyncHandler(async (req, res, next) => {
  //get related produts
  const { id } = req.params
  console.log(id)
  const productId = new mongoose.Types.ObjectId(id)
  const product = await Product.findById(id)
  if (!product) {
    const error = new Error('Cannot find product.')
    error.statusCode = 400
    return next(error)
  }
  const categoriesIds = product.productCategories
  const artist = product.artist
  console.log(product)
  const products = await Product.aggregate([
    {
      $match: {
        _id: { $ne: productId },
        $or: [{ productCategories: categoriesIds }, { artist: artist }]
      }
    },
    {
      $lookup: {
        from: 'discounts',
        let: { productId: '$_id', categoryIds: '$productCategories' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$targetId', '$$productId'] }, //product dicount
                  { $in: ['$targetId', '$$categoryIds'] } // category discount
                ]
              }
            }
          },
          {
            $match: {
              $and: [
                { status: 'Active' },
                {
                  $or: [
                    {
                      startDate: { $lte: new Date() },
                      endDate: { $gte: new Date() }
                    },
                    {
                      startDate: { $exists: false },
                      endDate: { $exists: false }
                    }
                  ]
                }
              ]
            }
          }
        ],
        as: 'discounts'
      }
    },
    {
      $unwind: {
        path: '$discounts',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        productDiscount: {
          $cond: [
            { $eq: ['$discounts.targetId', '$_id'] },
            {
              $cond: [
                { $eq: ['$discounts.discountType', 'percentage'] },
                {
                  $multiply: [
                    '$productPrice',
                    { $divide: ['$discounts.discountValue', 100] }
                  ]
                },
                '$discounts.discountValue'
              ]
            },
            0
          ]
        },
        categoryDiscount: {
          $cond: [
            { $in: ['$discounts.targetId', '$productCategories'] },
            {
              $cond: [
                { $eq: ['$discounts.discountType', 'percentage'] },
                {
                  $multiply: [
                    '$productPrice',
                    { $divide: ['$discounts.discountValue', 100] }
                  ]
                },
                '$discounts.discountValue'
              ]
            },
            0
          ]
        }
      }
    },
    {
      $addFields: {
        maxDiscount: {
          $cond: [
            { $gt: ['$productDiscount', '$categoryDiscount'] },
            '$productDiscount',
            '$categoryDiscount'
          ]
        },
        // add applied to the array
        appliedDiscount: {
          $cond: [
            { $gt: ['$productDiscount', '$categoryDiscount'] },
            '$discounts',
            '$discounts'
          ]
        }
      }
    },
    {
      $addFields: {
        discountPrice: {
          $cond: [
            { $gt: ['$maxDiscount', 0] },
            { $subtract: ['$productPrice', '$maxDiscount'] },
            null
          ]
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        mergedProduct: { $mergeObjects: '$$ROOT' }, //merge everything
        maxDiscount: { $first: '$maxDiscount' },
        appliedDiscount: { $first: '$appliedDiscount' }
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            '$mergedProduct',
            {
              discountPrice: '$discountPrice'
            }
          ]
        }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'productCategories',
        foreignField: '_id',
        as: 'productCategories'
      }
    },
    {
      $lookup: {
        from: 'artists',
        localField: 'artist',
        foreignField: '_id',
        as: 'artist'
      }
    },
    {
      $unwind: {
        path: '$artist',
        preserveNullAndEmptyArrays: true
      }
    }
  ])
    .limit(10)
    .exec()
  console.log(products)
  if (products) {
    res.status(200).json({ success: true, products })
  }
})
export {
  addProducts,
  getProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  getProductsAdmin,
  getSearched,
  getProductCards,
  getRelatedProducts
}
