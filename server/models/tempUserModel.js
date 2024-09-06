import mongoose from 'mongoose'

const tempUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: Number,
    default: null
  },
  otp: {
    type: String,

    default: null
  },
  otpExpiresAt: {
    type: Date,

    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // 600 seconds = 10 minutes
  }
})

const TempUser = mongoose.model('TempUser', tempUserSchema)
export default TempUser
