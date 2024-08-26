import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token

  // Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(' ')[1]

      // Verify the token using the access secret key
      console.log(token + 'loggin token')
      const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS)
      console.log('Decoded User ID:', decoded)
      // Attach the user information (without password) to the request object
      req.user = await User.findById(decoded.userId).select('-password')
      console.log(`loggin teh finded user ${req.user}`)
      // Proceed to the next middleware or route handler

      next()
    } catch (error) {
      // If verification fails, return 401 Unauthorized
      res.status(401)
      throw new Error('Not authorized, invalid token')
    }
  } else {
    // If the token is missing, return 401 Unauthorized
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

export { protect }
