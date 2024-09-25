import axios from 'axios'

// Cloudinary configuration
const cloudinaryPreset = import.meta.env.VITE_CLOUDINARY_PRESET
const cloudinaryURL = import.meta.env.VITE_CLOUDINARY_URL

// Function to upload an array of images to Cloudinary and return their URLs
export const uploadImagesToCloudinary = async files => {
  try {
    const uploadedImages = await Promise.all(
      files.map(async file => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', cloudinaryPreset)

        const res = await axios.post(cloudinaryURL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return res.data.secure_url // Return only the image URL
      })
    )

    // Return an array of image URLs
    return uploadedImages
  } catch (error) {
    console.error('Error uploading images:', error)
    throw new Error('Images could not be uploaded')
  }
}
