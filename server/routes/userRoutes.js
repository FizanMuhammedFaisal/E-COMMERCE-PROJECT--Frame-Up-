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
  resetPassword
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
router.post('/access', refreshTokenMiddleware, makeAccess)
//

export default router
