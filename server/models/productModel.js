import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  productCategory: {
    type: String,
    required: true
  },
  productDescription: {
    type: String,
    required: true
  },
  productImages: {
    type: [String], // Array of image URLs or paths
    required: true
  },
  thumbnailImage: {
    type: String
  },
  weight: {
    type: Number // Weight in kg
  },
  dimensions: {
    type: String // Dimensions as a string -> "20x30x10 cm"
  }
})

const Product = mongoose.model('Product', productSchema)

export default Product
