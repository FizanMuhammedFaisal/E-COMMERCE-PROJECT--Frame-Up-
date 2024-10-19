import User from '../models/userModel.js'
import Category from '../models/categoryModel.js'
import Artist from '../models/artistModel.js'
import asyncHandler from 'express-async-handler'
import generateCookie from '../utils/generateCookie.js'
import generateToken from '../utils/generateToken.js'
import Order from '../models/orderModel.js'
import Discount from '../models/discoundModel.js'

//@ discp   login route
//route      api/admin/login
//@access    public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && user.role === 'user') {
    const error = new Error('User Is Not Authorized')
    error.statusCode = 401
    return next(error)
  }
  if (user && (await user.matchPassword(password))) {
    generateCookie(res, user._id)
    const accessToken = generateToken(user._id)
    return res.status(200).json({
      message: 'user validated',
      _id: user._id,
      name: user.name,
      role: user.role,
      accessToken
    })
  }
  console.log(user, req.body)
  const error = new Error('Invalid Email Or Password')
  error.statusCode = 400
  return next(error)
})

//

const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  console.log('Page:', page, 'Limit:', limit, 'Skip:', skip)
  const userst = await User.find({}).countDocuments()
  console.log(userst)
  const users = await User.find({ role: 'user' }).skip(skip).limit(limit)
  console.log(users)
  if (users) {
    res.status(200).json(users)
  } else {
    const error = new Error('error finding user')
    error.statusCode = 400
    return next(error)
  }
})

//@ discp   logout route
//route      api/admin/logout
//@access    private
const logout = (req, res) => {
  const admin = req.user
  if (!admin) {
    throw new Error('who is loggin out')
  }
  res.cookie('jwtrefresh', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: ' user logged out' })
}
//@ discp   toadd new user
//route      api/admin/addUser
//@access    private
const addUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  console.log(req.body)
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400).json({ message: 'this email already exists' })
    throw new Error('User already exists')
  }
  const user = await User.create({
    name,
    email,
    password,
    message: 'user Created'
  })
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email
    })
  } else {
    res.status(400)
    throw new Error('Invalid User Data')
  }
})
//@ discp   to delete user
//route      api/admin/deleteUser
//@access    private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body
  console.log(req.body, id)
  const user = await User.findOneAndDelete({ _id: id })
  console.log(user)
  if (user) {
    res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.name,
      message: 'User deleted'
    })
  } else {
    throw new Error("could't delete user")
  }
})
//@ discp   to update user
//route      api/admin/updateUser
//@access    private
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, password, prev } = req.body
  console.log('updating data' + prev + name + email + password)
  const existingUser = await User.findOne({ email })
  if (existingUser && existingUser.email !== prev.email) {
    res.status(400).json({ message: 'This email already exist' })
    throw new Error('Email is already in use')
  }
  const updatedUser = await User.findOneAndUpdate(
    { email: prev },
    { $set: { name, email, password } },
    { new: true }
  )

  if (!updatedUser) {
    console.log('error occured maybe duplicate key')
    res.status(400).json({ message: 'user already exisssss' })

    throw new Error('user not found')
  }
  res.status(200).json({ updatedUser, message: 'user updated' })
})

//
//@ discp   to update user status
//route      api/admin/users/user.id/status
//@access    private
const updateStatus = asyncHandler(async (req, res) => {
  const userId = req.params.id
  const { status } = req.body
  console.log(status, userId)

  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { status },
    { new: true }
  )
  if (!user) {
    return res.status(400).json({ message: 'user not found' })
  }

  setTimeout(() => {
    return res.status(200).json({ message: 'status updated sucessfully' })
  }, 100)
})
//@ discp   to add new category
//route      api/admin/add-category
//@access    private
const addCategory = asyncHandler(async (req, res, next) => {
  const { name, type, description } = req.body

  // Ensure all required fields are provided
  if (!name || !type || !description) {
    const error = new Error('All fields are required')
    error.statusCode = 400
    return next(error)
  }

  const categoryExists = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    type
  })

  if (categoryExists) {
    const error = new Error(
      'Category already exists with this name in the given type'
    )
    error.statusCode = 400
    return next(error)
  }

  // Create the new category
  const category = await Category.create({ name, type, description })

  if (category) {
    return res.status(201).json({ message: 'Category created successfully' })
  } else {
    const error = new Error('Failed to create category')
    error.statusCode = 500
    return next(error)
  }
})

//@ discp   to fetch theme
//route      api/admin/get-category-themes
//@access    private
const fetchThemes = asyncHandler(async (req, res) => {
  const result = await Category.find({ type: 'Theme' })
  console.log(result)

  res.json({ result })
})
//@ discp   to fetch style
//route      api/admin/get-category-themes
//@access    private
const fetchStyles = asyncHandler(async (req, res) => {
  const result = await Category.find({ type: 'Style' })
  console.log(result)
  res.json({ result })
})
//@ discp   to fetch Techniques
//route      api/admin/get-category-themes
//@access    private
const fetchTechniques = asyncHandler(async (req, res) => {
  const result = await Category.find({ type: 'Technique' })
  console.log(result)
  return res.json({ result })
})
//
//

const updateArtistStatus = asyncHandler(async (req, res, next) => {
  const artistId = req.params.id
  const { status } = req.body
  console.log(status, artistId)

  const user = await Artist.findByIdAndUpdate(
    { _id: artistId },
    { status },
    { new: true }
  )
  if (!user) {
    return res.status(400).json({ message: 'artist not found' })
  }

  setTimeout(() => {
    return res.status(200).json({ message: 'status updated sucessfully' })
  }, 100)
})
//
//

const updateCategories = asyncHandler(async (req, res, next) => {
  const { id, newStatus } = req.body
  console.log(id, newStatus)
  const category = await Category.findOneAndUpdate(
    { _id: id },
    { status: newStatus }
  )
  if (category) {
    return res.status(200).json({ message: 'status updated successfully' })
  }
  const error = new Error('failed to update user status')
  error.statusCode = 400
  return next(error)
})
//
//
const getProductDiscounds = asyncHandler(async (req, res, next) => {
  const productDiscounts = await Discount.find({
    discountTarget: 'Products'
  })
  if (productDiscounts) {
    return res.status(200).json({
      success: true,
      discounts: productDiscounts
    })
  }
  const error = new Error('Server error while fetching product discounts.')
  error.statusCode = 400
  return next(error)
})
//
const getCategoryDiscounds = asyncHandler(async (req, res, next) => {
  const CategoryDiscounts = await Discount.find({
    discountTarget: 'Category'
  })
  console.log(CategoryDiscounts)
  if (CategoryDiscounts) {
    return res.status(200).json({
      success: true,
      discounts: CategoryDiscounts
    })
  }
  const error = new Error('Server error while fetching product discounts.')
  error.statusCode = 400
  return next(error)
})
//
//

const addDiscount = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      discountTarget,
      discountType,
      discountValue,
      startDate,
      endDate,
      targetId,
      status
    } = req.body.discountData
    console.log(req.body)
    if (
      !name ||
      !discountTarget ||
      !discountType ||
      !discountValue ||
      !startDate ||
      !endDate ||
      !targetId
    ) {
      const error = new Error('All required fields must be provided')
      error.statusCode = 500
      return next(error)
    }
    console.log(status)
    const discount = new Discount({
      name,
      discountTarget,
      discountType,
      discountValue,
      startDate,
      endDate,
      targetId,
      status: status || 'Active'
    })

    const createdDiscount = await discount.save()

    res.status(201).json({
      message: 'Discount added successfully',
      discount: createdDiscount
    })
  } catch (error) {
    next(error)
  }
})
//

const updateDiscountStatus = asyncHandler(async (req, res, next) => {
  const { id, newStatus, discountTarget } = req.body
  console.log(req.body)
  if (!id || !newStatus || !discountTarget) {
    const error = new Error('All fields  must be provided')
    error.statusCode = 500
    return next(error)
  }

  const discount = await Discount.findById(id)

  if (!discount) {
    const error = new Error('no Discount document available')
    error.statusCode = 500
    return next(error)
  }

  discount.status = newStatus

  const updatedDiscount = await discount.save()

  res.status(200).json({
    message: 'Discount status updated successfully',
    discount: updatedDiscount
  })
})

export default updateDiscountStatus

// end
export {
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
  addDiscount,
  updateDiscountStatus
}
