// Middleware to verify session token
import jwt from 'jsonwebtoken'
import TempUser from '../models/tempUserModel.js'
const verifySessionToken = async (req, res, next) => {
  const sessionToken = req.headers['x-session-token']

  if (!sessionToken) {
    console.log('no session token')
    return res.status(401).json({ message: 'Session token missing' })
  }

  try {
    // Verify the session token (you might want to use JWT or any token verification method)
    const decoded = jwt.verify(sessionToken, process.env.JWT_TOKEN)
    console.log(decoded)
    // Attach the user's email to the request
    const user = await TempUser.findOne({ _id: decoded.id })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Attach the user to the request object
    req.user = user
    console.log(user + 'thsiis form middleware 1')
    next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Invalid or expired session token' })
  }
}
export default verifySessionToken

//   // Protect routes with this middleware
//   app.post('/send-otp', verifySessionToken, sendOTP);
//   app.post('/verify-otp', verifySessionToken, verifyOTP);
//   app.post('/create-account', verifySessionToken, createAccount);
