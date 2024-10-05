import express from 'express'
const router = express.Router()
import { validateGetProducts } from '../middlewares/validation/reqValidator.js'

import {
  addProducts,
  getProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  getProductsAdmin,
  getSearched,
  getProductCards
} from '../controllers/productController.js'
router.post('/add', addProducts)
router.get('/get-products', validateGetProducts, getProducts)
router.get('/get-cards', getProductCards)
router.get('/get-products-admin', getProductsAdmin)
router.get('/:id', getProductById)
router.put('/:id', updateProduct)
router.put('/:id/status', updateProductStatus)
router.get('/search/items', getSearched)

export default router
