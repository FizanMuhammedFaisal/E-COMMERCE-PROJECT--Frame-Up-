import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, Package, Truck, CheckCircle, X } from 'lucide-react'
import apiClient from '../../../services/api/apiClient'
import AlertDialog from '../../../components/common/AlertDialog'

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

export default function OrderEditPage() {
  const { orderId } = useParams()
  const [isExpanded, setIsExpanded] = useState(false)
  const [order, setOrder] = useState({})
  const [currentStatus, setCurrentStatus] = useState('')
  const [statusLoading, setStatusLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState(null)
  const fetchOrder = async orderId => {
    const res = await apiClient.get(`/api/order/${orderId}`)
    return res.data
  }

  const { data, isLoading } = useQuery({
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
    console.log(newStatus, orderId)
    try {
      const res = await apiClient.post('/api/return-request/update', {
        orderId,
        newStatus
      })
      console.log(res.data)
    } catch (error) {
      console.error()
      setError(error?.response?.data?.message)
    }
  }
  const handleStatusUpdate = async (orderId, event) => {
    const newStatus = event.target.value

    try {
      await apiClient.put(`/api/order/update-status`, {
        newStatus,
        orderId
      })
      setCurrentStatus(newStatus)
      console.log(`Order status updated to: ${newStatus}`)
    } catch (error) {
      console.error('Failed to update order status:', error)
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
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to cancel order:', error)
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
      <div className='font-primary text-center mt-8 dark:text-white'>
        Loading...
      </div>
    )

  return (
    <div className='min-h-screen bg-white dark:bg-customP2BackgroundD text-gray-900 dark:text-white transition-colors duration-300'>
      <div className='max-w-7xl mx-auto p-4 md:p-6 lg:p-8'>
        <h1 className='text-3xl font-bold mb-8'>Order Edit</h1>
        <div className='bg-white dark:bg-customP2BackgroundD shadow-xl rounded-lg overflow-hidden'>
          <div className='relative w-full h-64 md:h-80 rounded-t-lg overflow-hidden'>
            <img
              src={order.items?.[0]?.thumbnailImage}
              alt='Product'
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
            <div className='absolute bottom-4 left-4 text-white'>
              <h2 className='text-3xl font-bold mb-2'>
                Order #{order._id?.slice(-6)}
              </h2>
              <p className='text-sm opacity-75'>
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className='p-6 space-y-8'>
            <div>
              <h3 className='text-2xl font-semibold mb-6 text-center'>
                Order Status
              </h3>
              {error ? <div>{error}</div> : ''}
              {getStatusIndex(order.orderStatus) === 4 ? (
                <div
                  className='bg-red-100 border border-red-400 text-red-700 p-2 rounded-md'
                  role='alert'
                >
                  <strong>Order Cancelled:</strong> This order has been
                  cancelled.
                </div>
              ) : null}

              {getStatusIndex(order.orderStatus) < 3 && (
                <div className='relative mb-6'>
                  <div className='flex justify-between items-center mb-4'>
                    {orderStatuses.slice(0, 4).map((status, index) => (
                      <div key={status} className='flex flex-col items-center'>
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            getStatusIndex(currentStatus) >= index
                              ? 'bg-blue-500'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          {index === 0 && (
                            <Package className='w-6 h-6 text-white' />
                          )}
                          {index === 1 && (
                            <Truck className='w-6 h-6 text-white' />
                          )}
                          {index === 2 && (
                            <Truck className='w-6 h-6 text-white' />
                          )}
                          {index === 3 && (
                            <CheckCircle className='w-6 h-6 text-white' />
                          )}
                        </div>
                        <span className='text-xs mt-2'>{status}</span>
                      </div>
                    ))}
                  </div>
                  <div className='h-2 bg-gray-300 dark:bg-gray-600 absolute top-6 left-0 right-0 -z-10'>
                    <div
                      className='h-full bg-blue-500 transition-all duration-300'
                      style={{
                        width: `${(getStatusIndex(currentStatus) / 3) * 100}%`
                      }}
                    />
                  </div>
                </div>
              )}
              <div className='mt-8 flex flex-col sm:flex-row justify-center items-center gap-4'>
                {getStatusIndex(order.orderStatus) < 4 && (
                  <>
                    <div className='w-full sm:w-auto'>
                      <label
                        htmlFor='status-change'
                        className='block text-sm font-medium mb-2'
                      >
                        Change Status
                      </label>
                      <select
                        id='status-change'
                        value={currentStatus}
                        onChange={handleStatusUpdate}
                        className='w-full sm:w-48 p-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 bg-white dark:bg-gray-800 appearance-none cursor-pointer'
                      >
                        {orderStatuses.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='w-full sm:w-auto'>
                      <label
                        htmlFor='cancel-order'
                        className='block text-sm font-medium mb-2'
                      >
                        Cancel Order
                      </label>
                      <button
                        id='cancel-order'
                        onClick={() => {
                          handleCancelOrder(order._id)
                        }}
                        className='w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors duration-200'
                      >
                        Cancel Order
                      </button>
                    </div>
                  </>
                )}
                {getStatusIndex(order.orderStatus) > 4 && (
                  <div>
                    <h4 className='text-lg font-semibold mb-2'>
                      Order has been requested to return
                    </h4>
                    {getStatusIndex(order.orderStatus) > 5 ? (
                      <div
                        className='bg-green-100 border border-green-400 text-green-700 p-2 rounded-md'
                        role='alert'
                      >
                        <strong>Order Settled:</strong> This order has been
                        settled.
                        <p className='mt-1'>{order.orderStatus}</p>
                      </div>
                    ) : (
                      <div className='flex gap-4'>
                        <button
                          onClick={() =>
                            handleReturnRequest(order._id, 'Accept')
                          }
                          className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors duration-200'
                        >
                          Accept Return
                        </button>
                        <button
                          onClick={() =>
                            handleReturnRequest(order._id, 'Reject')
                          }
                          className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors duration-200'
                        >
                          Reject Return
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='bg-gray-100 dark:bg-gray-700 p-6 rounded-lg'>
                <h3 className='text-xl font-semibold mb-4'>Shipping Address</h3>
                <div className='space-y-2'>
                  <p className='font-semibold'>{order.shippingAddress?.name}</p>
                  <p>{order.shippingAddress?.address}</p>
                  <p>
                    {order.shippingAddress?.city},{' '}
                    {order.shippingAddress?.state}{' '}
                    {order.shippingAddress?.postalCode}
                  </p>
                  <p>{order.shippingAddress?.phoneNumber}</p>
                </div>
              </div>
              <div className='bg-gray-100 dark:bg-gray-700 p-6 rounded-lg'>
                <h3 className='text-xl font-semibold mb-4'>Order Summary</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Subtotal:</span>
                    <span>${order.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Shipping:</span>
                    <span>${order.shippingCost?.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Tax:</span>
                    <span>${order.taxAmount?.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Discount:</span>
                    <span>-${order.discount?.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between font-semibold text-lg pt-2 border-t dark:border-gray-600'>
                    <span>Total:</span>
                    <span>${order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-xl font-semibold mb-4'>Order Items</h3>
              <div className='space-y-4'>
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center space-x-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'
                  >
                    <img
                      src={item.thumbnailImage}
                      alt={item.productName}
                      className='w-16 h-16 object-cover rounded-md'
                    />
                    <div className='flex-1'>
                      <h4 className='font-medium'>{item.productName}</h4>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        ID: {item.productId}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium'>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='bg-gray-100 dark:bg-gray-700 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-4'>
                Payment Information
              </h3>
              <div className='space-y-2'>
                <p>
                  <span className='font-semibold'>Method:</span>{' '}
                  {order.paymentMethod}
                </p>
                <p>
                  <span className='font-semibold'>Status:</span>{' '}
                  {order.paymentStatus}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='w-full py-3 text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200'
            >
              {isExpanded ? 'Hide Details' : 'Show More Details'}
              <ChevronDown
                className={`inline-block ml-2 transform ${isExpanded ? 'rotate-180' : ''} transition-transform duration-200`}
              />
            </button>

            {isExpanded && (
              <div className='mt-8 bg-gray-100 dark:bg-gray-700 p-6 rounded-lg'>
                <h3 className='text-xl font-semibold mb-4'>
                  Additional Order Details
                </h3>
                <div className='space-y-2'>
                  <p>
                    <span className='font-semibold'>Order ID:</span> {order._id}
                  </p>
                  <p>
                    <span className='font-semibold'>User ID:</span>{' '}
                    {order.userId}
                  </p>
                  <p>
                    <span className='font-semibold'>Created At:</span>{' '}
                    {formatDate(order.createdAt)}
                  </p>
                  <p>
                    <span className='font-semibold'>Updated At:</span>{' '}
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        button2={'Cancel Order'}
        onConfirm={onConfirm}
        loading={statusLoading}
      />
    </div>
  )
}
