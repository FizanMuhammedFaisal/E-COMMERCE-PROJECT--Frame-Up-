import React, { useState } from 'react'
import validateProductForm from '../../utils/validation/ProductFormValidation'

import api from '../../services/api/api'
import validataImages from '../../utils/validation/ImageValidation'
import { CircularProgress } from '@mui/material'
import {
  uploadImagesToCloudinary,
  uploadSingleImageToCloudinary
} from '../../services/Cloudinary/UploadImages'
const AdminAddProducts = () => {
  const [deletedImageUrls, setDeletedImageUrls] = useState([])
  const [formData, setFormData] = useState({
    productName: '',
    productPrice: '',
    productCategory: '',
    productDescription: '',
    productImages: [],
    thumbnailImage: null,
    weight: '',
    dimensions: ''
  })
  const resetForm = () => {
    setFormData({
      productName: '',
      productPrice: '',
      productCategory: '',
      productDescription: '',
      productImages: [],
      thumbnailImage: null,
      weight: '',
      dimensions: ''
    })
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
      if (!isValid) {
        console.log(errors)
        if (e.target.multiple) {
          return setErrorMessages(prev => ({
            ...prev,
            productImages: errors.join(', ')
          }))
        }
        return setErrorMessages(prev => ({
          ...prev,
          thumbnailImage: errors.join(',')
        }))
      }
      setErrorMessages(prev => ({
        ...prev,
        productImagesError: '' // Clear error when images are valid
      }))

      if (e.target.multiple) {
        setLoadingImages(true)
        await uploadImagesToCloudinary(
          validFiles,
          'productImages',
          newImages => {
            setFormData(prev => ({
              ...prev,
              productImages: [...prev.productImages, ...newImages]
            }))
          }
        )
        setLoadingImages(false)
      } else {
        setLoadingThumbnail(true)
        if (formData.thumbnailImage) {
          handleDeleteImage(formData.thumbnailImage, 'thumbnailImage')
        }
        await uploadSingleImageToCloudinary(
          validFiles[0],
          'thumbnailImage',
          setFormData
        )
        setLoadingThumbnail(false)
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }))
    }
    console.log(formData)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const validationErros = validateProductForm(formData)
    console.log(validationErros)
    if (Object.keys(validationErros).length > 0) {
      return setErrorMessages(prev => ({ ...prev, ...validationErros }))
    }
    const productData = {
      ...formData,
      productImages: formData.productImages, // Cloudinary URLs for product images
      thumbnailImage: formData.thumbnailImage // Cloudinary URL for thumbnail image
    }

    // Send productData to your backend
    try {
      const res = await api.post('/product/add', formData)
      console.log(res)
    } catch (error) {
      console.error(error)
    }
    console.log('Final Product Data:', productData)

    console.log(formData)

    resetForm()
  }
  // Function to delete image from productImages array
  const handleDeleteImage = (image, type) => {
    console.log('working' + image)
    if (type === 'productImages') {
      // Remove the image object with the matching image URL
      setFormData(prev => {
        const updatedImages = prev.productImages.filter(
          img => img.url !== image.url
        )

        return {
          ...prev,
          productImages: updatedImages
        }
      })
    }
    // Push the publicId of the deleted image to the deletedImageUrls array
    setDeletedImageUrls(prev => [
      ...prev,
      image.publicId // This is the publicId of the deleted image
    ])
  }

  return (
    <div className='max-w-4xl mx-auto p-6 font-primary  dark:text-slate-50'>
      {/* Heading */}
      <h1 className='text-4xl font-bold mb-8 text-center '>Add New Product</h1>

      <form onSubmit={handleSubmit} className='space-y-6 '>
        {/* Product Information Section */}
        <div className='bg-gray-100 p-6 rounded-lg shadow-md space-y-6 dark:bg-gray-800 dark:text-white'>
          <h2 className='text-xl font-semibold'>Product Information</h2>

          {/* Product Name */}
          <div className='flex flex-col'>
            <label htmlFor='productName' className='mb-2 font-medium'>
              Product Name <span className='text-red-500'>*</span>
            </label>

            <input
              type='text'
              id='productName'
              value={formData.productName}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50'
              placeholder='Enter product name'
            />
            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.productName}
                </p>
              )}
            </div>
          </div>

          {/* Product Price */}
          <div className='flex flex-col'>
            <label htmlFor='productPrice' className='mb-2 font-medium'>
              Product Price <span className='text-red-500'>*</span>
            </label>
            <input
              type='number'
              id='productPrice'
              value={formData.productPrice}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50'
              placeholder='Enter product price'
            />
            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.productPrice}
                </p>
              )}
            </div>
          </div>

          {/* Product Category */}
          <div className='flex flex-col'>
            <label htmlFor='productCategory' className='mb-2 font-medium'>
              Product Category <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='productCategory'
              value={formData.productCategory}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50'
              placeholder='Enter product category'
            />
            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.productCategory}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className='bg-gray-100 p-6 rounded-lg shadow-md space-y-4 dark:bg-gray-800 dark:text-white'>
          <h2 className='text-xl font-semibold'>Product Description</h2>
          <textarea
            id='productDescription'
            value={formData.productDescription}
            onChange={handleChange}
            rows='5'
            className='p-2 border border-gray-300 rounded-lg w-full  dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50'
            placeholder='Enter product description'
          ></textarea>
          <div className='pt-2 font-tertiary'>
            {errorMessages && (
              <p className='text-red-500 hover:text-red-300'>
                {errorMessages.productDescription}
              </p>
            )}
          </div>
        </div>

        <div className='bg-white p-8 rounded-lg shadow-lg space-y-6 dark:bg-gray-800 dark:text-white'>
          <h2 className='text-2xl font-semibold text-center mb-6'>
            Product and Thumbnail Images
          </h2>

          {/* Product Images Section */}
          <div className='space-y-4'>
            <p className='font-semibold text-lg'>
              Upload Multiple Product Images
            </p>

            {errorMessages.productImages && (
              <p className='text-red-500'>{errorMessages.productImages}</p>
            )}

            {/* Custom Button to Trigger File Input */}
            <div className='flex items-center justify-between'>
              <button
                type='button'
                disabled={loadingImages}
                className={`${
                  loadingImages
                    ? 'bg-gray-400'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={() => document.getElementById('productImages').click()}
              >
                {formData.productImages.length > 0
                  ? 'Add More Images'
                  : 'Upload Images'}
              </button>

              {loadingImages && (
                <div className='flex items-center space-x-2'>
                  <p className='text-blue-500'>Uploading...</p>
                  <CircularProgress color='primary' size={25} />
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type='file'
              id='productImages'
              multiple
              accept='image/jpeg, image/png'
              className='hidden'
              onChange={handleChange}
            />

            {/* Display uploaded product images */}
            <div className='flex gap-4 flex-wrap justify-center mt-4'>
              {formData.productImages.map((image, index) => (
                <div key={index} className='relative'>
                  <img
                    src={image.url}
                    alt={`Product ${index}`}
                    className='w-28 h-28 object-cover rounded-lg shadow-md'
                  />
                  {/* Delete button for each product image */}
                  <button
                    type='button'
                    className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
                    onClick={() => handleDeleteImage(image, 'productImages')}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <hr className='border-gray-200 my-6' />

          {/* Thumbnail Image Section */}
          <div className='space-y-4'>
            <p className='font-semibold text-lg'>Upload Thumbnail Image</p>
            {errorMessages.thumbnailImage && (
              <p className='text-red-500'>{errorMessages.thumbnailImage}</p>
            )}
            {/* Custom Button for Thumbnail */}
            <div className='flex items-center justify-between'>
              <button
                type='button'
                disabled={loadingThumbnail}
                className={`${
                  loadingThumbnail
                    ? 'bg-gray-400'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={() =>
                  document.getElementById('thumbnailImage').click()
                }
              >
                {formData.thumbnailImage
                  ? 'Change Thumbnail Image'
                  : 'Upload Thumbnail Image'}
              </button>
              {loadingThumbnail && (
                <div className='flex items-center space-x-2'>
                  <p className='text-blue-500'>Uploading...</p>
                  <CircularProgress color='primary' size={25} />
                </div>
              )}
            </div>

            {/* Hidden Thumbnail Input */}
            <input
              type='file'
              accept='image/jpeg, image/png'
              id='thumbnailImage'
              className='hidden'
              onChange={handleChange}
            />

            {/* Display uploaded thumbnail image */}
            <div className='flex gap-4 justify-center mt-4'>
              {formData.thumbnailImage && (
                <div className='relative'>
                  <img
                    src={formData.thumbnailImage.url}
                    alt='Thumbnail'
                    className='w-28 h-28 object-cover rounded-lg shadow-md'
                  />
                  {/* Delete button for thumbnail image */}
                  <button
                    type='button'
                    className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
                    onClick={() =>
                      handleDeleteImage(
                        formData.thumbnailImage,
                        'thumbnailImage'
                      )
                    }
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              console.log(deletedImageUrls)
            }}
          >
            hey
          </button>
        </div>

        {/* Shipping Details Section */}
        <div className='bg-gray-100 p-6 rounded-lg shadow-md space-y-4 dark:bg-gray-800 dark:text-white'>
          <h2 className='text-xl font-semibold'>Shipping Details</h2>
          <div className='flex flex-col'>
            <label htmlFor='weight' className='mb-2 font-medium'>
              Weight (kg)
            </label>
            <input
              type='number'
              id='weight'
              value={formData.weight}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50'
              placeholder='Enter product weight'
            />
            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.weight}
                </p>
              )}
            </div>
          </div>
          <div className='flex flex-col'>
            <label htmlFor='dimensions' className='mb-2 font-medium'>
              Dimensions (cm)
            </label>
            <input
              type='text'
              id='dimensions'
              value={formData.dimensions}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50'
              placeholder='Enter product dimensions'
            />
            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.dimensions}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className='mt-8 text-center'>
          <button
            type='submit'
            className={`${
              loadingThumbnail ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={loadingImages || loadingThumbnail}
          >
            Add Product
          </button>
        </div>
        <div>
          {/* <div className='col-span-full'>
            <label
              htmlFor='cover-photo'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Cover photo
            </label>
            <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
              <div className='text-center'>
                <div className='mt-4 flex text-sm leading-6 text-gray-600'>
                  <label
                    htmlFor='file-upload'
                    className='relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500'
                  >
                    <span>Upload a file</span>
                    <input
                      id='file-upload'
                      name='file-upload'
                      type='file'
                      className='sr-only'
                    />
                  </label>
                  <p className='pl-1'>or drag and drop</p>
                </div>
                <p className='text-xs leading-5 text-gray-600'>
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </form>
    </div>
  )
}

export default AdminAddProducts
