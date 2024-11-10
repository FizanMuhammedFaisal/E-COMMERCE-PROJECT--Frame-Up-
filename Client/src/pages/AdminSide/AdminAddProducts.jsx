import { useState } from 'react'
import Form from '../../components/layout/AdminSide/Products/Form'
import api from '../../services/api/api'
import validataImages from '../../utils/validation/ImageValidation'
import { uploadImagesToCloudinary } from '../../services/Cloudinary/UploadImages'
import { useDispatch, useSelector } from 'react-redux'

import { toast } from 'react-toastify'
import {
  addDeletedImageUrl,
  deleteImage,
  resetFormData,
  setFormData,
  updateFormData
} from '../../redux/slices/Admin/AdminProducts/productSlice'
import ImageCropper from '../../components/common/ImageCropper'
import {
  addImageToDB,
  addImagesToDB,
  DeleteImageFromDB,
  getImageFromDB,
  clearAllFilesInDB
} from '../../utils/indexedDB/adminImageDB'
import validateProductForm from '../../utils/validation/ProductFormValidation'
import { useNavigate } from 'react-router-dom'
const AdminAddProducts = () => {
  const [imageForCrop, setImageForCrop] = useState('')
  const [productImages, setProductImages] = useState([])
  const [thumbnailImage, setThumbnailImage] = useState([])
  const [cropperOpen, setCropperOpen] = useState(false)
  const formData = useSelector(state => state.product)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const resetForm = () => {
    dispatch(resetFormData())
    setErrorMessages({})
  }

  const [errorMessages, setErrorMessages] = useState({
    productName: '',
    productPrice: '',
    productCategory: '',
    productDescription: '',
    productImages: '',
    thumbnailImage: '',
    weight: '',
    dimensions: ''
  })

  const [loadingImages, setLoadingImages] = useState(false)
  const [loadingThumbnail, setLoadingThumbnail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [DBError, setDBError] = useState(false)

  const handleChange = async e => {
    const { id, value, files } = e.target

    if (files) {
      const images = Array.from(files)
      const { isValid, errors, validFiles } = validataImages(images)
      //setting errors
      if (!isValid) {
        return setErrorMessages(prev => ({
          ...prev,
          productImages: errors.join(', ')
        }))
      }

      setErrorMessages({})

      if (e.target.multiple) {
        setLoadingImages(true)
        try {
          const ids = await addImagesToDB(validFiles)

          const images = [...formData.productImages, ...ids]

          dispatch(
            setFormData({
              id: 'productImages',
              value: images
            })
          )
        } catch (error) {
          setDBError(true)
          setProductImages(prev => [...prev, ...validFiles])
        }
        setLoadingImages(false)
      } else {
        setLoadingThumbnail(true)

        try {
          const idi = await addImageToDB(validFiles[0])

          dispatch(
            setFormData({
              id: 'thumbnailImage',
              value: [idi]
            })
          )
        } catch (error) {
          setDBError(true)

          setThumbnailImage(validFiles)
        } finally {
          setLoadingThumbnail(false)
        }
        setLoadingThumbnail(false)
      }
    } else {
      dispatch(setFormData({ id, value }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const validationErrors = validateProductForm(
      formData,
      DBError,
      productImages,
      thumbnailImage,
      dispatch
    )
    if (Object.keys(validationErrors).length > 0) {
      return setErrorMessages(validationErrors)
    }
    setErrorMessages({})

    let fetchedThumbnailImages = []
    let fetchedProductImages = []
    setLoading(true)
    if (!DBError) {
      try {
        const imageProductPromises = formData.productImages.map(async id => {
          const file = await getImageFromDB(id)
          return file
        })
        const id = formData.thumbnailImage[0]
        const file = await getImageFromDB(id)
        fetchedThumbnailImages = [file]

        fetchedProductImages = await Promise.all(imageProductPromises)
      } catch (error) {
        setLoading(false)
      }
    } else {
      fetchedProductImages = [...productImages]
      fetchedThumbnailImages = [...thumbnailImage]
    }

    try {
      // Upload images to Cloudinary in parallel

      const [uploadedProductImages, uploadedThumbnailImages] =
        await Promise.all([
          uploadImagesToCloudinary(fetchedProductImages),
          uploadImagesToCloudinary(fetchedThumbnailImages, true)
        ])

      const data = {
        ...formData,
        productImages: uploadedProductImages,
        thumbnailImage: uploadedThumbnailImages
      }

      try {
        console.log(data)
        const res = await api.post('/products/add', data)
        toast.success('Product added', {
          className:
            'bg-white dark:bg-customP2ForegroundD_400 font-primary dark:text-white '
        })
      } catch (error) {
        setLoading(false)
        toast.error("Couldn't add product")
        console.error('Error sending data to backend:', error)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error uploading images:', error)
    } finally {
      clearAllFilesInDB()
    }
    navigate('/dashboard/products')
    setLoading(false)

    resetForm()
  }

  // Function to delete image from productImages array
  const handleDeleteImage = (image, type) => {
    if (!DBError) {
      dispatch(deleteImage({ imageid: image.id, type }))
    } else {
      const indexToDelete = image.id
      if (type === 'productImages') {
        const updatedImages = productImages.filter(
          (_, index) => index !== indexToDelete
        )
        // Update the state with the new array excluding the deleted image
        setProductImages(updatedImages)
      } else {
        setThumbnailImage([])
      }
    }

    dispatch(addDeletedImageUrl(image.id)) // modify later to do delte of image
  }
  const handleCategoryChange = (selectedOption, categoryType) => {
    dispatch(
      setFormData({
        id: categoryType,
        value: selectedOption
      })
    )
  }
  const handleImageEdit = (image, type, currentIndex, DBError) => {
    setCropperOpen(true)
    console.log(image)
    const img = { url: image.url, type, currentIndex, DBError, id: image.id }

    setImageForCrop(img)
  }
  const handleCropperClose = () => {
    setCropperOpen(false)
  }
  const updateReduxState = async croppedimage => {
    dispatch(deleteImage({ imageid: croppedimage.id, type: croppedimage.type }))
    await DeleteImageFromDB(croppedimage.id)

    const id = await addImageToDB(croppedimage.image)

    dispatch(updateFormData({ id: croppedimage.type, value: [id] }))
  }
  const handleCroppedImage = async croppedimage => {
    if (croppedimage.type === 'productImages') {
      if (croppedimage.DBError) {
        const updatedImages = [...productImages]
        updatedImages[croppedimage.index] = croppedimage.image
        setProductImages(updatedImages)
      } else {
        updateReduxState(croppedimage)
      }
    } else if (croppedimage.type === 'thumbnailImage') {
      if (croppedimage.DBError) {
        const updatedImages = [...thumbnailImage]
        updatedImages[croppedimage.index] = croppedimage.image
        setThumbnailImage(updatedImages)
      } else {
        updateReduxState(croppedimage)
      }
    }
    handleCropperClose()
  }
  return (
    <div className='max-w-5xl mx-auto p-1 font-primary  dark:text-slate-50'>
      {/* Heading */}
      <div className='flex flex-col sm:flex-row justify-center items-center my-5 mb-6'>
        <h1 className='text-4xl font-bold mb-8 text-center '>
          Add New Product
        </h1>
      </div>
      <Form
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        errorMessages={errorMessages}
        loadingImages={loadingImages}
        loadingThumbnail={loadingThumbnail}
        handleDeleteImage={handleDeleteImage}
        handleCategoryChange={handleCategoryChange}
        handleImageEdit={handleImageEdit}
        productImages={DBError ? productImages : formData.productImages}
        thumbnailImage={DBError ? thumbnailImage : formData.thumbnailImage}
        DBError={DBError}
        loading={loading}
      />
      <ImageCropper
        open={cropperOpen}
        onClose={handleCropperClose}
        initialImage={imageForCrop}
        onCropComplete={handleCroppedImage}
      />
    </div>
  )
}

export default AdminAddProducts
