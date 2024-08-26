import express, { json } from 'express'
import dotenv from 'dotenv'
const app = express()
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { throwError } from './middlewares/errorMiddleware.js'
import connectDB from './config/db.js'

import cors from 'cors'
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true // Allow credentials to be sent
}
dotenv.config()
connectDB()
const Port = process.env.PORT
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use(throwError)
app.listen(Port, () => {
  console.log(`Server Started on http://localhost:${Port}`)
})
