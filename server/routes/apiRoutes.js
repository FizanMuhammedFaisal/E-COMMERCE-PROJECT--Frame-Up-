import express from 'express'
import adminRoutes from './adminRoutes.js'
import userRoutes from './userRoutes.js'
import productRoutes from './productRoutes.js'
const app = express.Router()

app.use('/admin', adminRoutes)
app.use('/users', userRoutes)
app.use('/products', productRoutes)
export default app
