import express from 'express'
import adminRoutes from './adminRoutes.js'
import userRoutes from './userRoutes.js'
import productRoutes from './productRoutes.js'
import artistRoutes from './artistRoutes.js'
import cartRoutes from './cartRoutes.js'
import orderRoutes from './orderRoutes.js'
const app = express.Router()

app.use('/admin', adminRoutes)
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/artists', artistRoutes)
app.use('/cart', cartRoutes)
app.use('/order', orderRoutes)
export default app
