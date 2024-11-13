import asyncHandler from "express-async-handler"
import Artist from "../models/artistModel.js"
import Product from "../models/productModel.js"
import mongoose from "mongoose"

const addArtist = asyncHandler(async (req, res, next) => {
  const { name, description, image } = req.body.data
  if (!name || !description || !image) {
    const error = new Error("Not valid files")
    error.statusCode = 400
    return next(error)
  }
  const artistExists = await Artist.findOne({ name })
  if (artistExists) {
    const error = new Error("Artist Already Exists")
    error.statusCode = 400
    return next(error)
  }
  const artist = await Artist.create({ name, description, image })
  console.log(artist)
  if (!artist) {
    const error = new Error("could't create artist")
    error.statusCode = 400
    return next(error)
  }
  if (artist) {
    res.status(200).json({ message: "artist created" })
  }
})
//
const checkArtist = asyncHandler(async (req, res, next) => {
  const { name } = req.body

  if (!name) {
    const error = new Error("No Name Present")
    error.statusCode = 400
    return next(error)
  }
  const artistExist = await Artist.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  })
  if (artistExist) {
    const error = new Error("This Name Already Exist")
    error.statusCode = 400
    return next(error)
  } else {
    res.status(200).json({ message: "verified" })
  }
})
//@ discp   to fetch artists
//route      api/admin/getArtists
//@access    private
const getArtistsAdmin = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = 10
  const search = req.query.search
  const skip = (page - 1) * limit
  let artists

  if (search) {
    const regex = new RegExp(search, "i")
    artists = await Artist.find({ name: { $regex: regex } })
      .skip(skip)
      .limit(limit)
    const totalCount = await Artist.countDocuments({
      name: { $regex: search, $options: "i" },
    })
    const totalPages = Math.ceil(totalCount / limit)
    if (artists) {
      return res.json({
        artists,
        hasNextPage: page < totalPages,
        currentPage: Number(page),
        totalPages,
      })
    } else {
      const error = new Error("error finding user")
      error.statusCode = 400
      return next(error)
    }
  } else {
    artists = await Artist.find({}).skip(skip).limit(limit)
  }

  if (artists) {
    res.json({
      artists,
    })
  } else {
    const error = new Error("error finding user")
    error.statusCode = 400
    return next(error)
  }
})
//
//@ discp   to fetch artists
//route      api/artists/getArtists
//@access    private
const getArtist = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = 10
  const search = req.query.search
  const skip = (page - 1) * limit
  let artists

  artists = await Artist.find({}).skip(skip).limit(limit)
  const totalCount = await Artist.countDocuments({})
  const totalPages = Math.ceil(totalCount / limit)
  if (artists) {
    setTimeout(() => {
      return res.status(200).json({
        artists,
        hasNextPage: page < totalPages,
        currentPage: Number(page),
        totalPages,
      })
    }, 1000)
  }
})
//@ discp   to fetch artist detials
//route      api/admin/getArtists
//@access    private
const getArtistDetails = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!id || !mongoose.isValidObjectId(id)) {
    const error = new Error("Error finding artist.")
    error.statusCode = 400
    return next(error)
  }
  const artist = await Artist.findById(id)
  if (artist) {
    res.status(200).json({ artist })
  }
})
//@ discp   to fetch artist art
//route      api/admin/getArtistArt
//@access    public
const getArtistArt = asyncHandler(async (req, res) => {
  const { artistId } = req.body
  console.log(artistId)
  const products = await Product.find({ artist: artistId })
  if (products) {
    res.status(200).json({ products })
  }
})
export {
  addArtist,
  checkArtist,
  getArtistsAdmin,
  getArtist,
  getArtistDetails,
  getArtistArt,
}
