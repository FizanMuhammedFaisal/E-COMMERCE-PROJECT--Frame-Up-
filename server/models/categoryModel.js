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
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Blocked'],
    default: 'Active'
  }
})
categorySchema.index({ name: 'text' })
const Category = mongoose.model('Category', categorySchema)

export default Category
