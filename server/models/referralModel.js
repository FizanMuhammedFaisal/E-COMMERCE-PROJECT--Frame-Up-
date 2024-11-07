import mongoose from 'mongoose'

const referralSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  rewardAmount: {
    type: Number,
    default: 50
  },
  referrerRewardAmount: {
    type: Number,
    default: 100
  },
  referralDate: {
    type: Date,
    default: Date.now
  }
})

const Referral = mongoose.model('Referral', referralSchema)
export default Referral
