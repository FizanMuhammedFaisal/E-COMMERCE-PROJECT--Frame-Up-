import express from 'express'
const router = express.Router()
import {
  createReturnRequest,
  updateReturnRequest
} from '../controllers/returnRequestController.js'
import { protect } from '../middlewares/authMiddleware.js'
import admin from '../middlewares/authAdminMiddleware.js'
router.post('/', protect, createReturnRequest)
router.post('/update', protect, updateReturnRequest)
export default router
