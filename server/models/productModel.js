import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true
    },
    productPrice: {
      type: Number,
      required: true
    },

    discountPrice: {
      type: Number
    },
    productCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the Category model
        required: true
      }
    ],
    productDescription: {
      type: String,
      required: true
    },
    productImages: {
      type: [String], // Array of image URLs or paths
      required: true
    },
    thumbnailImage: {
      type: [String]
    },
    weight: {
      type: Number //in kg
    },
    dimensions: {
      type: String
    },
    productYear: {
      type: Number
    },
    productInformation: {
      type: String
    },
    productStock: {
      type: Number
    },
    status: {
      type: String,
      enum: ['Active', 'Blocked'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
)
productSchema.index({ productName: 'text', productDescription: 'text' })
const Product = mongoose.model('Product', productSchema)

export default Product
