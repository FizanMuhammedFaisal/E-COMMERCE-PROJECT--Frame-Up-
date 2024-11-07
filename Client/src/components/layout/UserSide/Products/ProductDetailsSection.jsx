'use client'

import { useState } from 'react'
import { Alert } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckIcon,
  XIcon,
  HeartIcon,
  ShoppingCartIcon,
  StarIcon
} from 'lucide-react'
import ChatComponent from './ChatComponent'
import ChatButton from '../../../common/Animations/ChatButton'

function ProductDetailsSection({
  product,
  handleAddToWishlist,
  openModal,
  selectedImageIndex,
  allImages,
  handleThumbnailClick,
  loading,
  handleAddToCart,
  added
}) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const toggleChat = () => setIsChatOpen(!isChatOpen)

  return (
    <section className='py-8 md:py-16 font-primary'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col lg:flex-row items-start gap-8'>
          {/* Image Gallery */}
          <div className='w-full lg:w-1/2'>
            <div
              className='w-full h-64 sm:h-96 relative overflow-hidden cursor-pointer mb-4 rounded-lg '
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
                    className='w-full h-full flex-shrink-0 flex items-center justify-center bg-gray-100'
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className='max-w-full max-h-full object-contain'
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            <div className='mt-4'>
              <h2 className='text-xl font-semibold mb-4'>Product Images</h2>
              <div className='flex space-x-4 overflow-x-auto pb-2 scrollbar-hidden'>
                {allImages.map((image, index) => (
                  <motion.div
                    key={index}
                    className='relative flex-shrink-0'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className='cursor-pointer mb-2'
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <div className='h-16 w-16 sm:h-24 sm:w-24 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden'>
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className='w-full h-full object-cover'
                          loading='lazy'
                        />
                      </div>
                    </div>
                    {selectedImageIndex === index && (
                      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-customColorTertiary'></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className='w-full lg:w-1/2 space-y-6'>
            <h1 className='text-3xl md:text-4xl font-semibold text-customColorTertiaryDark'>
              {product.productName}
            </h1>
            <p className='text-lg sm:text-center text-gray-600'>
              {product.productDescription.split(',').map((description, i) => {
                return <p key={i}>{description}</p>
              })}
            </p>

            <div>
              <h2 className='text-xl font-semibold mb-2'>Categories:</h2>
              <div className='flex flex-wrap gap-2'>
                {product.productCategories.map(category => (
                  <span
                    key={category._id}
                    className='bg-customColorTertiary text-white px-3 py-1 rounded-full text-sm font-medium'
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              {product.discountPrice ? (
                <>
                  <p className='text-2xl md:text-3xl font-bold text-red-600'>
                    ${product.discountPrice.toFixed(2)}
                    <span className='ml-2 text-lg line-through text-gray-500'>
                      ${product.productPrice.toFixed(2)}
                    </span>
                  </p>
                  {product.appliedDiscount && (
                    <p className='text-sm text-green-600 mt-1'>
                      Discount ({product.appliedDiscount.name}) - Ends on{' '}
                      {new Date(product.appliedDiscount.endDate).toLocaleString(
                        undefined,
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }
                      )}
                    </p>
                  )}
                </>
              ) : (
                <p className='text-2xl md:text-3xl font-bold'>
                  ${product.productPrice.toFixed(2)}
                </p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4 text-sm text-gray-700'>
              <div>
                <strong>Year:</strong> {product.productYear}
              </div>
              <div>
                <strong>Dimensions:</strong> {product.dimensions}
              </div>
              <div>
                <strong>Weight:</strong> {product.weight} kg
              </div>
              <div>
                {product.productStock > 0 ? (
                  <div className='flex items-center text-green-500'>
                    <CheckIcon className='w-5 h-5 mr-2' />
                    <span>In stock</span>
                  </div>
                ) : (
                  <div className='flex items-center text-red-500'>
                    <XIcon className='w-5 h-5 mr-2' />
                    <span>Out of stock</span>
                  </div>
                )}
              </div>
            </div>

            {product.productStock <= 5 && product.productStock > 0 && (
              <Alert severity='warning' className='mb-6'>
                Only {product.productStock} left in stock - order soon!
              </Alert>
            )}

            <div className='flex flex-col sm:flex-row gap-4'>
              <motion.button
                disabled={loading || added || product.productStock === 0}
                onClick={handleAddToCart}
                className={`sm:flex-1 bg-customColorTertiary text-white h-12 px-8  rounded-md font-medium ${
                  loading || added || product.productStock === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-customColorTertiaryLight'
                } transition duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCartIcon className='w-5 h-5 mr-2 inline' />

                {loading
                  ? 'Adding...'
                  : added
                    ? 'Added to Cart'
                    : 'Add to Cart'}
              </motion.button>
              <motion.button
                onClick={() => handleAddToWishlist(product._id)}
                className='sm:flex-1 bg-gray-200 text-gray-700 h-12 px-8 rounded-md font-medium hover:bg-gray-300 transition duration-300'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HeartIcon className='w-5 h-5 mr-2 inline' />
                Wishlist
              </motion.button>
            </div>

            <div className='mt-4'>
              <ChatButton toggleChat={toggleChat} />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className='fixed bottom-4 right-4 z-50'
          >
            <ChatComponent toggleChat={toggleChat} id={product._id} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ProductDetailsSection
