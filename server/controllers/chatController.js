import { GoogleGenerativeAI } from '@google/generative-ai'
import asyncHandler from 'express-async-handler'
const getAnswer = asyncHandler(async (req, res) => {
  const { query } = req.body
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent(query)
    console.log(result.response.text())
    const response = result.response.text()
    setTimeout(() => {
      res.json({ response })
    }, 4000)
  } catch (error) {
    console.error('Error fetching data from Google Gemini:', error)
    res.status(500).json({ error: 'Error fetching data from Google Gemini' })
  }
})

export { getAnswer }
