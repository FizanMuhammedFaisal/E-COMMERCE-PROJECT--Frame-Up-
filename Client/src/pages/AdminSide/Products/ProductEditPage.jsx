import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import apiClient from '../../../services/api/apiClient'
import { deleteData } from '../../../redux/slices/Admin/AdminProducts/adminProductsSlice'
import { useDispatch } from 'react-redux'
import EditProductTab from '../../../components/layout/AdminSide/Products/EditProductTab'
import Spinner from '../../../components/common/Animations/Spinner'
import DetailsProductTab from '../../../components/layout/AdminSide/Products/DetailsProductTab'
import { uploadImagesToCloudinary } from '../../../services/Cloudinary/UploadImages'

export default function ProductEditPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [newImages, setNewImages] = useState({
    thumbnailImage: [],
    productImages: []
  })
  const [errorMessages, setErrorMessages] = useState({})
  const [pageLoading, setPageLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [error, setError] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const loadProduct = async () => {
      setPageLoading(true)
      setError(null)
      try {
        const res = await apiClient.get(`/api/products/${productId}`)
        console.log(res.data)
        setProduct(res.data.product[0])
      } catch (error) {
        setError('Failed to load product details.')
      } finally {
        setPageLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  const handleCategoryChange = (selectedOption, type) => {
    const selectedOptionsArray = Array.isArray(selectedOption)
      ? selectedOption
      : [selectedOption]

    // Create an array of new categories with the specified type
    const newCategories = selectedOptionsArray.map(option => ({
      _id: option.value,
      name: option.label,
      type
    }))
    // Update the product categories
    setProduct(prevProduct => {
      // Filter out existing categories of the same type to avoid duplicates
      const updatedCategories = [
        ...prevProduct.productCategories.filter(curr => {
          return curr.type !== type
        }),
        ...newCategories
      ]

      return {
        ...prevProduct,
        productCategories: updatedCategories
      }
    })
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    console.log(name, value)
    setProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const isThumbnailChanged = newImages.thumbnailImage.length > 0
    const isProductImagesChanged = newImages.productImages.length > 0
    const updatedProduct = { ...product }

    if (isThumbnailChanged) {
      const url = await uploadImagesToCloudinary(newImages.thumbnailImage)
      updatedProduct.thumbnailImage = [...url]
    }

    if (isProductImagesChanged) {
      const url = await uploadImagesToCloudinary(newImages.productImages)
      updatedProduct.productImages = [...(product?.productImages || []), ...url]
    }

    try {
      const res = await apiClient.put(
        `/api/products/${productId}`,
        updatedProduct
      )
      if (res.status === 200) {
        setProduct(res?.data?.updatedProduct)
        setNewImages({
          thumbnailImage: [],
          productImages: []
        })
        dispatch(deleteData())
        setActiveTab('details')
      } else {
        throw new Error('Unexpected response status')
      }
    } catch (error) {
      console.error('Failed to update product:', error)
      setError('Failed to update product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (pageLoading) {
    return <Spinner center={true} />
  }

  if (error) {
    return <div className='text-red-500 text-center'>{error}</div>
  }

  if (!product) {
    return <div className='text-center'>Product not found</div>
  }

  return (
    <>
      <div className='container mx-auto p-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className='text-3xl font-bold mb-6'>Product Management</h1>

          <div className='space-y-4'>
            <div className='flex space-x-2 border-b'>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'details'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'edit'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('edit')}
              >
                Edit
              </button>
            </div>

            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'details' && (
                  <DetailsProductTab product={product} />
                )}

                {activeTab === 'edit' && (
                  <EditProductTab
                    product={product}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    handleCategoryChange={handleCategoryChange}
                    isLoading={isLoading}
                    setProduct={setProduct}
                    setNewImages={setNewImages}
                    newImages={newImages}
                    setErrorMessages={setErrorMessages}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  )
}
