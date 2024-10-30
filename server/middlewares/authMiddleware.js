import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS)
      req.user = await User.findById(decoded.userId).select('-password')
      if (!req.user) {
        return res
          .status(401)
          .json({ message: 'Not authorized, user not found' })
      }
      next()
    } catch (error) {
      // If verification fails, return 401 Unauthorized
      res.status(401).json({ message: "'Not authorized, invalid token'" })
    }
  } else {
    // If the token is missing, return 401 Unauthorized
    console.log('not authourized')
    res.status(401).json({ message: "'Not authorized, no token'" })
  }
})

export { protect }
