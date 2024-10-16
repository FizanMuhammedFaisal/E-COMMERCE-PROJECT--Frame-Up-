import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import admin from '../middlewares/authAdminMiddleware.js'
import {
  login,
  getUsers,
  logout,
  addUser,
  deleteUser,
  updateUser,
  updateStatus,
  addCategory,
  fetchThemes,
  fetchStyles,
  fetchTechniques,
  updateArtistStatus,
  updateCategories,
  getCategoryDiscounds,
  getProductDiscounds,
  addDiscount
} from '../controllers/adminController.js'

router.post('/login', login)
router.get('/getusers', protect, admin, getUsers)
router.post('/adduser', protect, admin, addUser)
router.post('/logout', logout)
router.put('/updateuser', protect, admin, updateUser)
router.post('/deleteuser', protect, admin, deleteUser)
router.put('/users/:id/status', updateStatus)
router.post('/add-category', addCategory)
router.get('/get-category-themes', fetchThemes)
router.get('/get-category-styles', fetchStyles)
router.get('/get-category-techniques', fetchTechniques)
router.post('/categories/update-status', updateCategories)
//
router.get('/get-category-discounts', getCategoryDiscounds)
router.get('/get-product-discounts', getProductDiscounds)
router.post('/add-discount', addDiscount)
//
router.put('/artists/:id/status', updateArtistStatus)
//

export default router
