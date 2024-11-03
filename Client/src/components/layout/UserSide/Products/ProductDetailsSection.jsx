import { useState } from 'react'
import { Alert, LinearProgress } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckIcon,
  CrossIcon,
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  XIcon
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
        <div className='flex flex-col lg:flex-row items-start'>
          <div className='w-full lg:w-1/2 mb-8 lg:mb-0'>
            <div
              className='w-full h-64 sm:h-96 relative overflow-hidden cursor-pointer mb-4'
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
                      className='max-w-full max-h-full hover:scale-105 duration-500 object-contain'
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            <div className='mt-4'>
              <h2 className='text-xl font-semibold mb-4'>Product Images</h2>
              <div className='flex space-x-4 overflow-x-auto pb-2'>
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
                      <div className='h-16 w-16 sm:h-24 sm:w-24 flex items-center justify-center'>
                        <img
                          src={image || '/placeholder.svg'}
                          alt={`Thumbnail ${index + 1}`}
                          className='w-full h-full object-cover'
                          loading='lazy'
                        />
                      </div>
                    </motion.div>
                    {selectedImageIndex === index && (
                      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-customColorTertiary'></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='w-full lg:w-3/4 lg:pl-12'>
            <h1 className='text-3xl md:text-4xl mb-3 font-primary tracking-tighter leading-tight font-semibold text-customColorTertiaryDark'>
              {product.productName}
            </h1>
            <p className='text-lg md:text-xl mb-6 text-gray-600'>
              {product.productDescription}
            </p>
            <div className='mb-6'>
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

            <div className='mb-6'>
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
                <p className='ml-2 text-sm text-gray-600'>4.5 out of 5 stars</p>
              </div>
            </div>

            <div className='text-md text-gray-700 mb-4'>
              <strong>Dimensions:</strong> {product.dimensions}
            </div>
            <div className='text-md text-gray-700 mb-6'>
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

            <div className='mt-8'>
              {product.productStock <= 5 && (
                <Alert severity='warning' className='mb-6'>
                  Only {product.productStock} left in stock - order soon!
                </Alert>
              )}

              <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8'>
                <button
                  disabled={loading}
                  onClick={handleAddToCart}
                  className={`sm:flex-1 bg-customColorTertiary duration-300 hover:bg-customColorTertiaryLight whitespace-nowrap text-white h-12 px-8 rounded-md font-medium ${
                    loading || added ? '' : 'hover:bg-customColorTertiaryLight'
                  }`}
                >
                  {loading ? (
                    <LinearProgress color='inherit' />
                  ) : (
                    <>
                      <ShoppingCartIcon className='w-5 h-5 mr-2 inline' />
                      Add to Cart
                    </>
                  )}
                </button>
                <motion.button
                  onClick={() => {
                    handleAddToWishlist(product._id)
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='sm:flex-1 bg-gray-200 duration-300 text-gray-700 h-12 px-8 rounded-md font-medium hover:bg-gray-300'
                >
                  <>
                    {' '}
                    <HeartIcon className='w-5 h-5 mr-2 inline' />
                    Wishlist
                  </>
                </motion.button>
                <div className='sm:flex-1'>
                  <ChatButton toggleChat={toggleChat} />
                </div>
              </div>
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
            <div className='relative'>
              <ChatComponent toggleChat={toggleChat} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ProductDetailsSection
