import mongoose from 'mongoose'

const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    discountTarget: {
      type: String,
      enum: ['Category', 'Products'],
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
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'discountType'
    },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Blocked'],
      default: 'active'
    }
  },
  { timestamps: true }
)

const Discount = mongoose.model('Discount', discountSchema)

export default Discount
