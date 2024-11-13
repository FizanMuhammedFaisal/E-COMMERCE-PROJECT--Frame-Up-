import express from "express"
const router = express.Router()
import {
  addCoupon,
  getAllCoupons,
  updateStatus,
  getCoupons,
  applyCoupon,
  removeCoupon,
  deleteCoupon,
  getSingleCoupon,
} from "../controllers/couponController.js"
import { protect } from "../middlewares/authMiddleware.js"
import admin from "../middlewares/authAdminMiddleware.js"
import { ValidateAddCoupon } from "../middlewares/validation/reqValidator.js"
import Validate from "../middlewares/validation/validateRequest.js"
router.post(
  "/add-coupon",
  protect,
  admin,
  ValidateAddCoupon,
  Validate,
  addCoupon,
)
router.get("/all", protect, admin, getAllCoupons)
router.put("/update-status", protect, admin, updateStatus)
router.delete("/:id", deleteCoupon)
router.get("/:id", getSingleCoupon)
//users
router.get("/", getCoupons)
router.post("/apply-coupon", applyCoupon)
router.post("/remove-coupon", removeCoupon)
export default router
