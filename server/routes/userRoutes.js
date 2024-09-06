import express from 'express'
import verifySessionToken from '../middlewares/authOTPMiddleware.js'
const router = express.Router()
import {
  userlogin,
  checkUser,
  googleAuth,
  sendOTP,
  verifyOTP
} from '../controllers/userController.js'
router.post('/checkUser', checkUser)
router.post('/login', userlogin)
router.post('/google/auth', googleAuth)
router.post('/send-otp', verifySessionToken, sendOTP)
router.post('/verify-otp', verifySessionToken, verifyOTP)

export default router
