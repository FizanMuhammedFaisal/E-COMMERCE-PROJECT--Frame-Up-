import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, Package, Truck, CheckCircle } from 'lucide-react'
import apiClient from '../../../services/api/apiClient'

const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered']

const OrderEditPage = () => {
  const { orderId } = useParams()
  const [isExpanded, setIsExpanded] = useState(false)
  const [order, setOrder] = useState({})
  const [currentStatus, setCurrentStatus] = useState('')

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
    <div className='min-h-screen bg-white text-gray-900 dark:bg-customP2BackgroundD_darkest dark:text-white transition-colors duration-300'>
      <div className='max-w-4xl mx-auto p-4 md:p-6 bg-white dark:bg-customP2ForegroundD_300 shadow-lg rounded-lg my-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold font-primary mb-4'>
            Order Details
          </h1>
          <div className='relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-6'>
            <img
              src={
                order.items?.[0]?.thumbnailImage ||
                '/placeholder.svg?height=300&width=400'
              }
              alt='Product'
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
            <div className='absolute bottom-4 left-4 text-white'>
              <h2 className='text-2xl font-semibold font-primary mb-2'>
                Order #{order._id?.slice(-6)}
              </h2>
              <p className='text-sm opacity-75'>
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className='mb-12'>
          <h3 className='text-2xl font-semibold font-primary mb-6 text-center'>
            Order Status
          </h3>
          <div className='relative mb-6'>
            <div className='flex justify-between items-center mb-4'>
              {orderStatuses.map((status, index) => (
                <div key={status} className='flex flex-col items-center'>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      getStatusIndex(currentStatus) >= index
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    {index === 0 && <Package className='w-6 h-6 text-white' />}
                    {index === 1 && <Truck className='w-6 h-6 text-white' />}
                    {index === 2 && <Truck className='w-6 h-6 text-white' />}
                    {index === 3 && (
                      <CheckCircle className='w-6 h-6 text-white' />
                    )}
                  </div>
                  <span className='text-xs mt-2'>{status}</span>
                </div>
              ))}
            </div>
            <div className='h-2 bg-gray-300 absolute top-5 left-0 right-0 -z-10'>
              <div
                className='h-full bg-blue-500 transition-all duration-300'
                style={{
                  width: `${(getStatusIndex(currentStatus) / (orderStatuses.length - 1)) * 100}%`
                }}
              />
            </div>
          </div>
          <div className='mt-8 flex justify-center'>
            <select
              value={currentStatus}
              onChange={event => handleStatusUpdate(order._id, event)}
              className='w-full max-w-md p-3 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 bg-white dark:bg-gray-800 appearance-none cursor-pointer'
            >
              {orderStatuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
          <div>
            <h3 className='text-xl font-semibold font-primary mb-4'>
              Shipping Address
            </h3>
            <div className='space-y-2'>
              <p className='font-semibold'>{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.phoneNumber}</p>
            </div>
          </div>
          <div>
            <h3 className='text-xl font-semibold font-primary mb-4'>
              Order Summary
            </h3>
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
                <span>${order.discount?.toFixed(2)}</span>
              </div>
              <div className='flex justify-between font-semibold text-lg pt-2 border-t'>
                <span>Total:</span>
                <span>${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='mb-8'>
          <h3 className='text-xl font-semibold font-primary mb-4'>
            Order Items
          </h3>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-600'>
              <thead className='bg-gray-50 dark:bg-gray-800'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                    Product
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                    Quantity
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                    Price
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-600'>
                {order.items?.map((item, index) => (
                  <tr key={index}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <img
                            className='h-10 w-10 rounded-full object-cover'
                            src={item.thumbnailImage}
                            alt={item.productName}
                          />
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium'>
                            {item.productName}
                          </div>
                          <div className='text-sm text-gray-500 dark:text-gray-400'>
                            ID: {item.productId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      {item.quantity}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      ${item.price.toFixed(2)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='mb-8'>
          <h3 className='text-xl font-semibold font-primary mb-4'>
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
          className='w-full py-3 text-center font-primary bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors duration-200'
        >
          {isExpanded ? 'Hide Details' : 'Show More Details'}
          <ChevronDown
            className={`inline-block ml-2 transform ${isExpanded ? 'rotate-180' : ''} transition-transform duration-200`}
          />
        </button>

        {isExpanded && (
          <div className='mt-8'>
            <h3 className='text-xl font-semibold font-primary mb-4'>
              Additional Order Details
            </h3>
            <div className='space-y-2'>
              <p>
                <span className='font-semibold'>Order ID:</span> {order._id}
              </p>
              <p>
                <span className='font-semibold'>User ID:</span> {order.userId}
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
  )
}

export default OrderEditPage
