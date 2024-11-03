import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import admin from '../middlewares/authAdminMiddleware.js'
import { getAnswer } from '../controllers/chatController.js'
router.post('/query', getAnswer)
export default router
