import { GoogleGenerativeAI } from '@google/generative-ai'
import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import mongoose from 'mongoose'

const getAnswer = asyncHandler(async (req, res) => {
  const { query, productId } = req.body
  try {
    if (!productId || !mongoose.isValidObjectId(productId)) {
      const error = new Error('No valid Product.')
      error.statusCode = 400
      return next(error)
    }
    const product = await Product.findById(productId)
      .populate('artist')
      .populate('productCategories')
    if (!product) {
      const error = new Error('No valid Product.')
      error.statusCode = 400
      return next(error)
    }
    console.log(product)
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `
      You are an expert in fine art and paintings.
      Here is specific information about a painting for an e-commerce context:
      
      - **Name**: ${product.productName}
      - **Artist**: ${product.artist}
      - **Description**: ${product.productDescription}
      - **Price**: ${product.productPrice} USD
      - **Category**: ${product.productCategory}
      - **Year Created**: ${product.productYear}
      - **Additional Information**: ${product.productInformation}
      
      Based on this painting, please answer the following question from a customer:
      "${query}"

      If needed, feel free to provide relevant background information about the painting’s style, technique, or historical context to enhance the answer, but keep the focus on this specific product.
    `
    console.log(prompt)
    const result = await model.generateContent(prompt)
    console.log(result.response.text())
    const response = result.response.text()
    setTimeout(() => {
      res.json({ response })
    }, 2000)
  } catch (error) {
    if (error.message.includes('safety')) {
      res.status(400).json({
        error:
          'The response was blocked due to sensitive content. Please refine your question.'
      })
    } else {
      res
        .status(500)
        .json({ error: 'Error fetching data from servers ,Try Again.' })
    }
  }
})

export { getAnswer }
