import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../../services/api/apiClient'
import UsersTable from '../../../components/common/ReusableTable'
import AlertDialog from '../../../components/common/AlertDialog'

import Spinner from '../../../components/common/Animations/Spinner'

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [currentCouponId, setCurrentCouponId] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [newState, setNewState] = useState({
    currentCouponId: '',
    newStatus: '',
    index: ''
  })
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const fetchCoupons = async () => {
    const response = await apiClient.get('/api/coupons/all')
    console.log(response.data)
    return response.data.coupons
  }

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['coupons'],
    queryFn: fetchCoupons
  })

  useEffect(() => {
    if (data) {
      setCoupons(data)
    }
  }, [data])

  function handleDeleteCoupon(id) {
    setCurrentCouponId(id)
    setIsOpen(true)
  }

  const deleteCoupon = async () => {
    try {
      console.log(currentCouponId)
      await apiClient.delete(`/api/coupons/${currentCouponId}`)
      toast.success('Coupon deleted successfully!')
      refetch()
    } catch (error) {
      toast.error('Failed to delete coupon')
      console.error('Failed to delete coupon:', error)
    }
  }

  const onConfirmDelete = async () => {
    setStatusLoading(true)
    await deleteCoupon()
    setIsOpen(false)
    setStatusLoading(false)
  }

  function handleStatusChange(id, newStatus, index) {
    setIsOpen(true)
    setNewState({ currentCouponId: id, newStatus, index })
  }

  const updateStatus = async () => {
    await apiClient.put(`/api/coupons/update-status`, {
      newStatus: newState.newStatus,
      couponId: newState.currentCouponId
    })
  }

  const updateStateStatus = () => {
    setCoupons(prevCoupons =>
      prevCoupons.map((coupon, index) =>
        index === newState.index
          ? { ...coupon, status: newState.newStatus }
          : coupon
      )
    )
  }

  const onConfirmStatusChange = async () => {
    setStatusLoading(true)
    try {
      await updateStatus()
      toast.success('Coupon status updated successfully!')
      updateStateStatus()
      setIsOpen(false)
      queryClient.invalidateQueries(['coupons'])
    } catch (error) {
      toast.error('Failed to update coupon status')
      console.error('Failed to update coupon status:', error)
    } finally {
      setStatusLoading(false)
    }
  }

  const columns = useMemo(
    () => [
      { label: 'Serial No.', field: 'no' },
      { label: 'Code', field: 'code' },
      { label: 'Discount Type', field: 'discountType' },
      { label: 'Discount Amount', field: 'discountAmount' },
      { label: 'Min Order Amount', field: 'minPurchaseAmount' },
      { label: 'Max Discount Amount', field: 'maxDiscountAmount' },
      { label: 'Expiration Date', field: 'expirationDate' },
      { label: 'Status', field: 'status' },
      { label: 'Action', field: 'action' }
    ],
    []
  )

  const couponsData = useMemo(() => {
    return coupons.map((coupon, index) => ({
      no: <p className='ml-3'>{index + 1}</p>,
      code: coupon.code,
      discountType: coupon.discountType,
      discountAmount: coupon.discountAmount,
      minPurchaseAmount: coupon.minPurchaseAmount,
      maxDiscountAmount: coupon.maxDiscountAmount,
      expirationDate: new Date(coupon.validTill).toLocaleDateString(),
      status: (
        <select
          name='status'
          value={coupon.status}
          onChange={e => handleStatusChange(coupon._id, e.target.value, index)}
          className={`sm:w-24 lg:w-28 py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm 
            dark:bg-gray-800 text-gray-900 ${
              coupon.status === 'Blocked'
                ? 'bg-red-400 text-slate-900 dark:text-red-200 dark:bg-red-900 dark:border-red-900'
                : 'bg-green-400 dark:bg-green-900 dark:text-green-200 dark:border-green-900'
            }`}
        >
          <option value='Active'>Active</option>
          <option value='Blocked'>Blocked</option>
        </select>
      ),
      action: (
        <button
          onClick={() => handleDeleteCoupon(coupon._id)}
          className='px-3 py-1 bg-red-500 text-red-100 rounded-md hover:bg-red-400 transition-colors duration-200'
        >
          Delete
        </button>
      )
    }))
  }, [coupons])

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <div className='flex items-center flex-col'>
          <Spinner size={1} />

          <p className='mt-2 text-gray-600'>Loading coupons...</p>
        </div>
      )
    }

    if (error) {
      return <div className='text-red-500'>Error loading coupons</div>
    }

    return <UsersTable columns={columns} data={couponsData} />
  }

  return (
    <div className='p-6 bg-gray-50 dark:bg-customP2BackgroundD_darkest mt-10 min-h-screen'>
      <div className='mb-6 flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Coupons Management
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/coupons/add-coupons')}
          className='flex items-center px-4 py-2  text-white rounded-md shadow  bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500'
        >
          Add Coupon
        </motion.button>
      </div>

      {renderContent()}

      <AlertDialog
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        button2={newState.newStatus || 'Delete'}
        onConfirm={newState.newStatus ? onConfirmStatusChange : onConfirmDelete}
        loading={statusLoading}
      />
    </div>
  )
}

export default AdminCouponsPage
