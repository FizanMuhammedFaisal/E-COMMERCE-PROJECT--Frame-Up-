import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import {
  initiateOrder,
  getOrders,
  cancelOrder
} from '../controllers/orderController.js'

//users
router.post('/initiate-order', protect, initiateOrder)
router.get('/', protect, getOrders)
router.post('/cancel/:id', cancelOrder)

// admins

export default router
