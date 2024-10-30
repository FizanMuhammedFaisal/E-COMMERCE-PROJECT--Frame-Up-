import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import apiClient from '../../../services/api/apiClient'
import { clearCart } from '../../../redux/slices/Users/Cart/cartSlice'
import { handleRazorPaySuccess } from '../../../services/RazorPay/razorPay'
import { Alert, Snackbar } from '@mui/material'
import PaymentError from '../../../components/layout/UserSide/Payment/PaymentError'
import RetryPayment from '../../../components/layout/UserSide/Payment/RetryPayment'
import NewOrderPayment from '../../../components/layout/UserSide/Payment/NewOrderPayment'
import { validateOrder } from '../../../redux/slices/Users/Checkout/checkoutSlice'

export default function PaymentPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { state } = useLocation()
  const OrderIdFromState = state?.orderId || null
  console.log(OrderIdFromState)
  const [orderId, setOrderId] = useState(OrderIdFromState)
  const [orderDetails, setOrderDetails] = useState(null)
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const handleSuccess = () => {
    dispatch(validateOrder())
    navigate('/order-confirmed')
    dispatch(clearCart())
  }

  const handleRetryPayment = () => {
    setPaymentError(false)
    setErrorMessage('')
    retryPayment()
  }

  const handleGoToOrders = () => {
    navigate('/account/order-history')
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return
    setSnackbarData(prev => ({ ...prev, open: false }))
  }

  const { mutate: retryPayment } = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/api/order/retry-payment', { orderId })
      if (!res || res.status !== 200) {
        throw new Error('Order retry failed')
      }
      return res.data.orderData
    },
    onMutate: () => setLoading(true),
    onSuccess: async data => {
      setLoading(false)
      try {
        const result = await handleRazorPaySuccess(data)
        if (result?.success) {
          handleSuccess()
        }
      } catch (error) {
        console.error('Error during payment:', error.message)
        setPaymentError(true)
        setErrorMessage(
          error.message.includes('interrupted')
            ? 'Payment was interrupted. Please try again.'
            : 'Payment failed. Please retry or check your orders.'
        )
      }
    },
    onError: () => {
      setLoading(false)
      setPaymentError(true)
      setErrorMessage('Payment failed. Please try again or check your orders.')
    }
  })

  useEffect(() => {
    const fetchOrderDetails = async () => {
      console.log(orderId)
      if (orderId) {
        try {
          const res = await apiClient.get(`/api/order/${orderId}`)
          setOrderDetails(res.data.order)
        } catch (error) {
          console.error('Error fetching order details:', error)
          setErrorMessage('Failed to load order details.')
        }
      }
    }
    fetchOrderDetails()
  }, [orderId])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])
  console.log(orderDetails)

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
          {orderDetails ? 'Retry Payment' : 'Complete Your Order'}
        </h1>
        <AnimatePresence mode='wait'>
          {paymentError ? (
            <PaymentError
              key='error'
              errorMessage={errorMessage}
              onRetry={handleRetryPayment}
              onGoToOrders={handleGoToOrders}
            />
          ) : orderDetails ? (
            <RetryPayment
              orderDetails={orderDetails}
              loading={loading}
              onRetryPayment={handleRetryPayment}
            />
          ) : (
            <NewOrderPayment
              setOrderId={setOrderId}
              setLoading={setLoading}
              setPaymentError={setPaymentError}
              setErrorMessage={setErrorMessage}
              setSnackbarData={setSnackbarData}
              handleSuccess={handleSuccess}
            />
          )}
        </AnimatePresence>
      </div>
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
  )
}
