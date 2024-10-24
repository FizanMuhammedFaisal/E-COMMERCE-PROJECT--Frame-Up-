import express from 'express'
const router = express.Router()
import {
  getSalesReport,
  getDownloadURL
} from '../controllers/salesReportController.js'
import { protect } from '../middlewares/authMiddleware.js'
import admin from '../middlewares/authAdminMiddleware.js'
router.get('/', protect, admin, getSalesReport)
router.get('/download-report', protect, admin, getDownloadURL)
export default router
