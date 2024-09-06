import User from '../models/userModel.js'
import TempUser from '../models/tempUserModel.js'
import asyncHandler from 'express-async-handler'
import generateCookie from '../utils/generateCookie.js'
import generateToken from '../utils/generateToken.js'
import firebaseApp from '../config/firebaseApp.js'
import {
  generateOTP,
  updateUserWithOTP,
  sendOTPEmail
} from '../services/otpServices.js'
import jwt from 'jsonwebtoken'
// -----

// for sending otp
const sendOTP = asyncHandler(async (req, res, next) => {
  const user = req.user
  if (user.status === 'Active') {
    return res.status(200).json({ message: 'user is aleady verified' })
  }
  // generate timer and expiration time
  const { otp, otpExpiresAt } = generateOTP()
  // updating the fields of TempUser
  await updateUserWithOTP(user, otp, otpExpiresAt)
  //send the otp
  // Send OTP email
  try {
    await sendOTPEmail(user.email, otp)
    res.status(200).json({ message: 'OTP sent successfully' })
  } catch (error) {
    next(error)
  }
})

// for veryfying and creating
const verifyOTP = asyncHandler(async (req, res, next) => {
  const { otp } = req.body
  const email = req.user.email

  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' })
  }

  const user = await TempUser.findOne({ email })
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (user.otp !== otp || new Date() > user.otpExpiresAt) {
    return res.status(400).json({ message: 'Invalid or expired OTP' })
  }

  // Step 2: Create User
  const { username, phoneNumber, password } = user

  try {
    const newUser = await User.create({
      username,
      email,
      password,
      phoneNumber,
      status: 'Active'
    })

    const rToken = generateCookie(res, newUser._id)
    const accessToken = generateToken(newUser._id)

    return res.status(201).json({
      message: 'User created successfully',
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      accessToken
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return next(new Error('Cannot create User'))
  }
})
//------
const checkUser = asyncHandler(async (req, res, next) => {
  const { username, email, phoneNumber, password, cp } = req.body
  console.log(req.body)
  const userExists = await User.findOne({ email })
  if (userExists) {
    const error = new Error('email already exist')
    error.statusCode = 400
    return next(error)
  }
  const tempUser = await TempUser.create({
    username,
    email,
    phoneNumber,
    password,
    otp: '', // Placeholder value
    otpExpiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes expiration time
  })

  if (tempUser) {
    // Generate a session token
    const id = tempUser._id
    const token = jwt.sign({ id }, process.env.JWT_TOKEN, {
      expiresIn: '10m'
    })
    return res.status(201).json({
      message: 'Temporary user created',
      _id: tempUser._id,
      token
    })
  }

  console.log(tempUser)
  const error = new Error('Cannot create User')
  error.statusCode = 400
  return next(error)
})

//
//
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

//
//
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

const userCreate = asyncHandler(async (req, res, next) => {
  console.log('inside user create')
  const tempUser = req.tempUser
  const { username, email, phoneNumber, password } = tempUser
  console.log(req.body)

  const user = await User.create({ username, email, password, phoneNumber })
  if (user) {
    const rToken = generateCookie(res, user._id)
    const accessToken = generateToken(user._id)
    console.log('all good ')
    return res.status(201).json({
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

//dec-- for making new acces token
const makeAccess = (req, res) => {
  const user = req.user
  console.log(user)
  const id = user._id
  // Generate a new access token
  const token = jwt.sign({ id }, process.env.JWT_SECRET_ACCESS, {
    expiresIn: '15m'
    // expiresIn: '5s'
  })

  res.json({ token })
}

//
//
export {
  checkUser,
  userlogin,
  googleAuth,
  sendOTP,
  userCreate,
  verifyOTP,
  makeAccess
}
