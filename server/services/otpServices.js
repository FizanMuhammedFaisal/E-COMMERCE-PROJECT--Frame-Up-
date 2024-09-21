import nodemailer from 'nodemailer'
import crypto from 'crypto'
import TempUser from '../models/tempUserModel.js'
import dotenv from 'dotenv'

dotenv.config()
// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', /// setting gmail for mailing
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999).toString() // Generate a 6-digit OTP
  const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000) // OTP expires in 1 minutes
  return { otp, otpExpiresAt }
}

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It expires in 2 minutes.`
  }

  try {
    console.log(email, otp)
    await transporter.sendMail(mailOptions)
  } catch (error) {
    throw new Error('Failed to send OTP email')
  }
}

export const updateModalWithOTP = async (modal, otp, otpExpiresAt) => {
  modal.otp = otp
  modal.otpExpiresAt = otpExpiresAt
  await modal.save()
}
