import { useEffect, useState } from 'react'
import { Alert } from '@mui/material'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import {
  CheckIcon,
  XIcon,
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  Heart
} from 'lucide-react'
import ChatComponent from './ChatComponent'
import ChatButton from '../../../common/Animations/ChatButton'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import {
  addToWishlist,
  removeFromWishlist
} from '../../../../redux/slices/Users/Wishlist/wishlistSlice'

function ProductDetailsSection({
  product,
  handleAddToWishlist,
  openModal,
  selectedImageIndex,
  allImages,
  handleThumbnailClick,
  loading,
  handleAddToCart,
  added,
  handleRemoveFromWishlist
}) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const wishlistItems = useSelector(state => state.wishlist.items)
  const isInWishlist = wishlistItems.includes(product._id)
  const toggleChat = () => setIsChatOpen(!isChatOpen)
  const { isAuthenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      return toast.error('Login to Add To Wislist')
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id))
      handleRemoveFromWishlist(product._id)
    } else {
      dispatch(addToWishlist(product._id))
      handleAddToWishlist(product._id)
    }
    heartAnimation.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 }
    })
    bgAnimation.start({
      backgroundColor: isInWishlist ? '#f3f4f6' : '#fee2e2',
      transition: { duration: 0.3 }
    })
  }
  const heartAnimation = useAnimation()
  const bgAnimation = useAnimation()
  useEffect(() => {
    if (isInWishlist) {
      const interval = setInterval(() => {
        heartAnimation.start({
          scale: [1, 1.1, 1],
          transition: { duration: 1, ease: 'easeInOut' }
        })
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isInWishlist, heartAnimation])
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
              <div className='flex space-x-4 px-3 overflow-x-auto pb-2 scrollbar-hidden'>
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
            <div className='text-lg sm:text-center text-gray-600'>
              {product.productDescription.split(',').map((description, i) => {
                return <div key={i}>{description}</div>
              })}
            </div>

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
              {product.discountPrice &&
              product.discountPrice !== product.productPrice ? (
                <>
                  <div className='text-2xl md:text-3xl font-bold text-red-600'>
                    ₹{product.discountPrice.toFixed(2)}
                    <span className='ml-2 text-lg line-through text-gray-500'>
                      ₹{product.productPrice.toFixed(2)}
                    </span>
                  </div>
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
                  ₹{product.productPrice.toFixed(2)}
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
                className={`sm:flex-1 bg-customColorTertiary cursor-pointer text-white h-12 px-8  rounded-md font-medium ${
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
                onClick={handleWishlistClick}
                className='relative sm:flex-1 flex items-center justify-center h-12 px-8  rounded-md font-medium text-gray-700 transition duration-300 overflow-hidden'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={bgAnimation}
                initial={{ backgroundColor: '#f3f4f6' }}
              >
                <motion.div animate={heartAnimation}>
                  <Heart
                    className={`w-6 h-6 mr-2 transition-colors duration-300 ${
                      isInWishlist
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                </motion.div>
                <span className='relative z-10'>
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </span>
                {isInWishlist && (
                  <motion.div
                    className='absolute inset-0 bg-red-100 opacity-20'
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
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
            className='fixed bottom-4 sm:right-4 z-50'
          >
            <ChatComponent toggleChat={toggleChat} id={product._id} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ProductDetailsSection
