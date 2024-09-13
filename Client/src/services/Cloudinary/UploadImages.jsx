import axios from 'axios'
// Function to upload multiple images to Cloudinary
const cloudinaryPreset = import.meta.env.VITE_CLOUDINARY_PRESET
const cloudinaryURL = import.meta.env.VITE_CLOUDINARY_URL
export const uploadImagesToCloudinary = async (files, id, callback) => {
  try {
    const uploadedImages = await Promise.all(
      files.map(async file => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', cloudinaryPreset)
        const res = await axios.post(cloudinaryURL, formData)
        console.log(res)
        return {
          url: res.data.secure_url,
          publicId: res.data.public_id
        }
      })
    )
    console.log(uploadedImages)
    callback(uploadedImages)
  } catch (error) {
    console.log('All images cannot be uploaded!' + error)
  }
}

// Function to upload a single image (e.g., thumbnail)
export const uploadSingleImageToCloudinary = async (file, id, callback) => {
  let uploadedImage = {}
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', cloudinaryPreset)
  try {
    const res = await axios.post(cloudinaryURL, formData)
    console.log(res)
    uploadedImage = {
      url: res.data.secure_url,
      publicId: res.data.public_id
    }
    console.log(uploadedImage)
    callback(uploadedImage)
  } catch (err) {
    console.error('Error uploading image:', err)
  }
}
