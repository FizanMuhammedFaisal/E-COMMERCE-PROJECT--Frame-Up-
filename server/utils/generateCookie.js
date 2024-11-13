import jwt from "jsonwebtoken"

const generateCookie = (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH, {
      expiresIn: "30d",
    })
    console.log(token, process.env.NODE_ENV)
    res.cookie("jwtrefresh", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
  } catch (error) {
    console.error("Error generating cookie:", error)
    throw new Error("Error generating cookie")
  }
}
export default generateCookie
