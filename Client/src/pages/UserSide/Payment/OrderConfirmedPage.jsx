import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useFetchCart } from '../../../hooks/useFetchCart'
import { CheckIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useDispatch } from 'react-redux'
import { clearValidations } from '../../../redux/slices/authSlice'

function OrderConfirmedPage() {
  useFetchCart()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(clearValidations())
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        when: 'beforeChildren',
        staggerChildren: 0.3
      }
    }
  }

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  const tickVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <motion.div
        className='max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <motion.div variants={childVariants} className='flex justify-center'>
          <div className='rounded-full bg-green-100 p-4'>
            <motion.svg
              className='w-24 h-24 text-green-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <motion.path
                variants={tickVariants}
                initial='hidden'
                animate='visible'
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M5 13l4 4L19 7'
              />
            </motion.svg>
          </div>
        </motion.div>

        <motion.div variants={childVariants} className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Order Confirmed!
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Thank you for your purchase. Your order has been successfully placed
            and is being processed.
          </p>
        </motion.div>

        <motion.div variants={childVariants} className='mt-8'>
          <div className='bg-gray-50 p-4 rounded-md'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              What's Next?
            </h3>
            <ul className='list-disc list-inside text-sm text-gray-600 space-y-1'>
              <li>You'll receive an order confirmation email shortly.</li>
              <li>We'll notify you when your order has been shipped.</li>
              <li>You can track your order status in your account.</li>
            </ul>
          </div>
        </motion.div>

        <motion.div variants={childVariants} className='mt-6'>
          <button
            onClick={() => navigate('/account/order-history')}
            className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out'
          >
            <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
              <ShoppingBagIcon
                className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
                aria-hidden='true'
              />
            </span>
            Take me to my orders
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default OrderConfirmedPage
