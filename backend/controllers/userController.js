import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateCookie from '../utils/generateCookie.js'
import generateToken from '../utils/generateToken.js'

import firebaseApp from '../config/firebaseApp.js'
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
      role: user.role,
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

const googleAuth = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body

  if (!idToken || typeof idToken !== 'string') {
    console.error('Invalid ID token:', idToken)
    return res.status(400).send({ message: 'Invalid ID token' })
  }
  const decodedToken = await firebaseApp.auth().verifyIdToken(idToken)
  const displayName = decodedToken.name
  const uid = decodedToken.uid
  const email = decodedToken.email
  console.log(uid, email, displayName)
  let user = await User.findOne({ email })
  let updatedUser = null
  let newUser = null
  if (user) {
    updatedUser = await User.findOneAndUpdate(
      { email },
      { username: displayName, email, firebaseUid: uid }
    )
  } else {
    newUser = await User.create({
      username: displayName,
      email,
      firebaseUid: uid
    })
  }

  if (updatedUser || newUser) {
    const user = updatedUser || newUser
    const id = user._id.toString(user._d)

    console.log(id)
    if (!user) {
      // Handle case where neither user is available
      return res.status(404).json({ message: 'User not found' })
    }
    console.log('id ehrer' + id)
    generateCookie(res, id)

    const accessToken = generateToken(id)
    console.log(accessToken)
    return res.status(201).json({
      message: 'user create',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken
    })
  }
  const error = new Error('Please Retry Login')
  error.statusCode = 400
  return next(error)
})
export { userSignUp, userlogin, googleAuth }
