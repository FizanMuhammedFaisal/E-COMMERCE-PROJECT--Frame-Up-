import express from 'express'
const router = express.Router()
import {
  addArtist,
  checkArtist,
  getArtistsAdmin,
  getArtist,
  getArtistDetails,
  getArtistArt
} from '../controllers/artistController.js'
import { protect } from '../middlewares/authMiddleware.js'
import admin from '../middlewares/authAdminMiddleware.js'
router.get('/get-artists', protect, admin, getArtistsAdmin) //admin aoute
router.post('/add', addArtist)
router.post('/check-name', checkArtist)

//users
router.get('/', getArtist)
router.post('/artworks/all', getArtistArt)
router.get('/:id', getArtistDetails)
export default router
