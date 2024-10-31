'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ChevronDown, Package, Truck, CheckCircle, X } from 'lucide-react'
import apiClient from '../../../services/api/apiClient'
import AlertDialog from '../../../components/common/AlertDialog'

const orderStatuses = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
  // 'Return Initialized',
  // 'Return Accepted',
  // 'Return Rejected'
]

export default function OrderEditPage() {
  const { orderId } = useParams()
  const [isExpanded, setIsExpanded] = useState(false)
  const [order, setOrder] = useState({})
  const [currentStatus, setCurrentStatus] = useState('')
  const [statusLoading, setStatusLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [error, setError] = useState(null)

  const fetchOrder = async orderId => {
    const res = await apiClient.get(`/api/order/${orderId}`)
    return res.data
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrder(orderId)
  })

  useEffect(() => {
    if (data?.order) {
      setOrder(data.order)
      setCurrentStatus(data.order.orderStatus)
    }
  }, [data])

  const getStatusIndex = status => orderStatuses.indexOf(status)

  const handleReturnRequest = async (orderId, newStatus) => {
    try {
      const res = await apiClient.post('/api/return-request/update', {
        orderId,
        newStatus
      })
      await refetch()
      console.log(res.data)
    } catch (error) {
      console.error(error)
      setError(error?.response?.data?.message)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    setNewStatus(newStatus)
    setIsStatusChangeOpen(true)
  }

  const confirmStatusUpdate = async () => {
    setStatusLoading(true)
    try {
      await apiClient.put(`/api/order/update-status`, {
        newStatus,
        orderId
      })
      setCurrentStatus(newStatus)
      await refetch()
      setIsStatusChangeOpen(false)
      console.log(`Order status updated to: ${newStatus}`)
    } catch (error) {
      console.error('Failed to update order status:', error)
      setError('Failed to update order status. Please try again.')
    } finally {
      setStatusLoading(false)
    }
  }

  const handleCancelOrder = async id => {
    setIsOpen(true)
  }

  const onConfirm = async () => {
    setStatusLoading(true)
    try {
      await apiClient.put(`/api/order/cancel/${orderId}/admin`)
      setCurrentStatus('Cancelled')
      await refetch()
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to cancel order:', error)
      setError('Failed to cancel order. Please try again.')
    } finally {
      setStatusLoading(false)
    }
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-screen bg-gray-900 text-white'>
        <motion.div
          className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full'
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen bg-white dark:bg-customP2BackgroundD_darkest text-gray-900 dark:text-gray-100 p-4'
    >
      <div className='max-w-7xl mx-auto my-6'>
        <h1 className='text-3xl font-bold mb-4'>
          Order Edit - #{order._id?.slice(-6)}
        </h1>

        {error && (
          <div
            className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'
            role='alert'
          >
            <strong className='font-bold'>Error!</strong>
            <span className='block sm:inline'> {error}</span>
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4'>
          <motion.div
            className='lg:col-span-2 bg-white dark:bg-customP2BackgroundD/45 rounded-lg overflow-hidden shadow-lg'
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className='p-4 bg-gray-100 dark:bg-customP2BackgroundD'>
              <h2 className='text-xl font-semibold mb-2'>Order Overview</h2>
            </div>
            <div className='p-4 grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-gray-400'>Order Date</p>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className='text-sm text-gray-400'>Last Updated</p>
                <p>{formatDate(order.updatedAt)}</p>
              </div>
              <div>
                <p className='text-sm text-gray-400'>Current Order Status</p>
                <p>{currentStatus}</p>
              </div>
              <div>
                <p className='text-sm text-gray-400'>Payment Status</p>
                <p>{order.paymentStatus}</p>
              </div>
              <div>
                <p className='text-sm text-gray-400'>Payment Method</p>
                <p>{order.paymentMethod}</p>
              </div>
              <div>
                <p className='text-sm text-gray-400'>Total Amount</p>
                <p className='text-green-400 font-bold'>
                  ${order.totalAmount?.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className='bg-white dark:bg-customP2BackgroundD/45 rounded-lg overflow-hidden shadow-lg'
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className='p-4 bg-gray-100 dark:bg-customP2BackgroundD'>
              <h2 className='text-xl font-semibold mb-2'>Shipping Address</h2>
            </div>
            <div className='p-4 space-y-2'>
              <p>
                <span className='text-gray-400'>Name:</span>{' '}
                {order.shippingAddress?.name}
              </p>
              <p>
                <span className='text-gray-400'>Address:</span>{' '}
                {order.shippingAddress?.address}
              </p>
              <p>
                <span className='text-gray-400'>City:</span>{' '}
                {order.shippingAddress?.city}
              </p>
              <p>
                <span className='text-gray-400'>State:</span>{' '}
                {order.shippingAddress?.state}
              </p>
              <p>
                <span className='text-gray-400'>Postal Code:</span>{' '}
                {order.shippingAddress?.postalCode}
              </p>
              <p>
                <span className='text-gray-400'>Phone:</span>{' '}
                {order.shippingAddress?.phoneNumber}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className='bg-white dark:bg-customP2BackgroundD/45 rounded-lg overflow-hidden shadow-lg mb-4'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className='p-4 bg-gray-100 dark:bg-customP2BackgroundD'>
            <h2 className='text-xl font-semibold mb-2'>Order Items</h2>
          </div>
          <div className='p-4 overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='text-left bg-gray-100 dark:bg-customP2BackgroundD/35'>
                  <th className='p-2'>Product</th>
                  <th className='p-2'>Quantity</th>
                  <th className='p-2'>Unit Price</th>
                  <th className='p-2'>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index} className='border-t border-gray-700'>
                    <td className='p-2'>
                      <div className='flex items-center'>
                        <img
                          src={item.thumbnailImage}
                          alt={item.productName}
                          className='w-10 h-10 object-cover rounded mr-2'
                        />
                        <span>{item.productName}</span>
                      </div>
                    </td>
                    <td className='p-2'>{item.quantity}</td>
                    <td className='p-2'>${item.price.toFixed(2)}</td>
                    <td className='p-2'>
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className='border-t border-gray-700'>
                  <td colSpan='3' className='p-2 text-right'>
                    Subtotal:
                  </td>
                  <td className='p-2'>${order.subtotal?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan='3' className='p-2 text-right'>
                    Shipping:
                  </td>
                  <td className='p-2'>${order.shippingCost?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan='3' className='p-2 text-right'>
                    Tax:
                  </td>
                  <td className='p-2'>${order.taxAmount?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan='3' className='p-2 text-right'>
                    Discount:
                  </td>
                  <td className='p-2'>-${order.discount?.toFixed(2)}</td>
                </tr>
                <tr className='font-bold'>
                  <td colSpan='3' className='p-2 text-right'>
                    Total:
                  </td>
                  <td className='p-2'>${order.totalAmount?.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>

        <motion.div
          className='bg-white dark:bg-customP2BackgroundD/45 rounded-lg overflow-hidden shadow-lg mb-4'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className='p-4 bg-gray-100 dark:bg-customP2BackgroundD'>
            <h2 className='text-xl font-semibold mb-2'>Actions</h2>
          </div>
          <div className='p-4 flex flex-wrap gap-4'>
            <div className='w-full sm:w-auto'>
              <label
                htmlFor='status-change'
                className='block text-sm font-medium mb-2'
              >
                Change Order Status
              </label>
              <select
                id='status-change'
                value={currentStatus}
                onChange={e => handleStatusUpdate(order._id, e.target.value)}
                className='w-full sm:w-48 p-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 appearance-none cursor-pointer'
              >
                <option value={order.orderStatus} disabled>
                  {order.orderStatus}
                </option>
                {orderStatuses
                  .slice(
                    getStatusIndex(currentStatus) + 1,
                    orderStatuses.length - 1
                  )
                  .map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
              </select>
            </div>
            {getStatusIndex(order.orderStatus) < 2 && (
              <div className='w-full sm:w-auto'>
                <label
                  htmlFor='cancel-order'
                  className='block text-sm font-medium mb-2'
                >
                  Cancel Order
                </label>
                <button
                  id='cancel-order'
                  onClick={() => handleCancelOrder(order._id)}
                  className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors duration-200'
                >
                  Cancel Order
                </button>
              </div>
            )}
            {getStatusIndex(order.orderStatus) > 4 &&
              getStatusIndex(order.orderStatus) <= 5 && (
                <>
                  <button
                    onClick={() => handleReturnRequest(order._id, 'Accept')}
                    className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors duration-200'
                  >
                    Accept Return
                  </button>
                  <button
                    onClick={() => handleReturnRequest(order._id, 'Reject')}
                    className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors duration-200'
                  >
                    Reject Return
                  </button>
                </>
              )}
          </div>
        </motion.div>

        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className='w-full py-2 text-center bg-gray-200 dark:bg-customP2BackgroundD/45 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors duration-200 flex items-center justify-center'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isExpanded ? 'Hide Additional Details' : 'Show Additional Details'}
          <ChevronDown
            className={`ml-2 transform ${isExpanded ? 'rotate-180' : ''} transition-transform duration-200`}
          />
        </motion.button>

        {isExpanded && (
          <motion.div
            className='mt-4 bg-white dark:bg-customP2BackgroundD/45 rounded-lg overflow-hidden shadow-lg'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
          >
            <div className='p-4 bg-gray-100 dark:bg-customP2BackgroundD'>
              <h2 className='text-xl font-semibold mb-2'>
                Additional Order Details
              </h2>
            </div>
            <div className='p-4 grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-gray-400'>Order ID</p>
                <p>{order._id}</p>
              </div>
              <div>
                <p className='text-sm text-gray-400'>User ID</p>
                <p>{order.userId}</p>
              </div>
              <div>
                <p className='text-sm text-gray-400'>Created At</p>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className='text-sm text-gray-400'>Updated At</p>
                <p>{formatDate(order.updatedAt)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <AlertDialog
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        button2={'Cancel Order'}
        onConfirm={onConfirm}
        loading={statusLoading}
      />

      <AlertDialog
        isOpen={isStatusChangeOpen}
        onCancel={() => setIsStatusChangeOpen(false)}
        button2={'Confirm Status Change'}
        onConfirm={confirmStatusUpdate}
        loading={statusLoading}
        description={`Are you sure you want to change the order status to ${newStatus}?`}
      ></AlertDialog>
    </motion.div>
  )
}
