import Cart from '../models/cartModel.js'
import Coupon from '../models/couponModel.js'
const getCartDetails = async userId => {
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
                    },
                    status: 'Active',
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
                }
              ],
              as: 'discounts'
            }
          },

          {
            $addFields: {
              maxDiscount: {
                $reduce: {
                  input: '$discounts',
                  initialValue: 0,
                  in: {
                    $max: [
                      '$$value',
                      {
                        $cond: {
                          if: { $eq: ['$$this.discountType', 'percentage'] },
                          then: {
                            $multiply: [
                              '$productPrice',
                              { $divide: ['$$this.discountValue', 100] }
                            ]
                          },
                          else: '$$this.discountValue'
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
              discountPrice: {
                $cond: [
                  { $gt: ['$maxDiscount', 0] },
                  { $subtract: ['$productPrice', '$maxDiscount'] },
                  '$productPrice'
                ]
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
            maxDiscount: '$productDetails.maxDiscount'
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
              {
                $subtract: [
                  '$productDetails.productPrice',
                  '$productDetails.discountPrice'
                ]
              }
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
export { getCartDetails, applyCoupon }
