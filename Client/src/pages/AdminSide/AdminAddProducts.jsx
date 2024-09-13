import React, { useState } from 'react'
import validateProductForm from '../../utils/validation/ProductFormValidation'
import Form from '../../components/layout/AdminSide/addProducts/Form'
import api from '../../services/api/api'
import validataImages from '../../utils/validation/ImageValidation'
import {
  uploadImagesToCloudinary,
  uploadSingleImageToCloudinary
} from '../../services/Cloudinary/UploadImages'
import { useDispatch, useSelector } from 'react-redux'
import {
  addDeletedImageUrl,
  deleteImage,
  resetFormData,
  setFormData
} from '../../redux/slices/AdminProducts/productSlice'
import ImageCropper from '../../components/common/ImageCropper'
import {
  addImageToDB,
  addImagesToDB,
  getImageFromDB
} from '../../utils/indexedDB/adminImageDB'
const AdminAddProducts = () => {
  const [imageUrl, setImageUrl] = useState('')
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

      setErrorMessages(() => ({
        productName: '',
        productPrice: '',
        productCategory: '',
        productDescription: '',
        productImages: '',
        thumbnailImage: '',
        weight: '',
        dimensions: ''
      }))

      if (e.target.multiple) {
        setLoadingImages(true)
        // store iamges on state and then uplod later after the crop
        // await uploadImagesToCloudinary(
        //   validFiles,
        //   'productImages',
        //   newImages => {
        //     const images = [...formData.productImages, ...newImages]
        //     dispatch(
        //       setFormData({
        //         id: 'productImages',
        //         value: images
        //       })
        //     )
        //   }
        // )
        const ids = await addImagesToDB(validFiles)
        console.log(ids, typeof ids)
        const images = [...formData.productImages, ...ids]
        console.log(images)
        dispatch(
          setFormData({
            id: 'productImages',
            value: images
          })
        )
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
        } catch (error) {
          console.error('Error handling images:', error)
        } finally {
          setLoadingThumbnail(false)
        }
        // if (formData.thumbnailImage) {
        //   handleDeleteImage(formData.thumbnailImage, 'thumbnailImage')
        // }
        // await uploadSingleImageToCloudinary(
        //   validFiles[0],
        //   'thumbnailImage',
        //   newImages => {
        //     dispatch(
        //       setFormData({
        //         id: 'thumbnailImage',
        //         value: [newImages]
        //       })
        //     )
        //   }
        // )
        setLoadingThumbnail(false)
      }
    } else {
      dispatch(setFormData({ id, value }))
    }

    console.log(formData) // Check formData after update
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const validationErros = validateProductForm(formData)
    console.log(validationErros)
    if (Object.keys(validationErros).length > 0) {
      return setErrorMessages(prev => ({ ...prev, ...validationErros }))
    }

    // Send productData to your backend
    try {
      const res = await api.post('/product/add', formData)
      console.log(res)
    } catch (error) {
      console.error(error)
    }

    console.log(formData)

    resetForm()
  }
  // Function to delete image from productImages array
  const handleDeleteImage = (image, type) => {
    console.log('working' + image)

    dispatch(deleteImage({ imageid: image.id, type }))

    dispatch(addDeletedImageUrl(image.id)) // modify later to do delte of image
  }
  const handleCategoryChange = (selectedOption, categoryType) => {
    console.log(selectedOption, categoryType)
    dispatch(
      setFormData({
        id: categoryType,
        value: selectedOption
      })
    )
  }
  const handleImageEdit = (image, type) => {
    console.log(image)
    console.log(image)
    setCropperOpen(true)
    setImageUrl(image.url)
    console.log(imageUrl)
  }
  const handleCropperClose = () => {
    setCropperOpen(false)
  }
  const handleCroppedImage = () => {}
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
      />
      <ImageCropper
        open={cropperOpen}
        onClose={handleCropperClose}
        initialImage={imageUrl}
        onCropComplete={handleCroppedImage}
      />
    </div>
  )
}

export default AdminAddProducts
