import express from 'express'
const router = express.Router()
import {
  addProducts,
  getProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  getProductsAdmin
} from '../controllers/productController.js'
router.post('/add', addProducts)
router.get('/get-products', getProducts)
router.get('/get-products-admin', getProductsAdmin)
router.get('/:id', getProductById)
router.put('/:id', updateProduct)
router.put('/:id/status', updateProductStatus)
export default router
