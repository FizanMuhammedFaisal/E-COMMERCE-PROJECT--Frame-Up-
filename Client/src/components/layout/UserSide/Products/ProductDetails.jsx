import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Alert, Button, LinearProgress, Snackbar } from '@mui/material'
import {
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import ImageZoomModal from '../../../modals/ImageZoomModal'
import ProductRatings from '../../../common/ProductRatings'
import ProductFeatures from './ProductFeatures'
import { useCart } from '../../../../hooks/useCart'
import { CrossIcon } from 'lucide-react'

function ProductDetails({ product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const [added, setAdded] = useState(false)
  const { isAuthenticated } = useSelector(state => state.auth)
  const { addToCart, loading } = useCart()
  const navigate = useNavigate()
  const allImages = [...product.productImages, ...product.thumbnailImage]

  const handleThumbnailClick = index => setSelectedImageIndex(index)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      return setSnackbarData({
        open: true,
        message: 'Login to add items to your cart',
        severity: 'error'
      })
    }
    const result = await addToCart(product._id, product.productPrice, 1)
    if (result.success) {
      setAdded(true)
      setSnackbarData({
        open: true,
        message: 'Product added to cart!',
        severity: 'success'
      })
    } else {
      setSnackbarData({
        open: true,
        message: result.error,
        severity: 'error'
      })
    }
  }

  const handleCloseSnackbar = () =>
    setSnackbarData({ ...snackbarData, open: false })

  return (
    <div className='bg-gray-50 min-h-screen py-12'>
      <div className='max-w-full'>
        <section className='py-16 font-primary '>
          <div className='container mx-auto px-4'>
            <div className='flex flex-col lg:flex-row items-start'>
              {/* Left column - Image section */}
              <div className='lg:w-1/2 relative overflow-hidden'>
                <div
                  className='w-full h-96 relative overflow-hidden'
                  onClick={openModal}
                >
                  <motion.div
                    className='flex h-full'
                    animate={{ x: `-${100 * selectedImageIndex}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    {allImages.map((image, index) => (
                      <div
                        key={index}
                        className='w-full h-full flex-shrink-0 flex items-center justify-center'
                      >
                        <img
                          src={image || '/placeholder.svg'}
                          alt={`Product ${index + 1}`}
                          className='max-w-full max-h-full hover:scale-105 duration-500 cursor-pointer object-contain'
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Thumbnail Gallery */}
                <div className='mt-8'>
                  <h2 className='text-xl font-semibold mb-4'>Product Images</h2>
                  <div className='flex space-x-4 overflow-x-auto'>
                    {allImages.map((image, index) => (
                      <div key={index} className='relative flex-shrink-0'>
                        <motion.div
                          className='cursor-pointer mb-2'
                          onClick={() => handleThumbnailClick(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 10
                          }}
                        >
                          <div className='h-24 w-24 flex items-center justify-center'>
                            <img
                              src={image || '/placeholder.svg'}
                              alt={`Thumbnail ${index + 1}`}
                              className='w-full h-full object-cover'
                              loading='lazy'
                            />
                          </div>
                        </motion.div>
                        {selectedImageIndex === index && (
                          <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-indigo-600'></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column - Product Details */}
              <div className='lg:w-1/2 lg:pl-12 mt-8 lg:mt-0'>
                <h1 className='text-4xl font-bold mb-4 text-gray-900'>
                  {product.productName}
                </h1>
                <p className='text-xl mb-8 text-gray-600'>
                  {product.productDescription}
                </p>
                <p className='text-3xl font-bold mb-4'>
                  ${product.productPrice.toFixed(2)}
                </p>

                {/* Reviews placeholder */}
                <div className='mb-6'>
                  <div className='flex items-center'>
                    {[0, 1, 2, 3, 4].map(rating => (
                      <StarIcon
                        key={rating}
                        className={`h-5 w-5 flex-shrink-0 ${
                          rating < Math.floor(4.5)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        aria-hidden='true'
                      />
                    ))}
                    <p className='ml-2 text-sm text-gray-600'>
                      4.5 out of 5 stars
                    </p>
                  </div>
                </div>

                <div className='text-md text-gray-700 mb-4'>
                  <strong>Dimensions:</strong> {product.dimensions}
                </div>
                <div className='text-md text-gray-700 mb-8'>
                  <strong>Weight:</strong> {product.weight} kg
                </div>

                {product.productStock > 0 ? (
                  <div className='flex items-center mb-6'>
                    <CheckIcon
                      className='flex-shrink-0 w-5 h-5 text-green-500 mr-2'
                      aria-hidden='true'
                    />
                    <p className='text-sm text-gray-600'>
                      In stock and ready to ship
                    </p>
                  </div>
                ) : (
                  <div className='flex items-center mb-6'>
                    <CrossIcon
                      className='flex-shrink-0 w-5 h-5 text-red-500 mr-2'
                      aria-hidden='true'
                    />
                    <p className='text-sm text-gray-600'>Out of stock</p>
                  </div>
                )}

                {product.productStock <= 5 && (
                  <Alert severity='warning' className='mb-6'>
                    Only {product.productStock} left in stock - order soon!
                  </Alert>
                )}

                <div className='flex space-x-4 mb-8'>
                  <motion.button
                    disabled={loading}
                    onClick={handleAddToCart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 bg-indigo-600 duration-300 text-white py-3 px-8 rounded-md font-medium ${
                      loading || added
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-indigo-700'
                    }`}
                  >
                    {loading ? (
                      <LinearProgress color='inherit' />
                    ) : added ? (
                      'Added to Cart'
                    ) : (
                      <>
                        <ShoppingCartIcon className='w-5 h-5 mr-2 inline' />
                        Add to Cart
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='flex-1 bg-gray-200 duration-300 text-gray-700 py-3 px-8 rounded-md font-medium hover:bg-gray-300'
                  >
                    <HeartIcon className='w-5 h-5 mr-2 inline' />
                    Wishlist
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {product.productInformation && (
          <section className='mt-16 flex px-24 py-28 bg-customColorSecondary '>
            <h2 className='sm:text-3xl  lg:text-4xl text-textPrimary font-bold  font-secondary  px-10 text-nowrap'>
              About this Art
            </h2>
            <p className='text-gray-700 font-tertiary text-lg font-medium '>
              {product.productInformation}
            </p>
          </section>
        )}

        {/* Reviews and ratings */}
        <section className='mt-16'>
          <ProductRatings />
        </section>

        {/* Product features */}
        <section className='mt-16'>
          <ProductFeatures features={product} />
        </section>
      </div>

      {/* Image zoom modal */}
      <ImageZoomModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        allImages={allImages}
        selectedImageIndex={selectedImageIndex}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarData.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarData.severity}
          sx={{ width: '100%' }}
          action={
            !isAuthenticated ? (
              <Button
                color='inherit'
                size='small'
                onClick={() =>
                  navigate('/login', {
                    state: { from: `/products/${product._id}` }
                  })
                }
              >
                Login
              </Button>
            ) : null
          }
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default ProductDetails
