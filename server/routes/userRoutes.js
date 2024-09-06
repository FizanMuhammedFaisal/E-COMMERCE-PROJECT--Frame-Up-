import express from 'express'
import verifySessionToken from '../middlewares/authOTPMiddleware.js'
import { refreshTokenMiddleware } from '../middlewares/authRefreshToken.js'
import { protect } from '../middlewares/authMiddleware.js'
const router = express.Router()
import {
  userlogin,
  checkUser,
  googleAuth,
  sendOTP,
  verifyOTP,
  makeAccess
} from '../controllers/userController.js'
router.post('/checkUser', checkUser)
router.post('/login', userlogin)
router.post('/google/auth', googleAuth)
router.post('/send-otp', verifySessionToken, sendOTP)
router.post('/verify-otp', verifySessionToken, verifyOTP)
router.post('/access', refreshTokenMiddleware, makeAccess)
router.get('/hi', protect, (req, res) => {
  res.json('hii')
})

export default router
