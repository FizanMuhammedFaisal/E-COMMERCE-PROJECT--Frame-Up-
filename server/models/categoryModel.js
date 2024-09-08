import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String, // 'Theme', 'Style', or 'Technique'
    enum: ['Theme', 'Style', 'Technique'],
    required: true
  },
  description: {
    type: String // Optional
  }
})

const Category = mongoose.model('Category', categorySchema)

export default Category
