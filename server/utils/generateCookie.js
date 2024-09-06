import jwt from 'jsonwebtoken'

const generateCookie = (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH, {
      expiresIn: '30d'
    })
    console.log(token, process.env.NODE_ENV)
    res.cookie('jwtrefresh', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 30 * 24 * 60 * 60 * 1000
    })
  } catch (error) {
    console.error('Error generating cookie:', error)
    throw new Error('Error generating cookie')
  }
}
export default generateCookie

//   res.cookie('jwtrefresh', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== 'development',

//     maxAge: 30 * 24 * 60 * 60 * 1000
//   })
//   // Set the HTTP-only cookie
//   res.cookie('testCookie', JSON.stringify(testData), {
//     httpOnly: true, // The cookie is inaccessible to JavaScript in the browser
//     secure: false, // Set to true in production to ensure it's only sent over HTTPS
//     maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
//   })

//   res.send('HTTP-only cookie has been set!')
// })
