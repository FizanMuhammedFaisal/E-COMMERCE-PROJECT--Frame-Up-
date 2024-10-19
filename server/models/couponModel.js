import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    discountAmount: {
      type: Number,
      required: true
    },
    minPurchaseAmount: {
      type: Number,
      default: 0
    },
    maxDiscountAmount: {
      type: Number
    },
    validFrom: {
      type: Date,
      required: true
    },
    validTill: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Active', 'Blocked'],
      default: 'Active'
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

couponSchema.methods.isValidPeriod = function () {
  const now = Date.now()
  return now >= this.validFrom && now <= this.validTill
}

couponSchema.methods.isValid = function (totalPurchaseAmount) {
  return (
    this.status === 'Active' &&
    this.isValidPeriod() &&
    totalPurchaseAmount >= this.minPurchaseAmount
  )
}

// Export the model
const Coupon = mongoose.model('Coupon', couponSchema)

export default Coupon
