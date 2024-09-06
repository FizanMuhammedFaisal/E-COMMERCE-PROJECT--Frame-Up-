import React, { useState } from 'react'
import axios from 'axios'
import api from '../../services/api/api'
const AdminAddProducts = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productPrice: '',
    productCategory: '',
    productDescription: '',
    productImages: null,
    thumbnailImage: null,
    weight: '',
    dimensions: ''
  })
  // Cloudinary upload preset and URL
  const cloudinaryPreset = 'q0d7w8ja'
  const cloudinaryURL = `https://api.cloudinary.com/v1_1/dib5gltn2/image/upload`
  const handleChange = async e => {
    const { id, value, files } = e.target
    console.log(id)
    if (files) {
      if (e.target.multiple) {
        // Convert FileList to an array if it's multiple files
        const images = Array.from(files)
        // console.log(images)
        // setFormData({
        //   ...formData,
        //   [id]: Array.from(files) // Store all selected files as an array
        // })
        await uploadImagesToCloudinary(images, 'productImages')
      } else {
        // setFormData({ ...formData, [id]: files[0] })
        await uploadSingleImageToCloudinary(files[0], 'thumbnailImage')
      }
    } else {
      setFormData({ ...formData, [id]: value })
    }
    console.log(formData)
  }
  // Function to upload multiple images to Cloudinary
  const uploadImagesToCloudinary = async (files, id) => {
    console.log('esed')
    const uploadedImages = []

    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', cloudinaryPreset)

      try {
        const res = await axios.post(cloudinaryURL, formData)
        uploadedImages.push(res.data.secure_url)
      } catch (err) {
        console.error('Error uploading image:', err)
      }
    }

    setFormData(prev => ({
      ...prev,
      [id]: uploadedImages
    }))
  }
  // Function to upload a single image (e.g., thumbnail)
  const uploadSingleImageToCloudinary = async (file, id) => {
    const uploadedImages = []
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', cloudinaryPreset)
    try {
      const res = await axios.post(cloudinaryURL, formData)
      console.log(res)
      uploadedImages.push(res.data.secure_url)
    } catch (err) {
      console.error('Error uploading image:', err)
    }
    setFormData(prev => ({
      ...prev,
      [id]: uploadedImages
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

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

    // You can also reset the form after submission
    // setFormData({
    //   productName: '',
    //   productPrice: '',
    //   productCategory: '',
    //   productDescription: '',
    //   productImages: null,
    //   thumbnailImage: null,
    //   weight: '',
    //   dimensions: ''
    // })
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      {/* Heading */}
      <h1 className='text-4xl font-bold mb-8 text-center'>Add New Product</h1>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Product Information Section */}
        <div className='bg-gray-100 p-6 rounded-lg shadow-md space-y-6'>
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
              className='p-2 border border-gray-300 rounded-lg'
              placeholder='Enter product name'
              required
            />
          </div>

          {/* Product Price */}
          <div className='flex flex-col'>
            <label htmlFor='productPrice' className='mb-2 font-medium'>
              Product Price <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='productPrice'
              value={formData.productPrice}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-lg'
              placeholder='Enter product price'
              required
            />
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
              className='p-2 border border-gray-300 rounded-lg'
              placeholder='Enter product category'
              required
            />
          </div>
        </div>

        {/* Product Description Section */}
        <div className='bg-gray-100 p-6 rounded-lg shadow-md space-y-4'>
          <h2 className='text-xl font-semibold'>Product Description</h2>
          <textarea
            id='productDescription'
            value={formData.productDescription}
            onChange={handleChange}
            rows='5'
            className='p-2 border border-gray-300 rounded-lg w-full'
            placeholder='Enter product description'
          ></textarea>
        </div>

        {/* Product Images Section */}
        <div className='bg-gray-100 p-6 rounded-lg shadow-md space-y-4'>
          <h2 className='text-xl font-semibold'>Product Images</h2>
          <div className='flex flex-col'>
            <label htmlFor='productImages' className='mb-2 font-medium'>
              Upload Product Images <span className='text-red-500'>*</span>
            </label>
            <input
              type='file'
              id='productImages'
              multiple
              className='p-2 border border-gray-300 rounded-lg'
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='thumbnailImage' className='mb-2 font-medium'>
              Upload Thumbnail Image
            </label>
            <input
              type='file'
              id='thumbnailImage'
              className='p-2 border border-gray-300 rounded-lg'
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Shipping Details Section */}
        <div className='bg-gray-100 p-6 rounded-lg shadow-md space-y-4'>
          <h2 className='text-xl font-semibold'>Shipping Details</h2>
          <div className='flex flex-col'>
            <label htmlFor='weight' className='mb-2 font-medium'>
              Weight (kg)
            </label>
            <input
              type='text'
              id='weight'
              value={formData.weight}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-lg'
              placeholder='Enter product weight'
            />
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
              className='p-2 border border-gray-300 rounded-lg'
              placeholder='Enter product dimensions'
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className='mt-8 text-right'>
          <button
            type='submit'
            className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600'
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminAddProducts
