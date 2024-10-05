import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const refreshTokenMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwtrefresh
  console.log('MIddleware of refresh ' + token)

  if (!token) {
    res.status(400).json({ message: 'No refresh token found' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_REFRESH)
    req.user = await User.findById(decoded.userId).select('-password')
    console.log('new acces token created' + decoded.userId)
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
})
export { refreshTokenMiddleware }
