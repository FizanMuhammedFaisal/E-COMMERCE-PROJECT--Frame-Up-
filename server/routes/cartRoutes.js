import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import {
  addToCart,
  fetchCart,
  removeFromCart,
  updateQuantity
} from '../controllers/cartController.js'

router.post('/add-to-cart', protect, addToCart)
router.get('/', protect, fetchCart)
router.delete('/remove/:productId', protect, removeFromCart)
router.put('/update-quantity', protect, updateQuantity)

export default router
