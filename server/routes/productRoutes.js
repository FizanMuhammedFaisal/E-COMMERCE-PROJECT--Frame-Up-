import express from "express"
const router = express.Router()
import {
  validateGetProducts,
  validateEditProduct,
} from "../middlewares/validation/reqValidator.js"
import Validate from "../middlewares/validation/validateRequest.js"

import {
  addProducts,
  getProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  getProductsAdmin,
  getSearched,
  getProductCards,
  getRelatedProducts,
  getNewArt,
} from "../controllers/productController.js"
import { validateAddProduct } from "../middlewares/validation/reqValidator.js"
router.post("/add", validateAddProduct, Validate, addProducts)
router.get("/get-products", validateGetProducts, Validate, getProducts)
router.get("/get-related-products/:id", getRelatedProducts)
router.get("/get-cards", getProductCards)
router.get("/get-new-cards", getNewArt)
router.get("/get-products-admin", getProductsAdmin)
router.get("/:id", getProductById)
router.put("/:id", validateEditProduct, Validate, updateProduct)
router.put("/:id/status", updateProductStatus)
router.get("/search/items", getSearched)

export default router
