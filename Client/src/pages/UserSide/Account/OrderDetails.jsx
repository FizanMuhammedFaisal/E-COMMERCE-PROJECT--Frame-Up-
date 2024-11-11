import { ArrowLeft, Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../services/api/apiClient'
import OrderModal from '../../../components/modals/OrderModal'
import Spinner from '../../../components/common/Animations/Spinner'

function OrderDetails() {
  const [orderId, setOrderId] = useState(null)
  const [cancelIsOpen, setCancelIsOpen] = useState(false)
  const [returnIsOpen, setReturnIsOpen] = useState(false)
  const [singleCancelIsOpen, setSingleCancelIsOpen] = useState(false)
  const [singleReturnIsOpen, setSingleReturnIsOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const { id } = useParams()

  const orderStatuses = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Return Initialized',
    'Return Accepted',
    'Return Rejected',
    'Return Processing',
    'Partially Returned',
    'Return Completed'
  ]

  const handleDownloadInvoice = async id => {
    try {
      const res = await apiClient.get(`/api/order/download-invoice/${id}`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Invoice_order_${id}.pdf`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error(error, 'Invoice download failed')
    }
  }

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
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
      case 'Return Accepted':
        return 'bg-pink-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const handleCancelOrder = id => {
    setCancelIsOpen(true)
    setOrderId(id)
  }

  const handleCancelConfirm = async () => {
    setLoading(true)
    try {
      const res = await apiClient.post('/api/order/cancel', { orderId })
      setSuccessMessage(res?.data?.message)
      setOrder(res.data.order)
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

  const handleSingleCancellation = itemId => {
    setSelectedItemId(itemId)
    setSingleCancelIsOpen(true)
  }

  const handleSingleCancelConfirm = async () => {
    setLoading(true)
    try {
      const res = await apiClient.post('/api/order/cancel-item', {
        orderId: id,
        itemId: selectedItemId
      })
      setSuccessMessage(res.data.message)
      setOrder(res?.data?.order)
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          'An error occurred while cancelling the item'
      )
    } finally {
      setLoading(false)
      setSingleCancelIsOpen(false)
    }
  }

  const handleReturnOrder = id => {
    setReturnIsOpen(true)
    setOrderId(id)
  }

  const handleReturnConfirm = async reason => {
    setLoading(true)
    try {
      const res = await apiClient.post('/api/return-request/', {
        orderId,
        reason
      })
      setErrorMessage(null)
      setSuccessMessage(res.data.message)
      setOrder(res?.data?.order)
    } catch (error) {
      console.error(error)
      setErrorMessage(
        error?.response?.data?.message ||
          'An error occurred while returning the order'
      )
    } finally {
      setLoading(false)
      setReturnIsOpen(false)
    }
  }

  const handleSingleReturn = itemId => {
    setSelectedItemId(itemId)
    setSingleReturnIsOpen(true)
  }

  const handleSingleReturnConfirm = async reason => {
    setLoading(true)
    try {
      const res = await apiClient.post('/api/return-request/return-item', {
        orderId: id,
        itemId: selectedItemId,
        reason
      })
      setSuccessMessage(res.data.message)
      setOrder(res?.data?.order)
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          'An error occurred while returning the item'
      )
    } finally {
      setLoading(false)
      setSingleReturnIsOpen(false)
    }
  }

  const getStatusIndex = status => orderStatuses.indexOf(status)

  const fetchData = async () => {
    const res = await apiClient.get(`api/order/${id}`)
    return res.data.order
  }

  const { data, isLoading, isError } = useQuery({
    queryFn: fetchData,
    queryKey: ['order', id]
  })

  useEffect(() => {
    if (data) {
      setOrder(data)
    }
  }, [data])
  if (isLoading) {
    return <Spinner center={true} />
  }
  if (!order) return null
  if (isError) {
    return (
      <p className='text-red-300 flex justify-center items-center'>
        {' '}
        cannot Load History
      </p>
    )
  }
  return (
    <div className='max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mb-8 flex items-center justify-between'>
        <button
          onClick={() => navigate('/account/order-history')}
          className='flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Order History
        </button>
        <h1 className='text-2xl font-bold text-gray-900'>Order Details</h1>
      </div>

      {(successMessage || errorMessage) && (
        <div
          className={`mb-6 p-4 rounded-md ₹{
            successMessage
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
          role='alert'
        >
          <p className='text-sm font-medium'>
            {successMessage || errorMessage}
          </p>
        </div>
      )}

      <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
        <div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
          <div>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              Order #{order._id}
            </h3>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}
          >
            {order.orderStatus}
          </div>
        </div>

        <div className='border-t border-gray-200'>
          <dl>
            <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>Items</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                <ul className='divide-y divide-gray-200'>
                  {order.items.map((item, index) => (
                    <li
                      key={index}
                      className='py-4 flex items-center justify-between'
                    >
                      <div className='flex items-center'>
                        {item.thumbnailImage &&
                          item.thumbnailImage.length > 0 && (
                            <img
                              src={item.thumbnailImage[0]}
                              alt={item.productName}
                              className='w-16 h-16 object-cover rounded-md mr-4'
                            />
                          )}
                        <div>
                          <p className='text-sm font-medium text-gray-900'>
                            {item.productName}
                          </p>
                          <p className='text-sm text-gray-500'>
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <p className='text-sm font-medium text-gray-900 mr-4'>
                          ₹{item.price.toFixed(2)}
                        </p>
                        {getStatusIndex(item.status) <= 1 ? (
                          <button
                            onClick={() => handleSingleCancellation(item._id)}
                            className='bg-red-500 px-3 py-2 rounded-md text-white text-sm hover:bg-red-600 transition duration-150 ease-in-out'
                          >
                            Cancel
                          </button>
                        ) : item.status === 'Delivered' && !successMessage ? (
                          <button
                            onClick={() => handleSingleReturn(item._id)}
                            className='bg-yellow-500 px-3 py-2 rounded-md text-white text-sm hover:bg-yellow-600 transition duration-150 ease-in-out'
                          >
                            Return
                          </button>
                        ) : (
                          <div>
                            {
                              <div
                                className={`₹{getStatusColor(item.status)} p-2`}
                              >
                                {item.status}
                              </div>
                            }
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>
                Order Summary
              </dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Shipping:</span>
                    <span>₹{order.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Tax:</span>
                    <span>₹{order.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-green-600'>
                    <span>Discount:</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-green-600'>
                    <span>Discount:</span>
                    <span>-₹{order.couponAmount.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between font-medium text-lg border-t pt-2'>
                    <span>Total:</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  {order?.cancelledAmount && order.cancelledAmount !== 0 && (
                    <div className='flex justify-between font-medium text-lg border-t pt-2'>
                      <span>Cancelled Total Amount:</span>
                      <span>-₹{order?.cancelledAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </dd>
            </div>
            <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>
                Shipping Address
              </dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                <address className='not-italic'>
                  <strong>{order.shippingAddress.name}</strong>
                  <br />
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                  <br />
                  <span className='text-gray-600'>Phone:</span>{' '}
                  {order.shippingAddress.phoneNumber}
                </address>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className='mt-8 flex flex-col sm:flex-row sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4'>
        <button
          onClick={() => handleDownloadInvoice(order._id)}
          className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out'
        >
          <Download className='mr-2 h-4 w-4' />
          Download Invoice
        </button>

        {getStatusIndex(order.orderStatus) <= 1 && (
          <button
            onClick={() => handleCancelOrder(order._id)}
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out'
          >
            Cancel Order
          </button>
        )}

        {order.orderStatus === 'Delivered' && !successMessage && (
          <button
            onClick={() => handleReturnOrder(order._id)}
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out'
          >
            Return Order
          </button>
        )}
      </div>

      {cancelIsOpen && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg p-6 max-w-sm w-full'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Cancel Order
            </h3>
            <p className='text-sm text-gray-500 mb-4'>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
            <div className='flex justify-end space-x-3'>
              <button
                onClick={() => setCancelIsOpen(false)}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out'
              >
                No, Keep Order
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={loading}
                className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition duration-150 ease-in-out'
              >
                {loading ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {singleCancelIsOpen && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg p-6 max-w-sm w-full'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Cancel Item
            </h3>
            <p className='text-sm text-gray-500 mb-4'>
              Are you sure you want to cancel this item? This action cannot be
              undone.
            </p>
            <div className='flex justify-end space-x-3'>
              <button
                onClick={() => setSingleCancelIsOpen(false)}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out'
              >
                No, Keep Item
              </button>
              <button
                onClick={handleSingleCancelConfirm}
                disabled={loading}
                className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition duration-150 ease-in-out'
              >
                {loading ? 'Cancelling...' : 'Yes, Cancel Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      <OrderModal
        isOpen={returnIsOpen}
        onConfirm={handleReturnConfirm}
        onClose={() => setReturnIsOpen(false)}
      />

      {singleReturnIsOpen && (
        <OrderModal
          isOpen={singleReturnIsOpen}
          onConfirm={handleSingleReturnConfirm}
          onClose={() => setSingleReturnIsOpen(false)}
        />
      )}
    </div>
  )
}

export default OrderDetails
