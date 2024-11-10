import Cart from '../models/cartModel.js'

import Coupon from '../models/couponModel.js'
import Product from '../models/productModel.js'

const getCartDetails = async userId => {
  try {
    const cart = await Cart.aggregate([
      { $match: { userId: userId } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          let: { productId: '$items.productId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$productId'] } } },
            {
              $lookup: {
                from: 'discounts',
                let: { productId: '$_id', categoryIds: '$productCategories' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          { $eq: ['$targetId', '$$productId'] },
                          { $in: ['$targetId', '$$categoryIds'] }
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
                as: 'allDiscounts'
              }
            },
            {
              $addFields: {
                validDiscountsWithAmount: {
                  $map: {
                    input: {
                      $filter: {
                        input: '$allDiscounts',
                        as: 'discount',
                        cond: {
                          $and: [
                            {
                              $cond: [
                                {
                                  $eq: ['$$discount.discountType', 'percentage']
                                },
                                {
                                  $and: [
                                    { $lte: ['$$discount.discountValue', 100] },
                                    {
                                      $lt: [
                                        {
                                          $multiply: [
                                            '$productPrice',
                                            {
                                              $divide: [
                                                '$$discount.discountValue',
                                                100
                                              ]
                                            }
                                          ]
                                        },
                                        '$productPrice'
                                      ]
                                    }
                                  ]
                                },
                                {
                                  $and: [
                                    {
                                      $lt: [
                                        '$$discount.discountValue',
                                        '$productPrice'
                                      ]
                                    },
                                    {
                                      $gte: [
                                        '$productPrice',
                                        { $ifNull: ['$$discount.minValue', 0] }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      }
                    },
                    as: 'discount',
                    in: {
                      $mergeObjects: [
                        '$$discount',
                        {
                          calculatedAmount: {
                            $cond: [
                              {
                                $eq: ['$$discount.discountType', 'percentage']
                              },
                              {
                                $multiply: [
                                  '$productPrice',
                                  { $divide: ['$$discount.discountValue', 100] }
                                ]
                              },
                              '$$discount.discountValue'
                            ]
                          }
                        }
                      ]
                    }
                  }
                }
              }
            },
            {
              $addFields: {
                validDiscounts: {
                  $sortArray: {
                    input: '$validDiscountsWithAmount',
                    sortBy: { calculatedAmount: -1 }
                  }
                }
              }
            },
            {
              $addFields: {
                activeDiscount: { $arrayElemAt: ['$validDiscounts', 0] }
              }
            },
            {
              $addFields: {
                maxDiscount: {
                  $cond: [
                    { $ne: ['$activeDiscount', null] },
                    '$activeDiscount.calculatedAmount',
                    0
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
                    '$productPrice'
                  ]
                },
                appliedDiscount: {
                  $cond: [{ $gt: ['$maxDiscount', 0] }, '$activeDiscount', null]
                }
              }
            }
          ],
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          items: {
            $push: {
              productId: '$productDetails._id',
              productName: '$productDetails.productName',
              thumbnailImage: '$productDetails.thumbnailImage',
              quantity: '$items.quantity',
              productPrice: '$productDetails.productPrice',
              discountPrice: '$productDetails.discountPrice',
              maxDiscount: '$productDetails.maxDiscount',
              appliedDiscount: '$productDetails.appliedDiscount'
            }
          },
          subtotal: {
            $sum: {
              $multiply: ['$items.quantity', '$productDetails.productPrice']
            }
          },
          discount: {
            $sum: {
              $multiply: [
                '$items.quantity',
                { $ifNull: ['$productDetails.maxDiscount', 0] }
              ]
            }
          },
          totalPrice: {
            $sum: {
              $multiply: ['$items.quantity', '$productDetails.discountPrice']
            }
          }
        }
      }
    ])

    return cart
  } catch (error) {
    console.error('Error fetching cart details:', error)
    throw new Error('Error fetching cart details.')
  }
}

const getDiscountedProducts = async (matchCondition, limit = 1) => {
  try {
    const products = await Product.aggregate([
      {
        $match: matchCondition
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
                    { $eq: ['$targetId', '$$productId'] },
                    { $in: ['$targetId', '$$categoryIds'] }
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
          as: 'allDiscounts'
        }
      },
      {
        $addFields: {
          validDiscountsWithAmount: {
            $map: {
              input: {
                $filter: {
                  input: '$allDiscounts',
                  as: 'discount',
                  cond: {
                    $and: [
                      {
                        $cond: [
                          // Percentage discount conditions
                          { $eq: ['$$discount.discountType', 'percentage'] },
                          {
                            $and: [
                              // Ensure percentage discount is within valid range (0-100)
                              { $lte: ['$$discount.discountValue', 100] },
                              // Ensure calculated discount amount does not exceed the product price
                              {
                                $lt: [
                                  {
                                    $multiply: [
                                      '$productPrice',
                                      {
                                        $divide: [
                                          '$$discount.discountValue',
                                          100
                                        ]
                                      }
                                    ]
                                  },
                                  '$productPrice'
                                ]
                              }
                            ]
                          },
                          {
                            $and: [
                              {
                                $lt: [
                                  '$$discount.discountValue',
                                  '$productPrice'
                                ]
                              },
                              {
                                $gte: [
                                  '$productPrice',
                                  { $ifNull: ['$$discount.minValue', 0] }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                }
              },
              as: 'discount',
              in: {
                $mergeObjects: [
                  '$$discount',
                  {
                    calculatedAmount: {
                      $cond: [
                        { $eq: ['$$discount.discountType', 'percentage'] },
                        {
                          $multiply: [
                            '$productPrice',
                            { $divide: ['$$discount.discountValue', 100] }
                          ]
                        },
                        '$$discount.discountValue'
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $addFields: {
          validDiscounts: {
            $sortArray: {
              input: '$validDiscountsWithAmount',
              sortBy: { calculatedAmount: -1 }
            }
          }
        }
      },
      {
        $addFields: {
          activeDiscount: { $arrayElemAt: ['$validDiscounts', 0] }
        }
      },
      {
        $addFields: {
          discountAmount: {
            $cond: [
              { $ne: ['$activeDiscount', null] },
              '$activeDiscount.calculatedAmount',
              0
            ]
          }
        }
      },
      {
        $addFields: {
          discountPrice: {
            $cond: [
              { $gt: ['$discountAmount', 0] },
              { $subtract: ['$productPrice', '$discountAmount'] },
              '$productPrice'
            ]
          },
          appliedDiscount: {
            $cond: [{ $gt: ['$discountAmount', 0] }, '$activeDiscount', null]
          },
          maxDiscount: {
            $cond: [{ $gt: ['$discountAmount', 0] }, '$discountAmount', 0]
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          mergedProduct: { $mergeObjects: '$$ROOT' },
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
      .limit(limit)
      .exec()

    return products
  } catch (error) {
    console.error('Error fetching discounted products:', error)
    throw new Error('Error fetching products.')
  }
}

const applyCoupon = async (code, totalPurchaseAmount) => {
  try {
    const coupon = await Coupon.findOne({ code })
    if (!coupon) {
      throw new Error('Coupon is not valid')
    }

    if (!(await coupon.isValid(totalPurchaseAmount))) {
      let errorMessage = 'Coupon is not valid.'
      if (!coupon.status === 'Active') {
        errorMessage = 'Coupon is inactive.'
      } else if (!(await coupon.isValidPeriod())) {
        errorMessage = 'Coupon is not within the valid period.'
      } else if (totalPurchaseAmount < coupon.minPurchaseAmount) {
        errorMessage = `Minimum purchase amount of ${coupon.minPurchaseAmount} is required to apply this coupon.`
      }
      throw new Error(errorMessage)
    }
    const discountAmount =
      coupon.discountType === 'percentage'
        ? (totalPurchaseAmount * coupon.discountAmount) / 100
        : coupon.discountAmount

    const finalDiscount = coupon.maxDiscountAmount
      ? Math.min(discountAmount, coupon.maxDiscountAmount)
      : discountAmount
    return finalDiscount
  } catch (error) {
    throw new Error(error.message)
  }
}
export { getCartDetails, applyCoupon, getDiscountedProducts }
