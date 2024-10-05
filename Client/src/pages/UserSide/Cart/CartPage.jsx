import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  NotLoggedIn,
  EmptyCart,
  CartItems
} from '../../../components/layout/UserSide/Cart/CartComponents'

import { useCart } from '../../../hooks/useCart'
import { Alert, Button, Snackbar } from '@mui/material'
import apiClient from '../../../services/api/apiClient'
import { setCart } from '../../../redux/slices/Users/Cart/cartSlice'
import { validateChekout } from '../../../redux/slices/authSlice'
validateChekout
const MotionButton = motion.create(Button)

export default function CartPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(state => state.auth)
  const { items, subtotal, totalPrice } = useSelector(state => state.cart)
  const { updateCartQuantity, removeFromCart } = useCart()
  const dispatch = useDispatch()
  const [error, setError] = useState({ productId: null, message: '' })
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const MemoizedCartItems = React.memo(CartItems)
  useEffect(() => {
    validateCart(items)
  }, [items])

  const handleRemoveItem = id => {
    removeFromCart(id)
    setSnackbarData({
      open: true,
      message: 'Item removed from cart',
      severity: 'success'
    })
  }

  const validateCart = items => {
    const outOfStockItems = items.filter(item => item.quantity === 0)
    if (outOfStockItems.length > 0) {
      setSnackbarData({
        open: true,
        message: `${outOfStockItems.length} item(s) out of stock`,
        severity: 'warning'
      })
    }
  }

  const handleCheckout = async () => {
    const outOfStockItems = items.filter(item => item.quantity === 0)
    if (outOfStockItems.length > 0) {
      setSnackbarData({
        open: true,
        message: 'Please remove out of stock items before checkout',
        severity: 'error'
      })
    } else {
      try {
        const res = await apiClient.get('/api/cart')
        console.log(res)
        if (res?.data?.cart) {
          dispatch(setCart(res.data.cart))
        }

        if (res.data.outofstock) {
          return
        }
        dispatch(validateChekout())
        navigate('/checkout')
      } catch (error) {
        console.log(error)
        setSnackbarData({
          open: true,
          message: 'Failed to Operate',
          severity: 'error'
        })
      }
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return
    setSnackbarData(prev => ({ ...prev, open: false }))
  }

  const handleUpdateQuantity = async (id, change) => {
    const result = await updateCartQuantity(id, change)
    if (!result.success) {
      setError({
        productId: id,
        message: result.message || 'No stock available'
      })
      setSnackbarData({
        open: true,
        message: result.message || 'No stock available',
        severity: 'error'
      })
    } else {
      setError({ productId: null, message: '' })
    }
  }

  if (!isAuthenticated) {
    return <NotLoggedIn />
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold mb-10 text-gray-900 text-center'>
          Your Shopping Cart
        </h1>
        <button onClick={() => navigate('/order-confirmed')}>afasf</button>
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <MemoizedCartItems
            items={items}
            handleUpdateQuantity={handleUpdateQuantity}
            handleRemoveItem={handleRemoveItem}
          />
        )}
        {items.length > 0 && (
          <div className='mt-10 bg-white p-8 rounded-lg shadow-lg'>
            <div className='flex justify-between text-xl font-medium text-gray-900 mb-4'>
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className='flex justify-between text-2xl font-bold text-gray-900 mb-8'>
              <p>Total</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
            <motion.button
              className='w-full mb-4 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-customColorTertiary hover:bg-customColorTertiaryLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
            >
              <div className='flex items-center justify-center'>
                <ShoppingBagIcon className='w-5 h-5 mr-2' />
                Proceed to Checkout
              </div>
            </motion.button>
            <MotionButton
              variant='outline'
              className='w-full text-lg h-14'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/all')}
            >
              Continue Shopping
            </MotionButton>
          </div>
        )}
        <Snackbar
          open={snackbarData.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarData.severity}
            className='w-full'
          >
            {snackbarData.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  )
}
