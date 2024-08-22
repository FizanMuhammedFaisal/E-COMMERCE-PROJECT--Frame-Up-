import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import generateCookie from '../utils/generateCookie.js'
import generateToken from '../utils/generateToken.js'

// -----
//------
const userSignUp = asyncHandler(async (req, res, next) => {
  const { username, email, phoneNumber, password, cp } = req.body
  console.log(req.body)
  const userExists = await User.findOne({ email })
  if (userExists) {
    const error = new Error('email already exist')
    error.statusCode = 400
    return next(error)
  }

  const user = await User.create({ username, email, password, phoneNumber })
  if (user) {
    const rToken = generateCookie(res, user._id)
    const accessToken = generateToken(user._id)
    res.status(201).json({
      message: 'user create',
      _id: user._id,
      name: user.name,
      email: user.email,
      accessToken
    })
  }
  console.log(user)
  const error = new Error('Cannot create User')
  error.statusCode = 400
  return next(error)
})
const userlogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    const rToken = generateCookie(res, user._id)
    const accessToken = generateToken(user._id)
    res.status(200).json({
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

export { userSignUp, userlogin }
