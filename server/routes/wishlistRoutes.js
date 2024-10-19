import express from 'express'
const router = express.Router()

import { protect } from '../middlewares/authMiddleware.js'
import admin from '../middlewares/authAdminMiddleware.js'
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} from '../controllers/wishlistController.js'
router.post('/add', protect, addToWishlist)
router.get('/get', protect, getWishlist)
router.post('/remove', protect, removeFromWishlist)
export default router
