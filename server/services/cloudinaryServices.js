import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

//credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const deleteImage = async publicId => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    console.log(result)
    return result
  } catch (error) {
    console.error('Error deleting image', error)
    throw new Error('Image deletion failed')
  }
}
export const deleteMultipleImages = async publicIds => {
  // public ids would be publicids in an array
  try {
    const result = await cloudinary.api.delete_resources(publicIds)
    console.log(result)
    return result
  } catch (error) {
    console.error('Error deleting images', error)
    throw new Error('Images deletion failed')
  }
}
export const check = () => {
  cloudinary.api.resources_by_ids(['pfvuxlb3xtgrwirv7swu'], (error, result) => {
    if (error) {
      console.error('Error fetching resource:', error)
    } else {
      console.log('Resource details:', result)
    }
  })
}
