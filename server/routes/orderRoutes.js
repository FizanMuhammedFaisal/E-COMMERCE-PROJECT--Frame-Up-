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
  createRazorpayOrder,
  verifyPayment,
  retryPayment,
  cancelOrderAdmin,
  getUserOrders
} from '../controllers/orderController.js'

//users
router.post('/initiate-order', protect, initiateOrder)
router.post('/initiate-order/razor-pay', protect, createRazorpayOrder)
router.post('/verify-payment', protect, verifyPayment)
router.post('/retry-payment', protect, retryPayment)
router.get('/', protect, getUserOrders)
router.post('/cancel', protect, cancelOrder)
router.get('/:orderId', getOrderDetails)
// admins
router.get('/admin', getOrdersAdmin)
router.get('/all/orders/admin', protect, getOrders)
router.put('/cancel/:orderId/admin', cancelOrderAdmin)
router.put('/update-status', updateOrderStatus)
export default router
