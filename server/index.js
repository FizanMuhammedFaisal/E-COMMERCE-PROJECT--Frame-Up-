import express, { json } from 'express'
import dotenv from 'dotenv/config'
import cookieParser from 'cookie-parser'
const app = express()
import apiRoutes from './routes/apiRoutes.js'
import { throwError } from './middlewares/errorMiddleware.js'
import connectDB from './config/db.js'
import morgan from 'morgan'
import cors from 'cors'
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true // Allow credentials to be sent
}

connectDB()

const Port = process.env.PORT
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use('/api', apiRoutes)
app.use(throwError)
app.listen(Port, () => {
  console.log(`Server Started on http://localhost:${Port}`)
})
