import jwt from 'jsonwebtoken'

const generateToken = userId => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_ACCESS, {
    expiresIn: '15m'
  })
  return token
}

export default generateToken
