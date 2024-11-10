import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Truck, DollarSign, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import apiClient from '../../../../services/api/apiClient'
import Spinner from '../../../common/Animations/Spinner'
import { handleRazorPaySuccess } from '../../../../services/RazorPay/razorPay'
import ApplyCouponModal from '../../../modals/ApplyCouponModal'
import { setCart } from '../../../../redux/slices/Users/Cart/cartSlice'
import { clearValidations } from '../../../../redux/slices/Users/Checkout/checkoutSlice'

const paymentMethods = [
  { id: 'Razor Pay', name: 'Razor Pay', icon: CreditCard },
  { id: 'Cash on Delivery', name: 'Cash on Delivery', icon: DollarSign },
  { id: 'Wallet', name: 'Wallet', icon: Wallet }
]

export default function NewOrderPayment({
  setOrderId,
  setLoading,
  setPaymentError,
  setErrorMessage,
  setSnackbarData,
  handleSuccess
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [appliedCouponCode, setAppliedCouponCode] = useState(null)
  const address = useSelector(state => state.address.selectedAddressId)
  const [walletError, setWalletError] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethods[0].id
  )
  const { items, subtotal, totalPrice, discount, appliedCoupon } = useSelector(
    state => state.cart
  )

  const totalDiscount = Math.floor(discount + appliedCoupon)
  const shipping = 50
  const tax = Math.floor(subtotal * 0.02)
  const TotalAfterTax = Math.floor(totalPrice + shipping + tax - appliedCoupon)

  const orderData = {
    items,
    shippingAddress: address,
    paymentMethod: selectedPaymentMethod,
    shippingCost: shipping,
    taxAmount: tax,
    appliedCouponCode
  }
  ////////
  ////////
  ////////
  ///mutation
  const { mutate: placeOrder } = useMutation({
    mutationFn: async () => {
      const endpoint =
        selectedPaymentMethod === 'Razor Pay'
          ? '/api/order/initiate-order/razor-pay'
          : '/api/order/initiate-order'
      const res = await apiClient.post(endpoint, { data: orderData })
      if (!res || res.status !== 200) {
        throw new Error('Order initiation failed')
      }
      return selectedPaymentMethod === 'Razor Pay'
        ? res.data.orderData
        : res.data
    },
    onMutate: () => setLoading(true),
    onSuccess: async data => {
      setLoading(false)
      setOrderId(data.orderId)
      try {
        if (selectedPaymentMethod === 'Razor Pay') {
          const result = await handleRazorPaySuccess(data)
          if (result?.success) {
            handleSuccess()
          }
        } else {
          handleSuccess()
        }
      } catch (error) {
        if (selectedPaymentMethod === 'Razor Pay') {
          console.error('Error during payment:', error.message)
          setPaymentError(true)
          setErrorMessage(
            error.message.includes('interrupted')
              ? 'Payment was interrupted. Please try again.'
              : 'Payment failed. Please retry or check your orders.'
          )
        } else if (selectedPaymentMethod === 'Wallet') {
          setWalletError('Payment failed. Please retry or check your orders.')
        }
      }
    },
    onError: error => {
      setLoading(false)
      if (error?.response?.data.outOfStock) {
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
      } else {
        if (selectedPaymentMethod === 'Wallet') {
          console.log(error)
          if (
            error?.response?.data?.message.includes(
              'Not enough Balance in Wallet.'
            )
          ) {
            return setWalletError('Not enough Balance in Wallet.')
          } else {
            console.error('Error placing order:', error)
            setPaymentError(true)
            setErrorMessage(
              'Payment failed. Please try again or check your orders.'
            )
          }
        }
        console.error('Error placing order:', error)
        setPaymentError(true)
        setErrorMessage(
          'Payment failed. Please try again or check your orders.'
        )
      }
    }
  })
  const handleSubmit = e => {
    e.preventDefault()

    setPaymentError(false)
    setErrorMessage('')

    if (selectedPaymentMethod === 'Wallet') {
      if (data >= TotalAfterTax) {
        placeOrder()
      } else {
        return setWalletError('Not enough balance to make order')
      }
    } else {
      placeOrder()
    }
  }

  //for fetching wallet balance
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      const res = await apiClient.get('api/wallet/')
      console.log(res.data.wallet.balance)
      console.log(res.data.wallet.balance)
      console.log(res.data.wallet.balance)
      return res.data.wallet.balance
    },
    queryKey: ['walletBalance']
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='bg-white shadow-lg rounded-lg overflow-hidden'
    >
      <div className='p-6 space-y-6'>
        <div>
          <h2 className='text-xl font-semibold mb-4 flex items-center'>
            <Truck className='w-6 h-6 mr-2 text-customborder-customColorTertiarypop' />
            Shipping Address
          </h2>
          <div className='bg-gray-50 p-4 rounded-md'>
            <p className='font-medium text-gray-800'>{address?.name}</p>
            <p className='text-gray-600'>{address?.street}</p>
            <p className='text-gray-600'>
              {address?.city}, {address?.state} {address?.zipCode}
            </p>
            <p className='text-gray-600'>{address?.country}</p>
          </div>
        </div>
        <div>
          {/* ///hasdnflit here */}
          <h2 className='text-xl font-semibold mb-4'>Payment Method</h2>
          <div className='space-y-4'>
            {paymentMethods
              .slice(0, 2)
              .filter(
                method =>
                  !(method.id === 'Cash on Delivery' && TotalAfterTax > 1000)
              )
              .map(method => (
                <div key={method.id}>
                  <label
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
                </div>
              ))}

            <label
              key={paymentMethods[2].id}
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                selectedPaymentMethod === paymentMethods[2].id
                  ? 'border-customColorTertiarypop bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type='radio'
                name='paymentMethod'
                value={paymentMethods[2].id}
                checked={selectedPaymentMethod === paymentMethods[2].id}
                onChange={() => setSelectedPaymentMethod(paymentMethods[2].id)}
                className='form-radio h-5 w-5 text-custombg-customColorTertiary'
              />
              <span className=' text-gray-700 flex-grow'>
                <div className='flex justify-between'>
                  <div className='flex'>
                    <Wallet className='h-6 w-6 mr-2 text-gray-500' />
                    {paymentMethods[2].name}
                  </div>
                  <div>
                    {isLoading ? (
                      <Spinner size={-1} speed={2} />
                    ) : (
                      <p className='text-blue-900'> Balance Amount : ₹{data}</p>
                    )}
                  </div>
                </div>
              </span>
            </label>
          </div>
        </div>
        <div className='w-full'>
          <ApplyCouponModal
            totalPurchaseAmount={totalPrice}
            setAppliedCouponCode={setAppliedCouponCode}
          />
        </div>
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
                  ₹{(item.productPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className='border-t border-gray-200 pt-4 space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Subtotal</span>
                <span className='font-medium'>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Shipping</span>
                <span className='font-medium'>₹{shipping.toFixed(2)}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Tax</span>
                <span className='font-medium'>₹{tax.toFixed(2)}</span>
              </div>
              <div className='flex justify-between items-center text-green-600'>
                <span>Total Discount</span>
                <span>-₹{totalDiscount.toFixed(2)}</span>
              </div>
            </div>
            <div className='border-t border-gray-200 pt-4 flex justify-between items-center'>
              <span className='text-lg font-semibold'>Total</span>
              <span className='text-lg font-semibold'>
                ₹{TotalAfterTax.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='px-6 py-4 bg-gray-50  border-t border-gray-200'>
        {walletError ? (
          <div className='px-4 py-3 rounded-md text-white  bg-red-500'>
            {walletError}
          </div>
        ) : (
          ''
        )}
        <form onSubmit={handleSubmit}>
          <button
            type='submit'
            className='w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-customColorTertiary hover:bg-customColorTertiaryLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customborder-customColorTertiarypop transition-colors'
          >
            Place Order
          </button>
        </form>
      </div>
    </motion.div>
  )
}
