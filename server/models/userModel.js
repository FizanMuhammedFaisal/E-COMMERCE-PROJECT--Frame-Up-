import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const userSchema = mongoose.Schema({
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
  profile: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Blocked', 'Pending'],
    default: 'Blocked'
  },
  firebaseUid: { type: String, default: null },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}
const User = mongoose.model('User', userSchema)
export default User
