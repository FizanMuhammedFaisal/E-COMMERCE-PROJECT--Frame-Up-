import jwt, { decode } from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS)
      console.log('Decoded JWT:', decoded)
      req.user = {
        _id: decoded._id,
        role: decoded.role,
        status: decoded.status
      }
      if (!req.user) {
        return res
          .status(401)
          .json({ message: 'Not authorized, user not found' })
      }
      next()
    } catch (error) {
      // If verification fails, return 401 Unauthorized
      console.error('JWT verification error:', error)
      res.status(401).json({ message: 'Not authorized, invalid token' })
    }
  } else {
    // If the token is missing, return 401 Unauthorized
    console.log('Not authorized, no token')
    res.status(401).json({ message: 'Not authorized, no token' })
  }
})

export { protect }
