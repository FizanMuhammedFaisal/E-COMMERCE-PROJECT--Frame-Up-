import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import apiClient from '../../../services/api/apiClient'
import ReusableTable from '../../../components/common/ReusableTable'
import Spinner from '../../../components/common/Animations/Spinner'
import AlertDialog from '../../../components/common/AlertDialog'

const ReturnStatusBadge = ({ status }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800'
  }

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
        statusColors[status.toLowerCase()] || statusColors.default
      }`}
    >
      {status}
    </span>
  )
}

const ActionButton = ({ onClick, children, color }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md ${color} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color.split('-')[1]}-500 transition ease-in-out duration-150`}
  >
    {children}
  </motion.button>
)

const ReturnRequestPage = () => {
  const [page, setPage] = useState(1)
  const [returnRequests, setReturnRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionType, setActionType] = useState('')

  const fetchReturnRequests = async ({ pageParam = page }) => {
    const res = await apiClient.get(
      `/api/return-request?page=${pageParam}&limit=20`
    )
    console.log(res.data)
    return res.data
  }

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['returnRequests', page],
    queryFn: () => fetchReturnRequests({ page }),
    keepPreviousData: true
  })

  const handleAction = useCallback((request, action, index) => {
    setSelectedRequest(request._id)
    setActionType(action)
    setSelectedIndex(index)
    setIsModalOpen(true)
  }, [])

  const handleConfirm = useCallback(async () => {
    try {
      const res = await apiClient.post('/api/return-request/update', {
        newStatus: actionType,
        requestId: selectedRequest
      })
      if (res.status === 200) {
        setReturnRequests(prev => {
          const newRequest = [...prev]
          newRequest[selectedIndex] = {
            ...newRequest[selectedIndex],
            status: res.data.newStatus
          }
          return newRequest
        })
      }
      toast.success(
        `Return request ${actionType === 'Accept' ? 'approved' : 'rejected'} successfully`
      )
      setIsModalOpen(false)
      refetch()
    } catch (error) {
      toast.error('Failed to update return request status')
    }
  }, [actionType, refetch])

  useEffect(() => {
    if (data) {
      setReturnRequests(prevRequests => {
        const existingIds = new Set(prevRequests.map(request => request._id))
        const newRequests = data.requests.filter(
          request => !existingIds.has(request._id)
        )
        return [...prevRequests, ...newRequests]
      })
    }
  }, [data])

  const columns = useMemo(
    () => [
      { label: 'Request No.', field: 'requestNo' },
      { label: 'Order Id', field: 'orderId' },
      { label: 'ProductId', field: 'productId' },
      { label: 'Customer Name', field: 'customerName' },
      { label: 'Return Reason', field: 'reason' },
      { label: 'Request Date', field: 'requestDate' },
      { label: 'Status', field: 'status' },
      { label: 'Actions', field: 'actions' }
    ],
    []
  )

  const returnRequestsData = useMemo(() => {
    if (!returnRequests) return []
    return returnRequests.map((request, index) => ({
      requestNo: <p className='p-l-2'>{index + 1}</p>,
      orderId: <p>#{request.orderId.slice(-6).toUpperCase()}</p>,
      productId: (
        <p>
          {request.productId
            ? `# ${request?.productId?.slice(-6).toUpperCase()}`
            : 'Whole Order'}
        </p>
      ),
      customerName: request.customerName || 'No name available',
      reason: request.reason,
      requestDate: new Date(request.requestedAt).toLocaleDateString(),
      status: <ReturnStatusBadge status={request.status} />,
      actions:
        request.status.toLowerCase() === 'pending' ? (
          <div className='flex space-x-2'>
            <ActionButton
              onClick={() => handleAction(request, 'Accept', index)}
              color='bg-green-600 text-white hover:bg-green-700'
            >
              Approve
            </ActionButton>
            <ActionButton
              onClick={() => handleAction(request, 'Reject', index)}
              color='bg-red-600 text-white hover:bg-red-700'
            >
              Reject
            </ActionButton>
          </div>
        ) : null
    }))
  }, [returnRequests, handleAction])

  return (
    <div className='p-6 bg-gray-100 dark:bg-gray-900 min-h-screen'>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0'>
          Return Requests
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refetch}
          className='flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition duration-150 ease-in-out'
        >
          Refresh
        </motion.button>
      </div>

      <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden'>
        <ReusableTable columns={columns} data={returnRequestsData} />
      </div>

      <div className='mt-4 flex justify-center items-center'>
        {(isLoading || isFetching) && (
          <div className='flex justify-center'>
            <Spinner size={1} />
          </div>
        )}
      </div>

      {data?.hasMore && !isLoading && (
        <div className='text-center mt-4 text-gray-600 dark:text-gray-400'>
          Scroll to load more..
        </div>
      )}

      {!data?.hasMore && !isLoading && returnRequestsData.length > 0 && (
        <div className='text-center mt-4 text-gray-600 dark:text-gray-400'>
          No more return requests to load.
        </div>
      )}

      {!isLoading && returnRequestsData.length === 0 && (
        <div className='text-center mt-4 text-gray-600 dark:text-gray-400'>
          No return requests found.
        </div>
      )}

      <AlertDialog
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        loading={false}
        heading={`Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`}
        description={`Are you sure you want to ${actionType} this return request?`}
      />
    </div>
  )
}

export default ReturnRequestPage
