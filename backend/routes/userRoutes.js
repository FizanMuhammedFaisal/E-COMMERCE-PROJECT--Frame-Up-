import express from 'express'
const router = express.Router()
import {
  userlogin,
  userSignUp,
  googleAuth
} from '../controllers/userController.js'
router.post('/signup', userSignUp)
router.post('/login', userlogin)
router.post('/google/auth', googleAuth)

export default router
