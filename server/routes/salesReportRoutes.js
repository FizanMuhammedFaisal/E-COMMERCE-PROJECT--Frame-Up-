import express from "express"
const router = express.Router()
import {
  getSalesReport,
  getDownloadURL,
  getSalesTrendsData,
  getTopProductsData,
  getSalesDistributionData,
  getOrderStatusData,
  getOverview,
} from "../controllers/salesReportController.js"
import { protect } from "../middlewares/authMiddleware.js"
import admin from "../middlewares/authAdminMiddleware.js"
router.get("/", protect, admin, getSalesReport)
router.get("/download-report", protect, admin, getDownloadURL)
router.get("/sales-trends-data", getSalesTrendsData)
router.get("/top-products-data", getTopProductsData)
router.get("/sales-distribution-data", getSalesDistributionData)
router.get("/order-status-data", getOrderStatusData)
router.get("/overview", getOverview)
export default router
