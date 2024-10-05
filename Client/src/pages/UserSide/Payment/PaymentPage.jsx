import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { BsCash } from 'react-icons/bs'
import { useMutation } from '@tanstack/react-query'
import apiClient from '../../../services/api/apiClient'
import { Alert, CircularProgress, Snackbar } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  clearValidations,
  validateOrder
} from '../../../redux/slices/authSlice'
import { setCart } from '../../../redux/slices/Users/Cart/cartSlice'

const paymentMethods = [
  { id: 'credit_card', name: 'Credit Card', icon: CreditCardIcon },
  { id: 'Cash on Delivery', name: 'Cash on Delivery', icon: BsCash }
]

export default function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethods[0].id
  )
  const [loading, setLoading] = useState(false)
  const { items, subtotal } = useSelector(state => state.cart)
  const address = useSelector(state => state.address.selectedAddressId)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  // Calculate totals
  const shipping = 5.99
  const tax = subtotal * 0.03
  const discount = 10
  const total = subtotal + shipping + tax - discount
  const makeOrder = async () => {
    const data = {
      items,
      shippingAddress: address,
      paymentMethod: selectedPaymentMethod,
      shippingCost: shipping,
      discount,
      taxAmount: tax,
      totalAmount: total,
      subtotal
    }
    const res = await apiClient.post('/api/order/initiate-order', {
      data
    })
    console.log(res)
    if (!res || res.status !== 200) {
      throw new Error('Order initiation failed')
    }

    return res.data
  }
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return
    setSnackbarData(prev => ({ ...prev, open: false }))
  }
  const { mutate } = useMutation({
    mutationFn: makeOrder,
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: async () => {
      setLoading(false)

      dispatch(validateOrder())
      navigate('/order-confirmed')
    },
    onError: error => {
      setLoading(false)

      if (error?.response?.data.outofstock) {
        return dispatch(setCart(error?.response?.data.cart))
      }
      console.error('Error placing order:', error)
      setSnackbarData({
        message:
          'Payment failed. Please try again or contact support if the issue persists.',
        open: true,
        severity: 'error'
      })
      setTimeout(() => {
        dispatch(clearValidations())

        navigate('/cart')
      }, 3000)
    }
  })
  const handleSubmit = e => {
    e.preventDefault()
    setLoading(true)
    mutate()
  }
  useEffect(() => {
    const handleBeforeUnload = e => {
      // Show confirmation dialog
      const confirmationMessage =
        'Are you sure you want to leave? Payment is in progress.'
      e.returnValue = confirmationMessage
      return confirmationMessage
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-3xl font-extrabold text-gray-900 mb-8 text-center'>
          Complete Your Order
        </h1>
        <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
          <div className='p-6 space-y-6'>
            {/* Shipping Address */}
            <div>
              <h2 className='text-xl font-semibold mb-4'>Shipping Address</h2>
              <div className='bg-gray-50 p-4 rounded-md flex items-start'>
                <TruckIcon className='h-6 w-6 text-gray-400 mr-3 flex-shrink-0 mt-1' />
                <div>
                  <p className='font-medium text-gray-800'>{address.name}</p>
                  <p className='text-gray-600'>{address.street}</p>
                  <p className='text-gray-600'>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className='text-gray-600'>{address.country}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className='text-xl font-semibold mb-4'>Payment Method</h2>
              <div className='space-y-4'>
                {paymentMethods.map(method => (
                  <label
                    key={method.id}
                    className='flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer'
                  >
                    <input
                      type='radio'
                      name='paymentMethod'
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => setSelectedPaymentMethod(method.id)}
                      className='form-radio h-5 w-5 text-blue-600'
                    />
                    <span className='flex items-center text-gray-700 flex-grow'>
                      <method.icon className='h-6 w-6 mr-2 text-gray-500' />
                      {method.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
              <div className='space-y-4'>
                {items.map(item => (
                  <div
                    key={item.productId}
                    className='flex justify-between items-center'
                  >
                    <span className='text-gray-600'>
                      {item.productName} (x{item.quantity})
                    </span>
                    <span className='font-medium'>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className='border-t border-gray-200 pt-4 flex justify-between items-center'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-medium'>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='font-medium'>${shipping.toFixed(2)}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Tax</span>
                  <span className='font-medium'>${tax.toFixed(2)}</span>
                </div>
                <div className='flex justify-between items-center text-green-600'>
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <div className='border-t border-gray-200 pt-4 flex justify-between items-center'>
                  <span className='text-lg font-semibold'>Total</span>
                  <span className='text-lg font-semibold'>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
            <form onSubmit={handleSubmit}>
              <button
                type='submit'
                className='w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
              >
                {loading ? <CircularProgress /> : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
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
  )
}
