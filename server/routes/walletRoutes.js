import express from "express"
const router = express.Router()
import {
  getWallet,
  addMoney,
  verifyAddMoney,
} from "../controllers/walletController.js"
import { protect } from "../middlewares/authMiddleware.js"
import admin from "../middlewares/authAdminMiddleware.js"
router.post("/add-money", protect, addMoney)
router.post("/verify-add-money", protect, verifyAddMoney)
router.get("/", protect, getWallet)
export default router
