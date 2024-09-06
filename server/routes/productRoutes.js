import express from 'express'
const router = express.Router()
import { addProducts } from '../controllers/productController.js'
router.post('/add', addProducts)
export default router
