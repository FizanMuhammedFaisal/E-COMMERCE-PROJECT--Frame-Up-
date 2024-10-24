import mongoose from 'mongoose'

const returnSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: Date,
  rejectedAt: Date,
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
})
const Return = mongoose.model('Return', returnSchema)
export default Return
