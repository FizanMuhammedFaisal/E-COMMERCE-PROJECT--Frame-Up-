import express from 'express'
import verifySignUpToken from '../middlewares/authSignUpTokenMiddleware.js'
import { refreshTokenMiddleware } from '../middlewares/authRefreshToken.js'
import { protect } from '../middlewares/authMiddleware.js'
const router = express.Router()
import {
  userlogin,
  checkUser,
  googleAuth,
  sendOTP,
  verifyOTP,
  makeAccess,
  verifyResetOTP,
  sendForgotPasswordOTP,
  sendToken,
  checkResetTokenCookie,
  resetPassword,
  addAddress,
  getAddress,
  getUserDetails,
  updateUser,
  updatePassword,
  deleteAddress,
  updateAddress,
  uploadProfile
} from '../controllers/userController.js'
import verifyResetToken from '../middlewares/authResetTokenMiddleware.js'
router.post('/checkUser', checkUser)
router.post('/login', userlogin)
router.post('/google/auth', googleAuth)
router.post('/sendtoken', sendToken)
router.post('/send-reset-otp', verifyResetToken, sendForgotPasswordOTP)
router.post('/verify-reset-otp', verifyResetToken, verifyResetOTP)
router.post('/check-reset-token', checkResetTokenCookie)
router.post('/reset-password', resetPassword)
router.post('/send-otp', verifySignUpToken, sendOTP)
router.post('/verify-otp', verifySignUpToken, verifyOTP)
router.get('/access', refreshTokenMiddleware, makeAccess)
//
router.post('/add-address', protect, addAddress)
router.get('/get-address', protect, getAddress)
//
router.get('/get-user', protect, getUserDetails)
router.post('/update-profile', protect, updateUser)
router.post('/upload-profile', protect, uploadProfile)
router.post('/update-password', protect, updatePassword)
router.delete('/delete-address/:id', protect, deleteAddress)
router.post('/update-address', protect, updateAddress)

export default router
