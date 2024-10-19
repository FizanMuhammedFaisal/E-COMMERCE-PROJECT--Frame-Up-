import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useFetchCart } from '../../../hooks/useFetchCart'
import {
  CheckIcon,
  ShoppingBagIcon,
  TruckIcon,
  EnvelopeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { useDispatch } from 'react-redux'
import { clearValidations } from '../../../redux/slices/Users/Checkout/checkoutSlice'

function OrderConfirmedPage() {
  useFetchCart()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    dispatch(clearValidations())
    // Generate a random order number for demonstration
    setOrderNumber(
      `ORD-${Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0')}`
    )
  }, [dispatch])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
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
      transition: { duration: 0.5, ease: 'easeOut' }
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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: 'reverse'
      }
    }
  }

  const nextSteps = [
    {
      icon: EnvelopeIcon,
      text: "You'll receive an order confirmation email shortly."
    },
    {
      icon: TruckIcon,
      text: "We'll notify you when your order has been shipped."
    },
    {
      icon: ShoppingBagIcon,
      text: 'You can track your order status in your account.'
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-b from-customColorSecondary to-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <motion.div
        className='max-w-md w-full space-y-8 bg-white p-10 rounded-xl '
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <motion.div variants={childVariants} className='flex justify-center'>
          <motion.div
            className='rounded-full bg-green-100 p-4'
            variants={pulseVariants}
            animate='pulse'
          >
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
          </motion.div>
        </motion.div>

        <motion.div variants={childVariants} className='text-center'>
          <h1 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Order Confirmed!
          </h1>
          <p className='mt-2 text-sm text-gray-600'>
            Thank you for your purchase. Your order has been successfully placed
            and is being processed.
          </p>
          <motion.p
            className='mt-4 text-lg font-semibold text-customColorTertiary'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Order Number: {orderNumber}
          </motion.p>
        </motion.div>

        <motion.div variants={childVariants} className='mt-8'>
          <div className='bg-gray-50 p-6 rounded-md'>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>
              What's Next?
            </h2>
            <ul className='space-y-4'>
              <AnimatePresence>
                {nextSteps.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.2 }}
                    className='flex items-center space-x-3 text-sm text-gray-600'
                  >
                    <item.icon className='h-5 w-5 text-customColorTertiary' />
                    <span>{item.text}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </motion.div>

        <motion.div variants={childVariants} className='mt-6 space-y-4'>
          <motion.button
            onClick={() => navigate('/account/order-history')}
            className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-customColorTertiary hover:bg-customColorTertiaryLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out'
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBagIcon className='h-5 w-5 mr-2' />
            View My Orders
          </motion.button>

          <motion.button
            onClick={() => navigate('/all')}
            className='group relative w-full flex justify-center py-3 px-4 border border-customColorTertiary text-sm font-medium rounded-md text-customColorTertiary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customColorTertiary transition duration-150 ease-in-out'
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowPathIcon className='h-5 w-5 mr-2' />
            Continue Shopping
          </motion.button>
        </motion.div>

        <motion.div
          variants={childVariants}
          className='mt-4 text-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className='text-sm text-gray-500'>
            Need help?{' '}
            <a
              href='/contact'
              className='text-customColorTertiary hover:text-customColorTertiaryLight'
            >
              Contact our support team
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default OrderConfirmedPage
