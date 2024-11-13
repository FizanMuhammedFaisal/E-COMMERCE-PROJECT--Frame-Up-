import mongoose from "mongoose"

const resetTokenSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String },
    otpExpiresAt: { type: Date, required: true },
  },
  { timestamps: true },
)
const ResetToken = mongoose.model("ResetToken", resetTokenSchema)

export default ResetToken
