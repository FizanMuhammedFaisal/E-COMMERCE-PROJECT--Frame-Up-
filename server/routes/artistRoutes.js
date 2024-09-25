import express from 'express'
const router = express.Router()
import {
  addArtist,
  checkArtist,
  getArtists
} from '../controllers/artistController.js'
import { protect } from '../middlewares/authMiddleware.js'
import admin from '../middlewares/authAdminMiddleware.js'
router.get('/getartists', protect, admin, getArtists) //admin aoute
router.post('/add', addArtist)
router.post('/check-name', checkArtist)
export default router
