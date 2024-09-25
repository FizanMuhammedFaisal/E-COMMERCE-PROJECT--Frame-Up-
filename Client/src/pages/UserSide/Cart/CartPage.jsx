import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  XMarkIcon,
  ShoppingCartIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import { IoMdLock } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function CartPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(state => state.auth)
  const { data } = useSelector(state => state.cart)
  const [random, setRandom] = useState(null)
  const shipping = 10

  useEffect(() => {
    const randomColor = () => {
      const number = Math.floor(Math.random() * 10) + 1
      setRandom(number)
    }
    randomColor()
  }, [])

  const redirectToLogin = () => {
    navigate('/login', { state: { from: '/cart' } })
  }

  const handleRemoveItem = id => {
    console.log(`Removing item with ID: ${id}`)
  }

  const subtotal = data.reduce((acc, item) => acc + item.price, 0)
  const total = subtotal + shipping

  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen custom-background${random} py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center`}
      >
        <motion.div
          className='max-w-md text-center bg-white bg-opacity-20 p-8 rounded-lg shadow-xl backdrop-filter backdrop-blur-md'
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        >
          <motion.div
            layout
            className='mb-6'
            animate={{
              scale: [1, 1.4, 1],
              rotate: [0, 15, -15, 0],
              translateY: [0, -20, 10, -5, 0],
              opacity: [1]
            }}
            transition={{
              duration: 2.3,
              ease: 'easeInOut',
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 1
            }}
            whileHover={{
              scale: [1, 1.2, 1],
              transition: {
                duration: 0.2,
                repeat: 4,
                ease: 'easeInOut'
              }
            }}
          >
            <IoMdLock className='h-16 w-16 text-textPrimary mx-auto' />
          </motion.div>

          <h2 className='text-2xl font-semibold text-slate-950 mb-4'>
            You need to log in to access the cart
          </h2>
          <motion.button
            onClick={redirectToLogin}
            className='bg-customColorTertiary text-white py-3 px-6 rounded-md font-medium hover:bg-opacity-85 transition duration-300 ease-in-out'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log in to Continue
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <motion.h1
          className='text-3xl font-light mb-8 text-gray-900'
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Shopping Cart
        </motion.h1>
        <div className='space-y-8'>
          {data.length === 0 ? (
            <div className='text-center bg-white p-8 rounded-lg shadow-md'>
              <ShoppingCartIcon className='h-16 w-16 text-gray-400 mx-auto mb-4' />
              <p className='text-gray-500 mb-4'>Your cart is empty.</p>
              <motion.button
                onClick={() => navigate('/products')}
                className='bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition duration-150 ease-in-out'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Shopping
              </motion.button>
            </div>
          ) : (
            data.map(item => (
              <motion.div
                key={item.id}
                className='flex items-center justify-between border-b border-gray-200 pb-4 bg-white p-4 rounded-lg shadow-sm'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className='flex items-center'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='w-16 h-16 object-cover rounded-md mr-4'
                    loading='lazy'
                  />
                  <div>
                    <h2 className='text-lg font-medium text-gray-900'>
                      {item.name}
                    </h2>
                    <p className='text-gray-500'>${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleRemoveItem(item.id)}
                  className='text-gray-400 hover:text-gray-500 transition duration-150 ease-in-out'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className='h-5 w-5' />
                </motion.button>
              </motion.div>
            ))
          )}
        </div>
        {data.length > 0 && (
          <motion.div
            className='mt-10 bg-white p-6 rounded-lg shadow-md'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className='flex justify-between text-base font-medium text-gray-900 mb-3'>
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className='flex justify-between text-base font-medium text-gray-900 mb-3'>
              <p>Shipping</p>
              <p>${shipping.toFixed(2)}</p>
            </div>
            <div className='flex justify-between text-lg font-semibold text-gray-900 mb-6'>
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
            <motion.button
              className='w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition duration-150 ease-in-out'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Checkout
            </motion.button>
            <motion.button
              className='w-full mt-4 bg-white text-indigo-600 py-3 px-4 rounded-md font-medium border border-indigo-600 hover:bg-indigo-50 transition duration-150 ease-in-out'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
