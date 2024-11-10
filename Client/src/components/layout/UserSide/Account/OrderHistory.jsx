import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  AlertCircle,
  Wallet
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  validateChekout,
  validatePayment
} from '../../../../redux/slices/Users/Checkout/checkoutSlice'
import apiClient from '../../../../services/api/apiClient'
import Pagination from '../../../common/Pagination'

export default function OrderHistory() {
  const [orderPage, setOrderPage] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fetchData = async () => {
    const res = await apiClient.get(`/api/order/?page=${page}`)
    if (res?.data?.totalPages) {
      setTotalPages(res.data.totalPages)
    }
    return res.data.orders
  }
  const {
    data: orders,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['orders', { page }],
    queryFn: fetchData
  })
  const handlePageChange = newPage => {
    if (newPage > 0) {
      setPage(newPage)
    }
  }
  const onRetryPayment = orderId => {
    dispatch(validateChekout())
    dispatch(validatePayment())
    console.log(orderId)
    navigate('/checkout/payment', { state: { orderId } })
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
      <>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>Order History</h2>
        {orders && orders.length > 0 ? (
          <div className='space-y-4'>
            {orders.map((order, index) => (
              <OrderCard
                key={order._id}
                order={order}
                onRetryPayment={onRetryPayment}
                setOrderPage={() => {
                  navigate(`/account/order-history/${order._id}`)
                }}
                index={index}
              />
            ))}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className='text-center py-8 text-gray-500'>
            You haven't placed any orders yet.
          </div>
        )}
      </>
    </div>
  )
}

function OrderCard({ order, onRetryPayment, setOrderPage, index }) {
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
                className={`px-3 py-1 rounded-full text-xs font-semibold border ₹{getStatusColor(order.orderStatus)}`}
              >
                {order.orderStatus}
              </span>
            </div>
            <div className='flex flex-col items-end'>
              <span className='text-xs text-gray-500 mb-1'>Payment Status</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ₹{getStatusColor(order.paymentStatus)}`}
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
            Total: ₹{order.totalAmount.toFixed(2)}
          </p>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-2 text-sm text-gray-600'>
            {order.paymentMethod === 'Cash on Delivery' ? (
              <Truck className='h-5 w-5 text-gray-500' />
            ) : order.paymentMethod === 'Wallet' ? (
              <Wallet className='h-5 w-5 text-gray-500' />
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
