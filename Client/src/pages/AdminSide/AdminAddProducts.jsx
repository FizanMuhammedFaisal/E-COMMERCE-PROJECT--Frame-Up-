import React, { useState } from 'react'
import validateProductForm from '../../utils/validation/ProductFormValidation'
import Form from '../../components/layout/AdminSide/addProducts/Form'
import api from '../../services/api/api'
import validataImages from '../../utils/validation/ImageValidation'
import { uploadImagesToCloudinary } from '../../services/Cloudinary/UploadImages'
import { useDispatch, useSelector } from 'react-redux'
import {
  addDeletedImageUrl,
  deleteImage,
  resetFormData,
  setFormData,
  updateFormData
} from '../../redux/slices/AdminProducts/productSlice'
import ImageCropper from '../../components/common/ImageCropper'
import {
  addImageToDB,
  addImagesToDB,
  DeleteImageFromDB,
  getImageFromDB
} from '../../utils/indexedDB/adminImageDB'
const AdminAddProducts = () => {
  const [imageForCrop, setImageForCrop] = useState('')
  const [productImages, setProductImages] = useState([])
  const [thumbnailImage, setThumbnailImage] = useState([])
  const [cropperOpen, setCropperOpen] = useState(false)
  const formData = useSelector(state => state.product)

  const dispatch = useDispatch()
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
          console.log(validFiles)
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
          console.log(validFiles)
          const idi = await addImageToDB(validFiles[0])
          console.log(idi)
          dispatch(
            setFormData({
              id: 'thumbnailImage',
              value: [idi]
            })
          )
          console.log(formData.thumbnailImage)
        } catch (error) {
          setDBError(true)
          console.log(validFiles)
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
      thumbnailImage
    )
    console.log('Validation errors:', validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return setErrorMessages(prev => ({ ...prev, ...validationErrors }))
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

        console.log(fetchedProductImages, fetchedThumbnailImages)
      } catch (error) {
        console.error('Error fetching images from DB:', error)
        setLoading(false)
      }
    } else {
      fetchedProductImages = [...productImages]
      fetchedThumbnailImages = [...thumbnailImage]
    }

    try {
      // Upload images to Cloudinary in parallel
      console.log(fetchedProductImages, fetchedThumbnailImages)
      const [uploadedProductImages, uploadedThumbnailImages] =
        await Promise.all([
          uploadImagesToCloudinary(fetchedProductImages),
          uploadImagesToCloudinary(fetchedThumbnailImages)
        ])

      console.log(uploadedProductImages, uploadedThumbnailImages)
      const data = {
        ...formData,
        productImages: uploadedProductImages,
        thumbnailImage: uploadedThumbnailImages
      }
      console.log(data)

      try {
        const res = await api.post('/product/add', data)
        console.log(res)
      } catch (error) {
        setLoading(false)
        console.error('Error sending data to backend:', error)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error uploading images:', error)
    }
    setLoading(false)
    // Optionally reset form
    // resetForm()
  }

  // Function to delete image from productImages array
  const handleDeleteImage = (image, type) => {
    console.log(image)

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
    const img = { url: image.url, type, currentIndex, DBError, id: image.id }

    setImageForCrop(img)
  }
  const handleCropperClose = () => {
    setCropperOpen(false)
  }
  const updateReduxState = async croppedimage => {
    console.log('asdfa')
    dispatch(deleteImage({ imageid: croppedimage.id, type: croppedimage.type }))
    await DeleteImageFromDB(croppedimage.id)
    console.log(croppedimage.image)
    const id = await addImageToDB(croppedimage.image)
    console.log(id)
    dispatch(updateFormData({ id: croppedimage.type, value: [id] }))
  }
  const handleCroppedImage = async croppedimage => {
    console.log('fasdfa')
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
    console.log(croppedimage)
  }
  return (
    <div className='max-w-5xl mx-auto p-1 font-primary  dark:text-slate-50'>
      {/* Heading */}
      <h1 className='text-4xl font-bold mb-8 text-center '>Add New Product</h1>
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
