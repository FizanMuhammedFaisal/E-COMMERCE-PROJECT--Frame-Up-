import asyncHandler from 'express-async-handler'
import Coupon from '../models/couponModel.js'
const addCoupon = asyncHandler(async (req, res, next) => {
  try {
    const {
      code,
      discountType,
      discountAmount,
      minPurchaseAmount,
      maxDiscountAmount,
      validFrom,
      validTill,
      status
    } = req.body.newCoupon
    console.log(req.body)
    const existingCoupon = await Coupon.findOne({ code })
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' })
    }

    // Create new coupon
    const newCoupon = new Coupon({
      code,
      discountType,
      discountAmount,
      minPurchaseAmount,
      maxDiscountAmount,
      validFrom,
      validTill,
      status: status ? 'Active' : 'Blocked'
    })

    await newCoupon.save()
    res
      .status(201)
      .json({ message: 'Coupon created successfully', coupon: newCoupon })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})
//
//
const getAllCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find({})
  if (coupons) {
    setTimeout(() => {
      res.status(200).json({ coupons })
    }, 2000)
  }
})
//
//
const updateStatus = asyncHandler(async (req, res, next) => {
  const { couponId, newStatus } = req.body

  try {
    if (!couponId || !newStatus) {
      return res
        .status(400)
        .json({ message: 'Coupon ID and new status are required.' })
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      { status: newStatus },
      { new: true }
    )

    if (!updatedCoupon) {
      const error = new Error('no Coupon found')
      error.statusCode = 404
      return next(error)
    }

    res
      .status(200)
      .json({ message: 'Coupon status updated successfully!', updatedCoupon })
  } catch (err) {
    console.error('Error updating coupon status:', err)
    const error = new Error('Internal server errorer')
    error.statusCode = 500
    return next(error)
  }
})
//
//
const getCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find({ status: 'Active' }).select(
    '-usedBy -status -_id  -__v '
  )

  if (coupons) {
    res.status(200).json({ coupons })
  }
})
//
//
const applyCoupon = asyncHandler(async (req, res) => {
  const { code: couponCode, totalPurchaseAmount } = req.body

  const coupon = await Coupon.findOne({ code: couponCode })

  if (!coupon) {
    return res.status(404).json({ message: 'Coupon not found.' })
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
    return res.status(400).json({ message: errorMessage })
  }

  const discountAmount =
    coupon.discountType === 'percentage'
      ? (totalPurchaseAmount * coupon.discountAmount) / 100
      : coupon.discountAmount

  const finalDiscount = coupon.maxDiscountAmount
    ? Math.min(discountAmount, coupon.maxDiscountAmount)
    : discountAmount

  if (discountAmount) {
    return res.status(200).json({
      message: 'Coupon applied successfully.',
      discountAmount: finalDiscount,
      success: true
    })
  }

  console.error('Error applying coupon:', error)
  res.status(500).json({ message: 'Server error. Please try again later.' })
})
//
//
const removeCoupon = asyncHandler(async (req, res, next) => {
  const { code: couponCode, totalPurchaseAmount } = req.body
  // remove coupon
  res.status(200).json({ message: 'done', success: true })
})
const deleteCoupon = asyncHandler(async (req, res, next) => {
  const id = req.params.id
  console.log('asdfasfasfasfad')
  if (!id) {
    const error = new Error('id Required for deltetion')
    error.statusCode = 400
    return next(error)
  }
  const coupon = await Coupon.findByIdAndDelete(id)
  if (coupon) {
    res.status(200).json({
      message: 'Coupon deleted successfully'
    })
  }
})
export {
  addCoupon,
  getAllCoupons,
  updateStatus,
  getCoupons,
  applyCoupon,
  removeCoupon,
  deleteCoupon
}
