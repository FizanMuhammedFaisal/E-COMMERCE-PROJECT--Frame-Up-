import React, { useState, useEffect, useCallback } from 'react'
import CategorySelect from '../../../common/CategorySelect'
import ImageCarousel from '../../../common/ImageCarousel'
import ImageCropper from '../../../common/ImageCropper'
import {
  delteImagesFromCloudinary,
  uploadImagesToCloudinary
} from '../../../../services/Cloudinary/UploadImages'
import apiClient from '../../../../services/api/apiClient'
import validataImages from '../../../../utils/validation/ImageValidation'
import Spinner from '../../../common/Animations/Spinner'

function EditProductTab({
  handleSubmit,
  product,
  handleInputChange,
  handleCategoryChange,
  isLoading,
  setProduct,
  setNewImages,
  newImages,
  setErrorMessages
}) {
  const [cropperOpen, setCropperOpen] = useState({ state: false, type: null })
  const [imageForCrop, setImageForCrop] = useState(null)

  const [imageLoading, setImageLoading] = useState({
    state: false,
    message: null,
    progress: 0
  })
  const [error, setError] = useState(null)

  const categoriesByType = type => {
    return (
      product?.productCategories?.filter(category => category.type === type) ||
      []
    )
  }

  const handleImageEdit = (image, type, currentIndex, DBError) => {
    setCropperOpen({ state: true, type: 'oldImages' })
    const img = { url: image.url, type, currentIndex, DBError, id: image.id }
    setImageForCrop(img)
  }

  const handleImageDelete = async (image, type) => {
    const url = [image.url]
    const id = image.id
    try {
      await delteImagesFromCloudinary(url, type, id, product._id)
    } catch (error) {
      console.log(error)
      setError('errr')
    }
    setProduct(prev => ({
      ...prev,
      [type]: prev[type].filter((_, idx) => idx !== id)
    }))
  }

  const handleCroppedImage = image => {
    if (cropperOpen.type === 'oldImages') {
      handleOldCroppedImage(image)
    } else {
      handleNewCroppedImage(image)
    }
  }
  const handleOldCroppedImage = async image => {
    const type = image.type
    const index = image.index
    const productId = product._id
    const url = [product[type][index]]
    console.log(url)
    setImageLoading({
      state: true,
      progress: 10,
      message: 'Deleting Existing Image'
    })
    try {
      await delteImagesFromCloudinary(url, type, index, productId)
    } catch (error) {
      console.log(error)
      setError('Failed to delete image')
      return setImageLoading({
        state: false
      })
    }
    try {
      setImageLoading({
        state: true,
        message: 'Uploading New Image',
        progress: 70
      })
      const result = await uploadImagesToCloudinary([image.image])
      setImageLoading(prev => ({ ...prev, progress: 80 }))
      const product = {
        [type]: result
      }
      const res = await apiClient.put(`/api/products/${productId}`, product)
      setImageLoading({ progress: 99, message: 'Confirming with server' })
      setProduct(prev => ({
        ...prev,
        [image.type]: prev[image.type].map((item, idx) =>
          idx === image.index ? result : item
        )
      }))

      setCropperOpen({ state: false })
    } catch (error) {
      console.log(error)
      setError('Failed to upload new image')
    } finally {
      setImageLoading({
        state: false
      })
    }
  }
  const handleNewCroppedImage = async image => {
    setNewImages(prev => ({
      ...prev,
      [image.type]: prev[image.type].map((item, idx) =>
        idx === image.index ? image.image : item
      )
    }))
    setCropperOpen({ state: false })
  }
  const handleFileInput = async e => {
    const { id, value, files } = e.target
    const images = Array.from(files)
    const { isValid, errors, validFiles } = validataImages(images)
    //setting errors
    if (!isValid) {
      return setErrorMessages(prev => ({
        ...prev,
        [id]: errors.join(', ')
      }))
    }
    setNewImages(prev => ({
      ...prev,
      [id]: [...prev.productImages, ...validFiles]
    }))
  }

  const handleThumbnailUpdate = async (e, url) => {
    const { id, value, files } = e.target
    console.log(typeof url)
    if (Object.keys(url).length !== 0) {
      const image = { id: 0, url: url[0] }
      handleImageDelete(image, [id])
    }
    const images = Array.from(files)
    const { isValid, errors, validFiles } = validataImages(images)
    //setting errors
    if (!isValid) {
      return setErrorMessages(prev => ({
        ...prev,
        [id]: errors.join(', ')
      }))
    }
    setNewImages(prev => ({
      ...prev,
      [id]: validFiles
    }))
  }
  const handleNewImagesEdit = (image, type, currentIndex, DBError) => {
    setCropperOpen({ state: true, type: 'newImages' })
    const img = { url: image.url, type, currentIndex, DBError, id: image.id }
    setImageForCrop(img)
  }
  const handleNewImagesDelete = (image, type) => {
    setNewImages(prev => ({
      ...prev,
      [type]: prev[type].filter((_, idx) => idx !== image.id)
    }))
  }
  return (
    <div className='bg-white dark:bg-customP2ForegroundD_300 shadow-md rounded-lg overflow-hidden'>
      <div className='p-6'>
        <h2 className='text-2xl font-bold mb-4'>Edit Product</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='productName'
              className='block mb-2 text-sm font-medium dark:text-slate-100 text-gray-700'
            >
              Product Name
            </label>
            <input
              type='text'
              id='productName'
              name='productName'
              value={product.productName}
              onChange={handleInputChange}
              required
              className='p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50'
            />
          </div>
          <div>
            <label
              htmlFor='productDescription'
              className='block mb-2 text-sm font-medium dark:text-slate-100 text-gray-700'
            >
              Description
            </label>
            <textarea
              id='productDescription'
              name='productDescription'
              value={product.productDescription}
              onChange={handleInputChange}
              required
              rows={3}
              className='p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50'
            />
          </div>
          <div>
            <label
              htmlFor='productPrice'
              className='block mb-2 text-sm font-medium dark:text-slate-100 text-gray-700'
            >
              Price
            </label>
            <input
              type='number'
              id='productPrice'
              name='productPrice'
              value={product.productPrice}
              onChange={handleInputChange}
              required
              className='p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50'
            />
          </div>
          <div>
            <label
              htmlFor='categories'
              className='block mb-2 text-sm font-medium dark:text-slate-100 text-gray-700'
            >
              Categories
            </label>
            <div className='flex flex-col dark:bg-customP2ForegroundD_100 gap-3 xl:flex-row sm:gap-4 w-full border p-4 py-4 rounded-xl border-gray-200 dark:border-customP2ForegroundD_400'>
              {['Theme', 'Style', 'Technique'].map(type => (
                <div
                  key={type}
                  className='flex-1 dark:text-slate-200 text-slate-900'
                >
                  <p className='mb-2'>{type}s</p>
                  <CategorySelect
                    type={type.toLowerCase()}
                    value={categoriesByType(type)}
                    onChange={selectedOption =>
                      handleCategoryChange(selectedOption, type)
                    }
                    placeholder={`Select ${type.toLowerCase()}s...`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className='flex p-2 justify-between'>
              <label
                htmlFor='thumbnailImage'
                className='block mb-2 text-sm font-medium dark:text-slate-100 text-gray-700'
              >
                Thumbnail Image
              </label>
              <button
                type='button'
                onClick={() => {
                  document.getElementById('thumbnailImage').click()
                }}
                className='bg-customP2Primary hover:bg-customP2BackgroundD_600 text-white px-4 py-2 rounded-md font-medium transition-all'
              >
                {product.thumbnailImage.length > 0
                  ? ' Update Thumbnail'
                  : newImages.thumbnailImage.length > 0
                    ? 'Update Thumbnail'
                    : 'Upload Thumbnail'}
              </button>
            </div>
            <div>
              <div>
                {product.thumbnailImage.length > 0 ? (
                  <ImageCarousel
                    imageIds={product?.thumbnailImage}
                    cloudinaryMode={true}
                    onEdit={handleImageEdit}
                    type={'thumbnailImage'}
                    onDelete={handleImageDelete}
                  />
                ) : (
                  <div>
                    <ImageCarousel
                      imageIds={newImages?.thumbnailImage}
                      DBError={true}
                      onEdit={handleNewImagesEdit}
                      type={'thumbnailImage'}
                      onDelete={handleNewImagesDelete}
                    />
                  </div>
                )}
              </div>
              <input
                type='file'
                id='thumbnailImage'
                multiple
                accept='image/jpeg, image/png,image/webp'
                className='hidden'
                onChange={e =>
                  handleThumbnailUpdate(e, product?.thumbnailImage)
                }
              />
            </div>
          </div>
          <div>
            <div className='p-3 flex justify-between'>
              <label
                htmlFor='productImages'
                className='dark:text-slate-200 text-slate-900 mb-2 font-medium '
              >
                Product Images
              </label>
              <button
                type='button'
                className='bg-customP2Primary hover:bg-customP2BackgroundD_600 text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={() => document.getElementById('productImages').click()}
              >
                {product.productImages?.length > 0
                  ? 'Add More Images'
                  : 'Upload Images'}
              </button>
            </div>
            <input
              type='file'
              id='productImages'
              multiple
              accept='image/jpeg, image/png,image/webp'
              className='hidden'
              onChange={handleFileInput}
            />
            <ImageCarousel
              imageIds={product.productImages}
              cloudinaryMode={true}
              onEdit={handleImageEdit}
              type={'productImages'}
              onDelete={handleImageDelete}
            />
          </div>
          {newImages?.productImages?.length > 0 && (
            <div>
              <h3 className='text-lg font-medium mb-2'>
                Newly Uploaded Images
              </h3>
              <ImageCarousel
                imageIds={newImages.productImages}
                DBError={true}
                onEdit={handleNewImagesEdit}
                type={'ProductImages'}
                onDelete={handleNewImagesDelete}
              />
            </div>
          )}
          <div>
            <label
              htmlFor='dimensions'
              className='block mb-2 text-sm font-medium dark:text-slate-100 text-gray-700'
            >
              Dimensions
            </label>
            <input
              type='text'
              id='dimensions'
              name='dimensions'
              value={product.dimensions || ''}
              onChange={handleInputChange}
              className='p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50'
            />
          </div>
          <div>
            <label
              htmlFor='weight'
              className='block mb-2 text-sm font-medium dark:text-slate-100 text-gray-700'
            >
              Weight
            </label>
            <input
              type='text'
              id='weight'
              name='weight'
              value={product.weight || ''}
              onChange={handleInputChange}
              className='p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50'
            />
          </div>
          <div>
            <label
              htmlFor='productYear'
              className='block mb-2 text-sm font-medium dark:text-slate-100 text-gray-700'
            >
              Year
            </label>
            <input
              type='text'
              id='productYear'
              name='productYear'
              value={product.productYear || ''}
              onChange={handleInputChange}
              className='p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50'
            />
          </div>
          <div>
            <label
              htmlFor='inStock'
              className='block mb-2 text-sm font-medium dark:text-slate-100 text-gray-700'
            >
              Stock
            </label>
            <input
              type='number'
              id='productStock'
              name='productStock'
              value={product.productStock}
              onChange={handleInputChange}
              className='p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50'
            />
          </div>
          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-customP2Primary duration-300 hover:bg-customP2BackgroundD_600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 '
          >
            {isLoading ? (
              <div className=' flex justify-center'>
                <div className='flex justify-center mr-2'>
                  <Spinner size={-1} />
                </div>
                Updating...
              </div>
            ) : (
              'Update Product'
            )}
          </button>
        </form>
        <ImageCropper
          open={cropperOpen.state}
          onClose={() => {
            setCropperOpen({ state: false })
          }}
          initialImage={imageForCrop}
          onCropComplete={handleCroppedImage}
          imageLoading={imageLoading}
          error={error}
        />
      </div>
    </div>
  )
}

export default EditProductTab
