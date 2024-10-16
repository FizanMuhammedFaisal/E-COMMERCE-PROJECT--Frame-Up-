import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import {
  initiateOrder,
  getOrders,
  cancelOrder,
  getOrderDetails,
  getOrdersAdmin,
  updateOrderStatus,
  createOrder,
  verifyPayment
} from '../controllers/orderController.js'

//users
router.post('/initiate-order', protect, initiateOrder)
router.post('/initiate-order/razor-pay', protect, createOrder)
router.post('/verify-payment', protect, verifyPayment)
router.get('/', protect, getOrders)
router.post('/cancel/:id', cancelOrder)
router.get('/:orderId', getOrderDetails)
// admins
router.get('/admin', getOrdersAdmin)
router.put('/update-status', updateOrderStatus)
export default router
