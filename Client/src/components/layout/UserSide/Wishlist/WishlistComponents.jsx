import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../../../services/api/apiClient'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useCart } from '../../../../hooks/useCart'
import { useSelector } from 'react-redux'

const EmptyWishlist = () => {
  return (
    <motion.div
      key='empty'
      className='text-center py-16'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          duration: 0.8
        }}
      >
        <Heart className='mx-auto text-gray-300' size={64} />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className='mt-4 text-xl font-medium text-gray-900'>
          Your wishlist is empty
        </h2>
        <p className='mt-2 text-gray-500'>Start adding items you love!</p>
        <motion.button
          className='mt-6 px-6 py-3 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors duration-300'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Art
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

const WishlistCard = ({ item, removeItem, handleAddToCard }) => {
  console.log(item)
  return (
    <div className='relative flex flex-col justify-between w-full h-96 bg-white rounded-lg overflow-hidden'>
      <div className='relative h-48 w-full overflow-hidden'>
        <img
          src={item.thumbnailImage[0]}
          alt={item.productName}
          className='w-full h-full object-cover object-center'
        />
        {item.productStock === 0 && (
          <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <span className='text-white font-semibold'>Out of Stock</span>
          </div>
        )}
      </div>
      <div className='p-4 flex-grow'>
        <h2 className='text-lg font-semibold text-gray-900 mb-1 truncate'>
          {item.productName}
        </h2>
        <p className='text-sm text-gray-500 mb-2'>Year: {item.productYear}</p>
        <p className='text-lg font-medium text-gray-900'>
          $
          {item.discountPrice
            ? item.discountPrice.toFixed(2)
            : item.productPrice.toFixed(2)}
        </p>
        {item.discountPrice && (
          <p className='text-sm text-gray-500 line-through'>
            ${item.productPrice.toFixed(2)}
          </p>
        )}
      </div>
      <button
        onClick={() => removeItem(item._id)}
        className='absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-70 text-gray-600 hover:text-red-500 transition-colors duration-300'
        aria-label='Remove from wishlist'
      >
        <Trash2 size={18} />
      </button>
      <button
        onClick={() => {
          handleAddToCard(item._id, item.productPrice)
        }}
        className='w-full py-3 bg-white text-customColorTertiary hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center'
        disabled={item.productStock === 0}
      >
        <ShoppingCart size={18} className='mr-2' />
        {item.productStock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  )
}
const WishlistGrid = ({ wishlistItems, setSnackbarData, setWishlistItems }) => {
  console.log(wishlistItems)
  const { addToCart } = useCart()
  const { isAuthenticated } = useSelector(state => state.auth)

  //removing item from wishlist
  const removeItem = async productId => {
    try {
      const res = await apiClient.post('/api/wishlist/remove', { productId })
      console.log(res?.data?.wishlist)
      setWishlistItems(res?.data?.wishlist?.items)
      setSnackbarData({
        open: true,
        message: 'Product removed From cart!',
        severity: 'success'
      })
    } catch (error) {
      console.log(error)
      setSnackbarData({
        open: true,
        message: error,
        severity: 'error'
      })
    }
  }

  const handleAddToCard = async (id, price) => {
    if (!isAuthenticated) {
      return setSnackbarData({
        open: true,
        message: 'Login to add items to your cart',
        severity: 'error'
      })
    }
    const result = await addToCart(id, price, 1)
    if (result.success) {
      // setAdded(true)
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
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
      {wishlistItems.map(item => (
        <WishlistCard
          key={item.id}
          item={item}
          removeItem={removeItem}
          handleAddToCard={handleAddToCard}
        />
      ))}
    </div>
  )
}

const NotLoggedInWishlist = () => {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center'
      >
        <Heart className='mx-auto text-gray-400 mb-4' size={64} />
        <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
          Sign in to view your Wishlist
        </h2>
        <p className='text-gray-600 mb-6'>
          Create an account or log in to save your favorite items.
        </p>
        <motion.button
          onClick={() => {
            navigate('/login', { state: { from: '/wishlist' } })
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='px-6 py-3 bg-customColorTertiary text-white rounded-full text-sm hover:bg-customColorTertiaryLight transition-colors duration-300'
        >
          Sign In
        </motion.button>
      </motion.div>
    </div>
  )
}

export { EmptyWishlist, WishlistGrid, NotLoggedInWishlist }
