import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL)
    console.log(`MongoDB Connected: ${mongoose.connection.host}`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default connectDB
