import express from "express"
const router = express.Router()
import {
  createReturnRequest,
  updateReturnRequest,
  getReturnRequests,
  createSingleReturnRequest,
} from "../controllers/returnRequestController.js"
import { protect } from "../middlewares/authMiddleware.js"
import admin from "../middlewares/authAdminMiddleware.js"
router.post("/", protect, createReturnRequest)
router.post("/return-item", protect, createSingleReturnRequest)
//for admin
router.post("/update", protect, updateReturnRequest)
router.get("/", protect, getReturnRequests)

export default router
