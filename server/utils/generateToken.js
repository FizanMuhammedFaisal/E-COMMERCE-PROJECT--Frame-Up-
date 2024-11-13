import jwt from "jsonwebtoken"

const generateToken = (userInfo) => {
  const token = jwt.sign(
    { _id: userInfo._id, role: userInfo.role, status: userInfo.status },
    process.env.JWT_SECRET_ACCESS,
    {
      expiresIn: "5m",
    },
  )
  return token
}

export default generateToken
