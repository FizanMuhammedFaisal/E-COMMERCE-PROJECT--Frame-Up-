import express from 'express'
const router = express.Router()
import { getWallet } from '../controllers/walletController.js'
import { protect } from '../middlewares/authMiddleware.js'
import admin from '../middlewares/authAdminMiddleware.js'
router.get('/', protect, getWallet)
export default router
