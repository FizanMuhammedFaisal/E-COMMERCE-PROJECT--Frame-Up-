import axios from 'axios'
import apiClient from '../api/apiClient'
apiClient

const cloudinaryPreset = import.meta.env.VITE_CLOUDINARY_PRESET
const cloudinaryPresetThumbnail = import.meta.env
  .VITE_CLOUDINARY_PRESET_THUMBNAIL
const cloudinaryURL = import.meta.env.VITE_CLOUDINARY_URL

export const uploadImagesToCloudinary = async (files, isThumbnail = false) => {
  try {
    const uploadedImages = await Promise.all(
      files.map(async file => {
        const formData = new FormData()
        formData.append('file', file)

        // Use different upload presets based on whether it's a thumbnail
        const uploadPreset = isThumbnail
          ? cloudinaryPresetThumbnail
          : cloudinaryPreset
        formData.append('upload_preset', uploadPreset)
        const res = await axios.post(cloudinaryURL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        return res.data.secure_url //  image URL
      })
    )

    // Return an array of image URLs
    return uploadedImages
  } catch (error) {
    console.error('Error uploading images:', error)
    throw new Error('Images could not be uploaded')
  }
}

export const delteImagesFromCloudinary = async (files, type, index, id) => {
  //files will be array of urls
  const deleteViaServer = async urls => {
    try {
      const result = await apiClient.post('/api/admin/delete-Images', {
        urls,
        type,
        index,
        id
      })
      return result
    } catch (error) {
      console.log(error)
      throw new Error('Images could not be deleted')
    }
  }
  return await deleteViaServer(files)
}
