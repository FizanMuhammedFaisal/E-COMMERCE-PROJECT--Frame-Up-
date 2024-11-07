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
  getUserOrders,
  getInvoiceDownloadURL,
  cancelOrderItem,
  cancelOrderItemAdmin
} from '../controllers/orderController.js'

//users
router.post('/initiate-order', protect, initiateOrder)
router.post('/initiate-order/razor-pay', protect, createRazorpayOrder)

router.post('/verify-payment', protect, verifyPayment)
router.post('/retry-payment', protect, retryPayment)
router.get('/', protect, getUserOrders)
router.post('/cancel', protect, cancelOrder)
router.post('/cancel-item', protect, cancelOrderItem)
router.get('/download-invoice/:id', getInvoiceDownloadURL)
router.get('/:orderId', getOrderDetails)
// admins
router.get('/admin', getOrdersAdmin)
router.get('/all/orders/admin', protect, getOrders)
router.put('/cancel/:orderId/admin', cancelOrderAdmin)
router.post('/cancel-item/admin', cancelOrderItemAdmin)
router.put('/update-status', updateOrderStatus)
export default router
