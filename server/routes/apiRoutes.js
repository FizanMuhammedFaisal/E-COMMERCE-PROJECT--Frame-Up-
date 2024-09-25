import express from 'express'
import adminRoutes from './adminRoutes.js'
import userRoutes from './userRoutes.js'
import productRoutes from './productRoutes.js'
import artistRoutes from './artistRoutes.js'
const app = express.Router()

app.use('/admin', adminRoutes)
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/artists', artistRoutes)
export default app
