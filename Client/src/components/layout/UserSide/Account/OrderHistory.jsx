import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  AlertCircle,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { validateCoupon } from '../../../../utils/validation/FormValidation'
import {
  validateChekout,
  validatePayment
} from '../../../../redux/slices/Users/Checkout/checkoutSlice'
import apiClient from '../../../../services/api/apiClient'
import OrderModal from '../../../modals/OrderModal'
import AlertDialog from '../../../common/AlertDialog'
import { Transition } from '@headlessui/react'
import { Dialog } from '@mui/material'

export default function OrderHistory() {
  const [orderPage, setOrderPage] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    data: orders,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await apiClient.get('/api/order/')
      console.log(response)
      return response.data.orders
    }
  })

  const onRetryPayment = orderId => {
    dispatch(validateChekout())
    dispatch(validatePayment())
    console.log(orderId)
    navigate('/checkout/payment', { state: { orderId } })
  }

  const handleCancelOrder = id => {
    // Implement cancel order logic here
  }

  if (isLoading) {
    return <div className='text-center py-8'>Loading your order history...</div>
  }

  if (isError) {
    return (
      <div className='text-center py-8 text-red-600'>
        Error loading orders. Please try again later.
      </div>
    )
  }

  return (
    <div className='space-y-6 container mx-auto px-4 py-8'>
      {orderPage !== null ? (
        <OrderDetailsPage
          order={orders[orderPage]}
          setOrderPage={setOrderPage}
          refetch={refetch}
        />
      ) : (
        <>
          <h2 className='text-3xl font-bold text-gray-900 mb-6'>
            Order History
          </h2>
          {orders && orders.length > 0 ? (
            <div className='space-y-4'>
              {orders.map((order, index) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onRetryPayment={onRetryPayment}
                  handleCancelOrder={handleCancelOrder}
                  setOrderPage={() => setOrderPage(index)}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              You haven't placed any orders yet.
            </div>
          )}
        </>
      )}
    </div>
  )
}

function OrderCard({
  order,
  onRetryPayment,
  handleCancelOrder,
  setOrderPage,
  index
}) {
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='bg-white rounded-lg shadow-lg overflow-hidden mb-6 border border-gray-200 transition-all duration-200 hover:shadow-xl'
      onClick={() => setOrderPage(index)}
    >
      <div className='p-6 cursor-pointer'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-xl font-bold text-gray-800 flex items-center'>
            <Package className='mr-2 text-blue-600' />
            Order #{order._id.slice(-6).toUpperCase()}
          </h3>
          <div className='flex space-x-2'>
            <div className='flex flex-col items-end'>
              <span className='text-xs text-gray-500 mb-1'>Order Status</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.orderStatus)}`}
              >
                {order.orderStatus}
              </span>
            </div>
            <div className='flex flex-col items-end'>
              <span className='text-xs text-gray-500 mb-1'>Payment Status</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.paymentStatus)}`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
        <div className='flex justify-between items-center text-sm text-gray-600 mb-4'>
          <p className='flex items-center'>
            <Calendar size={15} className='mr-2' />
            Placed on: {formatDate(order.createdAt)}
          </p>
          <p className='font-semibold text-lg text-blue-600'>
            Total: ${order.totalAmount.toFixed(2)}
          </p>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-2 text-sm text-gray-600'>
            {order.paymentMethod === 'Cash on Delivery' ? (
              <Truck className='h-5 w-5 text-gray-500' />
            ) : (
              <CreditCard className='h-5 w-5 text-gray-500' />
            )}
            <p className='font-medium'>{order.paymentMethod}</p>
          </div>
        </div>
        {order.paymentMethod === 'Razor Pay' &&
          order.paymentStatus === 'Pending' && (
            <div className='mt-4 flex items-center justify-between p-3 bg-yellow-50 rounded-md border border-yellow-200'>
              <div className='flex items-center space-x-2'>
                <AlertCircle className='h-5 w-5 text-yellow-500' />
                <p className='text-sm font-medium text-yellow-700'>
                  Payment failed. Please retry.
                </p>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation()
                  onRetryPayment(order._id)
                }}
                className='px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-colors duration-200'
              >
                Retry Payment
              </button>
            </div>
          )}
      </div>
    </motion.div>
  )
}

function OrderDetailsPage({ order, setOrderPage, refetch }) {
  const [orderId, setOrderId] = useState(null)
  const [cancelIsOpen, setCancelIsOpen] = useState(false)
  const [returnIsOpen, setReturnIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const orderStatuses = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Return Initialized',
    'Return Accepted',
    'Return Rejected'
  ]

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }
  ///cancel
  const handleCancelOrder = id => {
    setCancelIsOpen(true)
    setOrderId(id)
  }
  const handleCancelConfirm = async () => {
    setLoading(true)
    try {
      const res = await apiClient.post('/api/order/cancel', { orderId })
      setSuccessMessage(res.data.message)
      refetch()
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          'An error occurred while cancelling the order'
      )
    } finally {
      setLoading(false)
      setCancelIsOpen(false)
    }
  }
  //return
  const handleReturnOrder = id => {
    setReturnIsOpen(true)
    setOrderId(id)
  }
  const handleReturnConfirm = async reason => {
    console.log(reason)
    setLoading(true)
    try {
      const res = await apiClient.post('/api/return-request/', {
        orderId,
        reason
      })
      setErrorMessage(null)
      setSuccessMessage(res.data.message)
    } catch (error) {
      console.error(error)
      setErrorMessage(
        error?.response?.data?.message ||
          'An error occurred while returning the order'
      )
    }
    setReturnIsOpen(false)
  }
  const getStatusIndex = status => orderStatuses.indexOf(status)
  console.log(returnIsOpen)
  return (
    <div className='px-6 py-8 border-t border-gray-200 bg-gray-50'>
      <div className='mt-6 space-y-6'>
        <div className='flex justify-between items-center mb-8'>
          <button
            onClick={() => setOrderPage(null)}
            className='flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200'
          >
            <ArrowLeft className='mr-2 h-5 w-5' />
            <span className='font-medium'>Back to Order History</span>
          </button>
          <h2 className='text-3xl font-bold text-gray-900'>Order Details</h2>
        </div>

        {successMessage && (
          <div
            className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative'
            role='alert'
          >
            <span className='block sm:inline'>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div
            className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
            role='alert'
          >
            <span className='block sm:inline'>{errorMessage}</span>
          </div>
        )}

        <div className={`p-4 rounded-lg ${getStatusColor(order.orderStatus)}`}>
          <h3 className='text-lg font-semibold mb-2'>
            Order Status: {order.orderStatus}
          </h3>
        </div>

        <div className='bg-white shadow rounded-lg p-6 mb-6'>
          <h4 className='font-semibold text-gray-800 mb-4 text-lg'>Items</h4>
          <ul className='space-y-4'>
            {order.items.map((item, index) => (
              <li
                key={index}
                className='flex justify-between items-center text-sm bg-gray-50 p-4 rounded-lg'
              >
                <div className='flex items-center space-x-4'>
                  {item.thumbnailImage && item.thumbnailImage.length > 0 && (
                    <img
                      src={item.thumbnailImage[0]}
                      alt={item.productName}
                      className='w-16 h-16 object-cover rounded-md'
                    />
                  )}
                  <div>
                    <span className='font-medium text-gray-800'>
                      {item.productName}
                    </span>
                    <p className='text-gray-600'>Quantity: {item.quantity}</p>
                  </div>
                </div>
                <span className='font-semibold text-lg'>
                  ${item.price.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className='bg-white shadow rounded-lg p-6 mb-6'>
          <h4 className='font-semibold text-gray-800 mb-4 text-lg'>
            Order Summary
          </h4>
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between border-b pb-2'>
              <span className='text-gray-600'>Subtotal:</span>
              <span className='font-medium'>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className='flex justify-between border-b pb-2'>
              <span className='text-gray-600'>Shipping:</span>
              <span className='font-medium'>
                ${order.shippingCost.toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between border-b pb-2'>
              <span className='text-gray-600'>Tax:</span>
              <span className='font-medium'>${order.taxAmount.toFixed(2)}</span>
            </div>
            <div className='flex justify-between text-green-600 border-b pb-2'>
              <span>Discount:</span>
              <span className='font-medium'>-${order.discount.toFixed(2)}</span>
            </div>
            <div className='flex justify-between font-semibold text-lg text-gray-800 pt-2'>
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className='bg-white shadow rounded-lg p-6 mb-6'>
          <h4 className='font-semibold text-gray-800 mb-4 text-lg'>
            Shipping Address
          </h4>
          <address className='text-sm not-italic'>
            <strong className='text-gray-800 block mb-1'>
              {order.shippingAddress.name}
            </strong>
            {order.shippingAddress.address}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.postalCode}
            <br />
            <span className='text-gray-600'>Phone:</span>{' '}
            {order.shippingAddress.phoneNumber}
          </address>
        </div>

        {getStatusIndex(order.orderStatus) <= 1 && (
          <div className='mt-6'>
            <button
              onClick={() => handleCancelOrder(order._id)}
              className='w-full p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
            >
              Cancel Order
            </button>
          </div>
        )}
        {order.orderStatus === 'Delivered' ? (
          successMessage ? (
            ''
          ) : (
            <div className='mt-6'>
              <button
                onClick={() => handleReturnOrder(order._id)}
                className='w-full p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
              >
                Return Order
              </button>
            </div>
          )
        ) : (
          ''
        )}
        {order.orderStatus === 'Cancelled' && (
          <div className='mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
            This order has been cancelled
          </div>
        )}
      </div>

      {cancelIsOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg max-w-md w-full'>
            <h3 className='text-lg font-medium leading-6 text-gray-900 mb-4'>
              Cancel Order
            </h3>
            <p className='text-sm text-gray-500 mb-4'>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
            <div className='flex justify-end space-x-3'>
              <button
                onClick={() => setCancelIsOpen(false)}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
              >
                Cancel
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={loading}
                className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50'
              >
                {loading ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
      <OrderModal
        isOpen={returnIsOpen}
        onConfirm={handleReturnConfirm}
        onClose={() => {
          setReturnIsOpen(false)
        }}
      />
    </div>
  )
}
