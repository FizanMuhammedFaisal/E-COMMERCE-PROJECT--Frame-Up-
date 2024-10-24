import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
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
import { validateChekout } from '../../../redux/slices/Users/Checkout/checkoutSlice'
import { useFetchCart } from '../../../hooks/useFetchCart'

const MotionButton = motion.create(Button)

export default function CartPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(state => state.auth)
  const { items, subtotal, totalPrice, totalDiscount } = useSelector(
    state => state.cart
  )
  const { updateCartQuantity, removeFromCart } = useCart()
  const [error, setError] = useState({ productId: null, message: '' })
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  useFetchCart()
  useEffect(() => {
    validateCart(items)
  }, [items])

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

  const handleRemoveItem = id => {
    removeFromCart(id)
    setSnackbarData({
      open: true,
      message: 'Item removed from cart',
      severity: 'success'
    })
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
        if (res?.data?.cart) {
          dispatch(setCart(res.data.cart))
        }
        if (res.data.outofstock) {
          return
        }
        dispatch(validateChekout())
        navigate('/checkout')
      } catch (error) {
        console.error(error)
        setSnackbarData({
          open: true,
          message: 'Failed to proceed to checkout',
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

  const MemoizedCartItems = useMemo(() => React.memo(CartItems), [])

  if (!isAuthenticated) {
    return <NotLoggedIn />
  }

  return (
    <div className='min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-primary'>
      <div className='max-w-4xl mx-auto'>
        <header className='mb-8 flex items-center justify-between'>
          <h1 className='text-3xl sm:text-4xl font-semibold text-customColorTertiaryDark'>
            Shopping Cart
          </h1>
          <MotionButton
            variant='text'
            startIcon={<ArrowLeftIcon className='w-5 h-5' />}
            onClick={() => navigate('/all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue Shopping
          </MotionButton>
        </header>

        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyCart />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MemoizedCartItems
                items={items}
                handleUpdateQuantity={handleUpdateQuantity}
                handleRemoveItem={handleRemoveItem}
              />

              <div className='mt-8 bg-white p-6 rounded-lg shadow-sm'>
                <div className='flex justify-between text-lg font-medium text-gray-900 mb-4'>
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className='flex justify-between text-lg font-medium text-gray-900 mb-4'>
                  <p>Total Discount</p>
                  <p>${totalDiscount.toFixed(2)}</p>
                </div>
                <div className='flex justify-between text-xl font-bold text-gray-900 mb-6'>
                  <p>Total</p>
                  <p>${totalPrice.toFixed(2)}</p>
                </div>
                <motion.button
                  className='w-full mb-4 py-3 px-4 border border-transparent rounded-md text-base font-medium text-white bg-customColorTertiary hover:bg-customColorTertiaryLight focus:outline-none  transition-colors duration-200'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                >
                  <div className='flex items-center justify-center'>
                    <ShoppingBagIcon className='w-5 h-5 mr-2' />
                    Proceed to Checkout
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Snackbar
          open={snackbarData.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarData.severity}
            variant='filled'
            className='w-full'
          >
            {snackbarData.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  )
}
