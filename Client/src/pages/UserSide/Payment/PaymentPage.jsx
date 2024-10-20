import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Truck, DollarSign } from 'lucide-react'
import apiClient from '../../../services/api/apiClient'
import { setCart } from '../../../redux/slices/Users/Cart/cartSlice'
import { handleRazorPaySuccess } from '../../../services/RazorPay/razorPay'
import { Alert, Snackbar } from '@mui/material'
import ApplyCouponModal from '../../../components/modals/ApplyCouponModal'
import {
  clearValidations,
  validateOrder
} from '../../../redux/slices/Users/Checkout/checkoutSlice'
import Spinner from '../../../components/common/Animations/Spinner'
const paymentMethods = [
  { id: 'Razor Pay', name: 'Razor Pay', icon: CreditCard },
  { id: 'Cash on Delivery', name: 'Cash on Delivery', icon: DollarSign }
]

export default function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethods[0].id
  )
  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { items, subtotal, totalPrice, discount } = useSelector(
    state => state.cart
  )
  const address = useSelector(state => state.address.selectedAddressId)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const shipping = 50
  const tax = subtotal * 0.02

  const orderData = {
    items,
    shippingAddress: address,
    paymentMethod: selectedPaymentMethod,
    shippingCost: shipping,
    discount,
    taxAmount: tax,
    totalAmount: totalPrice,
    subtotal
  }

  const initiateOrder = async () => {
    const endpoint =
      selectedPaymentMethod === 'Razor Pay'
        ? '/api/order/initiate-order/razor-pay'
        : '/api/order/initiate-order'
    const res = await apiClient.post(endpoint, { data: orderData })
    if (!res || res.status !== 200) {
      throw new Error('Order initiation failed')
    }
    return selectedPaymentMethod === 'Razor Pay' ? res.data.orderData : res.data
  }

  const { mutate } = useMutation({
    mutationFn: initiateOrder,
    onMutate: () => setLoading(true),
    onSuccess: async data => {
      setLoading(false)
      try {
        if (selectedPaymentMethod === 'Razor Pay') {
          const result = await handleRazorPaySuccess(data)
          if (result?.success) {
            dispatch(validateOrder())
            navigate('/order-confirmed')
          }
        } else {
          dispatch(validateOrder())
          navigate('/order-confirmed')
        }
      } catch (error) {
        console.error('Error during payment:', error.message)
        setPaymentError(true)
        setErrorMessage(
          error.message.includes('interrupted')
            ? 'Payment was interrupted. Please try again.'
            : 'Payment failed. Please retry or contact support.'
        )
      }
    },
    onError: error => {
      setLoading(false)
      console.log(error?.response?.data?.outOfStock)
      if (error?.response?.data.outOfStock) {
        console.log('out of stock')
        setPaymentError(true)
        setErrorMessage('Some items in the cart are out of stock')
        setSnackbarData({
          message: 'Redirecting to Cart',
          open: true,
          severity: 'error'
        })
        setTimeout(() => {
          navigate('/cart')
          dispatch(clearValidations())
        }, 3000)

        dispatch(setCart(error?.response?.data.cart))
      }
      console.error('Error placing order:', error)
      setPaymentError(true)
      setErrorMessage(
        'Payment failed. Please try again or contact support if the issue persists.'
      )
    }
  })

  const handleSubmit = e => {
    e.preventDefault()
    setPaymentError(false)
    setErrorMessage('')
    mutate()
  }
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return
    setSnackbarData(prev => ({ ...prev, open: false }))
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
          Complete Your Order
        </h1>
        <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
          <div className='p-6 space-y-6'>
            {/* Shipping Address */}
            <div>
              <h2 className='text-xl font-semibold mb-4 flex items-center'>
                <Truck className='w-6 h-6 mr-2 text-customborder-customColorTertiarypop' />
                Shipping Address
              </h2>
              <div className='bg-gray-50 p-4 rounded-md'>
                <p className='font-medium text-gray-800'>{address.name}</p>
                <p className='text-gray-600'>{address.street}</p>
                <p className='text-gray-600'>
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p className='text-gray-600'>{address.country}</p>
              </div>
            </div>
            {/* Payment Method */}
            <div>
              <h2 className='text-xl font-semibold mb-4'>Payment Method</h2>
              <div className='space-y-4'>
                {paymentMethods.map(method => (
                  <label
                    key={method.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedPaymentMethod === method.id
                        ? 'border-customColorTertiarypop bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type='radio'
                      name='paymentMethod'
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => setSelectedPaymentMethod(method.id)}
                      className='form-radio h-5 w-5 text-custombg-customColorTertiary'
                    />
                    <span className='flex items-center text-gray-700 flex-grow'>
                      <method.icon className='h-6 w-6 mr-2 text-gray-500' />
                      {method.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>{' '}
            <div className='w-full'>
              <ApplyCouponModal totalPurchaseAmount={totalPrice} />
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
                <div className='border-t border-gray-200 pt-4 space-y-2'>
                  <div className='flex justify-between items-center'>
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
                </div>
                <div className='border-t border-gray-200 pt-4 flex justify-between items-center'>
                  <span className='text-lg font-semibold'>Total</span>
                  <span className='text-lg font-semibold'>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
            <form onSubmit={handleSubmit}>
              {paymentError ? (
                <div className='w-full py-3 px-4 bg-red-100 text-red-600 border border-red-500 rounded-md mb-4'>
                  <p className='mb-2'>{errorMessage}</p>
                  <button
                    type='button'
                    onClick={handleSubmit}
                    className='w-full py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
                  >
                    Retry Payment
                  </button>
                </div>
              ) : (
                <button
                  type='submit'
                  className='w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-customColorTertiary hover:bg-customColorTertiaryLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customborder-customColorTertiarypop transition-colors'
                  disabled={loading}
                >
                  {loading ? (
                    <span className='flex items-center justify-center'>
                      <Spinner size={-1} />
                      <p className='ml-2'> Processing...</p>
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>
              )}
            </form>
          </div>
        </div>
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
