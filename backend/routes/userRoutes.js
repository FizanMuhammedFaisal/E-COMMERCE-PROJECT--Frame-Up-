import express from 'express'
const router = express.Router()
import { userlogin, userSignUp } from '../controllers/userController.js'
router.post('/signup', userSignUp)
router.post('/login', userlogin)

export default router
