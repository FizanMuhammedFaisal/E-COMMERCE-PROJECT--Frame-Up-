import mongoose from 'mongoose'

const discountSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['active', 'disabled'],
      default: 'active'
    }
  },
  { timestamps: true }
)

const Discount = mongoose.model('Discount', discountSchema)

export default Discount
