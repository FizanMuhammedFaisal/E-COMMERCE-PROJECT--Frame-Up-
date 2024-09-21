import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle } from 'lucide-react'
import apiClient from '../../../services/api/apiClient'
import CategorySelect from '../../../components/common/CategorySelect'
import { CircularProgress } from '@mui/material'

export default function ProductEditPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await apiClient.get(`/api/products/${productId}`)
        setProduct(res.data)
      } catch (error) {
        setError('Failed to load product details.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  const categoriesByType = type => {
    return (
      product?.productCategories?.filter(category => category.type === type) ||
      []
    )
  }

  const handleCategoryChange = (selectedOption, type) => {
    // Convert selectedOption to an array if it's not already
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
    setProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const res = await apiClient.put(`/api/products/${productId}`, product)

      if (res.status === 200) {
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

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <CircularProgress color='inherit' size={35} />
      </div>
    )
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
                  <div className='bg-white dark:bg-customP2ForegroundD_300 shadow-md rounded-lg overflow-hidden'>
                    <div className='p-6'>
                      <h2 className='text-2xl font-bold mb-4'>
                        Product Details
                      </h2>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <img
                            src={product.thumbnailImage[0]}
                            alt={product.productName}
                            className='w-full h-auto rounded-lg shadow-md'
                          />
                        </motion.div>
                        <div>
                          <h3 className='text-xl font-semibold mb-2'>
                            {product.productName}
                          </h3>
                          <p className='mb-4'>
                            Description: {product.productDescription}
                          </p>
                          <p className='text-lg font-bold mb-2'>
                            Price: ${product.productPrice}
                          </p>
                          <h3 className='mb-2'>
                            Categories:
                            <ul>
                              {product.productCategories.map(
                                (category, index) => (
                                  <li key={category._id || index}>
                                    {category.name} ({category.type})
                                  </li>
                                )
                              )}
                            </ul>
                          </h3>
                          <p className='mb-2'>
                            Dimensions: {product.dimensions || 'Not specified'}
                          </p>
                          <p className='mb-2'>
                            Weight: {product.weight || 'Not specified'}
                          </p>
                          <p className='mb-2'>
                            Year: {product.productYear || 'Not specified'}
                          </p>
                          <div className='mt-4'>
                            <h4 className='text-lg font-semibold mb-2'>
                              Availability
                            </h4>
                            <div className='flex items-center'>
                              {product.productStock ? (
                                <CheckCircle className='text-green-500 mr-2' />
                              ) : (
                                <AlertCircle className='text-red-500 mr-2' />
                              )}
                              <span>
                                {product.productStock
                                  ? 'In Stock'
                                  : 'Out of Stock'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'edit' && (
                  <div className='bg-white dark:bg-customP2ForegroundD_300 shadow-md rounded-lg overflow-hidden'>
                    <div className='p-6'>
                      {/* <button
                      onClick={() => {
                        console.log(product)
                      }}
                    >
                      sdaf
                    </button> */}
                      <h2 className='text-2xl font-bold mb-4'>Edit Product</h2>
                      <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                          <label
                            htmlFor='productName'
                            className='block  mb-2  text-sm font-medium dark:text-slate-100 text-gray-700'
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
                            className='p-2 border border-gray-300 rounded-lg w-full dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 focus:ring-customP2Primary focus:border-customP2Primary ring-customP2Primary sm:text-sm dark:text-slate-50'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='productDescription'
                            className='block  mb-2  text-sm font-medium dark:text-slate-100 text-gray-700'
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
                            className='p-2 border border-gray-300 rounded-lg w-full  dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 focus:ring-customP2Primary focus:border-customP2Primary ring-customP2Primary sm:text-sm dark:text-slate-50'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='productPrice'
                            className='block  mb-2  text-sm font-medium dark:text-slate-100 text-gray-700'
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
                            className='p-2 border border-gray-300 rounded-lg w-full dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 focus:ring-customP2Primary focus:border-customP2Primary ring-customP2Primary sm:text-sm dark:text-slate-50'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='categories'
                            className='block  mb-2  text-sm font-medium dark:text-slate-100 text-gray-700'
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
                          <label
                            htmlFor='dimensions'
                            className='block  mb-2  text-sm font-medium dark:text-slate-100 text-gray-700'
                          >
                            Dimensions
                          </label>
                          <input
                            type='text'
                            id='dimensions'
                            name='dimensions'
                            value={product.dimensions || ''}
                            onChange={handleInputChange}
                            className='p-2 border border-gray-300 rounded-lg w-full dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 focus:ring-customP2Primary focus:border-customP2Primary ring-customP2Primary sm:text-sm dark:text-slate-50'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='weight'
                            className='block  mb-2  text-sm font-medium dark:text-slate-100 text-gray-700'
                          >
                            Weight
                          </label>
                          <input
                            type='text'
                            id='weight'
                            name='weight'
                            value={product.weight || ''}
                            onChange={handleInputChange}
                            className='p-2 border border-gray-300 rounded-lg w-full dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 focus:ring-customP2Primary focus:border-customP2Primary ring-customP2Primary sm:text-sm dark:text-slate-50'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='productYear'
                            className='block  mb-2  text-sm font-medium dark:text-slate-100 text-gray-700'
                          >
                            Year
                          </label>
                          <input
                            type='text'
                            id='productYear'
                            name='productYear'
                            value={product.productYear || ''}
                            onChange={handleInputChange}
                            className='p-2 border border-gray-300 rounded-lg w-full dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 focus:ring-customP2Primary focus:border-customP2Primary ring-customP2Primary sm:text-sm dark:text-slate-50'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='inStock'
                            className='block  mb-2  text-sm font-medium dark:text-slate-100 text-gray-700'
                          >
                            Stock
                          </label>
                          <input
                            type='number'
                            id='productStock'
                            name='productStock'
                            value={product.productStock}
                            onChange={handleInputChange}
                            className='p-2 border border-gray-300 rounded-lg w-full dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 focus:ring-customP2Primary focus:border-customP2Primary ring-customP2Primary sm:text-sm dark:text-slate-50'
                          />
                        </div>
                        <button
                          type='submit'
                          disabled={isLoading}
                          className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-customP2Primary duration-300 hover:bg-customP2BackgroundD_600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400'
                        >
                          {isLoading ? 'Updating...' : 'Update Product'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  )
}
