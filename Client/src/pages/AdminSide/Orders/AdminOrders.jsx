import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import apiClient from '../../../services/api/apiClient'
import AlertDialog from '../../../components/common/AlertDialog'
import UsersTable from '../../../components/common/ReusableTable'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

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
      `/api/order?page=${pageParam}&limit=20`
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

  const ordersData = useMemo(() => {
    if (!orders) return []
    return orders.map((order, index) => ({
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
          <option value='Pending'>Pending</option>
          <option value='Processing'>Processing</option>
          <option value='Shipped'>Shipped</option>
          <option value='Delivered'>Delivered</option>
        </select>
      ),
      details: (
        <button
          onClick={() => handleOrderEdit(order._id)}
          className=' text-white p-4 duration-300 hover:duration-300 rounded-full hover:bg-gray-200 hover:dark:bg-customP2BackgroundD_300'
        >
          <FaEdit className='sm:text-xl md:text-2xl dark:text-white text-black' />
        </button>
      )
    }))
  }, [orders, handleStatusChange])

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-800 mt-10 min-h-screen'>
      <div className='mb-6 flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Order Management
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refetch}
          className='flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700'
        >
          <ArrowPathIcon className='h-5 w-5 mr-2' />
          Refresh
        </motion.button>
      </div>
      <UsersTable columns={columns} data={ordersData} />
      <div className='mt-4 flex justify-center items-center'>
        {(isLoading || isFetching) && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <ArrowPathIcon className=' h-8 w-8 text-indigo-600 dark:text-indigo-400' />
          </motion.div>
        )}
      </div>

      {data?.hasMore && !isLoading && (
        <div ref={lastOrder}>Scroll to load more..</div>
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
