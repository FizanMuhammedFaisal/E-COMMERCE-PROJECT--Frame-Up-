import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import apiClient from '../../../services/api/apiClient'
import AlertDialog from '../../../components/common/AlertDialog'
import UsersTable from '../../../components/common/ReusableTable'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../../components/common/Animations/Spinner'
import { ListCheck } from 'lucide-react'
const OrderStatusBadge = ({ status }) => {
  const statusColors = {
    pending:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    shipped:
      'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
    delivered:
      'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
  }

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        statusColors[status.toLowerCase()] || statusColors.default
      }`}
    >
      {status}
    </span>
  )
}

const AdminOrders = () => {
  const [page, setPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [newState, setNewState] = useState({
    currentOrderId: '',
    newStatus: '',
    index: ''
  })
  const navigate = useNavigate()
  const [statusLoading, setStatusLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const queryClient = useQueryClient()

  const fetchOrders = async ({ pageParam = page }) => {
    const response = await apiClient.get(
      `/api/order/all/orders/admin?page=${pageParam}&limit=20`
    )
    console.log(response)
    return response.data
  }

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => fetchOrders({ page }),
    keepPreviousData: true
  })

  const handleStatusChange = useCallback((id, newStatus, index) => {
    setIsOpen(true)
    setNewState({ currentOrderId: id, newStatus, index })
  }, [])
  const handleOrderEdit = id => {
    navigate(`/dashboard/orders/${id}`)
  }
  const updateStatus = async () => {
    await apiClient.put(`/api/order/update-status/`, {
      newStatus: newState.newStatus,
      orderId: newState.currentOrderId
    })
  }

  const updateStateStatus = () => {
    setOrders(prevOrders =>
      prevOrders.map((order, index) =>
        index === newState.index
          ? { ...order, orderStatus: newState.newStatus }
          : order
      )
    )
  }
  const onConfirm = async () => {
    setStatusLoading(true)
    try {
      await updateStatus()
      toast.success('Order status updated successfully!')
      updateStateStatus()
      setIsOpen(false)

      queryClient.invalidateQueries(['orders'])
    } catch (error) {
      toast.error('Failed to update order status')
      console.error('Failed to update order status:', error)
    } finally {
      setStatusLoading(false)
    }
  }
  useEffect(() => {
    if (data) {
      setOrders(prevOrders => {
        const existingIds = new Set(prevOrders.map(order => order._id))
        const newOrders = data.orders.filter(
          order => !existingIds.has(order._id)
        )
        return [...prevOrders, ...newOrders]
      })
    }
  }, [data])
  const lastOrder = useRef()
  useEffect(() => {
    if (isLoading || !data?.hasMore) return
    console.log('sadfasdf')
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prevPage => prevPage + 1)
        }
      },
      {
        rootMargin: '0px',
        threshold: 1.0
      }
    )
    const currentLastOrderRef = lastOrder.current
    if (currentLastOrderRef) observer.observe(currentLastOrderRef)
    return () => {
      if (currentLastOrderRef) observer.unobserve(currentLastOrderRef)
    }
  }, [isLoading, data?.hasMore, page])

  const columns = useMemo(
    () => [
      { label: 'Serial No.', field: 'number' },
      { label: 'Order No.', field: 'orderNo' },
      { label: 'Customer', field: 'customerName' },
      { label: 'Total Price', field: 'totalPrice' },
      { label: 'Order Date', field: 'orderDate' },
      { label: 'Status', field: 'status' },
      { label: 'Action', field: 'action' },
      { label: 'Details', field: 'details' }
    ],
    []
  )
  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered']
  const ordersData = useMemo(() => {
    if (!orders) return []

    return orders.map((order, index) => {
      const currentStatusIndex = statusOptions.indexOf(order.orderStatus)

      return {
        number: <p className='ms-5'>{index + 1}</p>,
        orderNo: order._id.slice(-6).toUpperCase(),
        customerName: order.shippingAddress.name || 'No name available',
        totalPrice: `$${order.totalAmount.toFixed(2)}`,
        orderDate: new Date(order.createdAt).toLocaleDateString(),
        status: <OrderStatusBadge status={order.orderStatus} />,
        action: (
          <select
            value={order.orderStatus}
            onChange={e => handleStatusChange(order._id, e.target.value, index)}
            className='w-full sm:w-auto px-2 py-1 text-sm border rounded-md bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400'
          >
            <option value={order.orderStatus} disabled>
              {order.orderStatus}
            </option>

            {statusOptions.slice(currentStatusIndex + 1).map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        ),
        details: (
          <button
            onClick={() => handleOrderEdit(order._id)}
            className='text-white p-4 duration-300 hover:duration-300 rounded-full hover:bg-gray-200 hover:dark:bg-customP2BackgroundD_300'
          >
            <FaEdit className='sm:text-xl md:text-2xl dark:text-white text-black' />
          </button>
        )
      }
    })
  }, [orders, handleStatusChange])

  return (
    <div className='p-6  dark:bg-customP2BackgroundD_darkest min-h-screen'>
      <div className='flex flex-col sm:flex-row justify-between items-center my-5 mb-6'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
          Order Management
        </h1>
        <div className='flex gap-6 flex-nowrap'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/orders/return-requests')}
            className='flex items-center flex-nowrap px-3 py-2 bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500 text-white rounded-md shadow min-w-[120px]'
          >
            <ListCheck className='h-5 w-5 mr-2' />
            View return Requests
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refetch}
            className='flex items-center px-3 py-2 bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500 text-white rounded-md shadow min-w-[120px]'
          >
            <ArrowPathIcon className='h-5 w-5 mr-2' />
            Refresh
          </motion.button>
        </div>
      </div>
      <UsersTable columns={columns} data={ordersData} />
      <div className='mt-4 flex justify-center items-center'>
        {(isLoading || isFetching) && (
          <div className='flex justify-center'>
            <Spinner size={1} />
          </div>
        )}
      </div>

      {data?.hasMore && !isLoading && (
        <div ref={lastOrder} className='flex justify-center'>
          Scroll to load more..
        </div>
      )}
      {!data?.hasMore && !isLoading && ordersData.length > 0 && (
        <div className='text-center mt-4 text-gray-600 dark:text-gray-400'>
          No more orders to load.
        </div>
      )}
      {!isLoading && ordersData.length === 0 && (
        <div className='text-center mt-4 text-gray-600 dark:text-gray-400'>
          No orders found.
        </div>
      )}
      <AlertDialog
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        button2={newState.newStatus}
        onConfirm={onConfirm}
        loading={statusLoading}
      />
    </div>
  )
}

export default AdminOrders
