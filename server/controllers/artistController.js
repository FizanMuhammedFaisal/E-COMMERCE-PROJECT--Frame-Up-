import asyncHandler from 'express-async-handler'
import Artist from '../models/artistModel.js'
import User from '../models/userModel.js'

const addArtist = asyncHandler(async (req, res, next) => {
  const { name, description, image } = req.body.data
  if (!name || !description || !image) {
    const error = new Error('Not valid files')
    error.statusCode = 400
    return next(error)
  }
  const artistExists = await Artist.findOne({ name })
  if (artistExists) {
    const error = new Error('Artist Already Exists')
    error.statusCode = 400
    return next(error)
  }
  const artist = Artist.create({ name, description, image })
  console.log(artist)
  if (!artist) {
    const error = new Error("could't create artist")
    error.statusCode = 400
    return next(error)
  }
  if (artist) {
    res.status(200).json({ message: 'artist created' })
  }
})
//
const checkArtist = asyncHandler(async (req, res, next) => {
  const { name } = req.body

  if (!name) {
    const error = new Error('No Name Present')
    error.statusCode = 400
    return next(error)
  }
  const artistExist = await Artist.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') }
  })
  console.log(artistExist)
  if (artistExist) {
    const error = new Error('This Name Already Exist')
    error.statusCode = 400
    return next(error)
  } else {
    console.log('dfs')
    res.status(200).json({ message: 'verified' })
  }
})
//@ discp   to fetch artists
//route      api/admin/getArtists
//@access    private
const getArtists = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = 10
  const skip = (page - 1) * limit

  const artist = await User.find({ role: 'user' }).skip(skip).limit(limit)
  console.log()
  if (artist) {
    setTimeout(() => {
      res.status(200).json(artist)
    }, 100)
  } else {
    const error = new Error('error finding user')
    error.statusCode = 400
    return next(error)
  }
})
export { addArtist, checkArtist, getArtists }
