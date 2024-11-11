import { Select } from '@headlessui/react'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import apiClient from '../../../services/api/apiClient'
import ReusableTable from '../../../components/common/ReusableTable'
import AlertDialog from '../../../components/common/AlertDialog'
import { updateDiscountStatus } from '../../../redux/slices/Admin/AdminDiscount/adminDiscountSlice'
import { toast } from 'sonner'

function DiscountTable({ data, type }) {
  const [modal, setModal] = useState({
    isOpen: false,
    newStatus: '',
    id: '',
    discountTarget: ''
  })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  console.log(data)
  const handleStatusChange = (id, newStatus, discountTarget) => {
    console.log(newStatus)
    setModal({ isOpen: true, newStatus, id, discountTarget })
  }
  const onConfirm = async () => {
    setLoading(true)
    try {
      const res = await apiClient.put('/api/admin/discounts/update-status', {
        id: modal.id,
        newStatus: modal.newStatus,
        discountTarget: modal.discountTarget
      })
      dispatch(
        updateDiscountStatus({ newStatus: modal.newStatus, type, id: modal.id })
      )
      toast.success('status updated successfully!', {
        className:
          'bg-white dark:bg-customP2ForegroundD_400 font-primary dark:text-white '
      })
    } catch (error) {
      toast.error('Failed to update user status')
      console.error('Failed to update user status:', error)
    } finally {
      setLoading(false)
      setModal({ isOpen: false, newStatus: '', id: '' })
    }
  }
  const onCancel = () => {
    setModal({ isOpen: false, newStatus: '', id: '' })
  }
  const columns = [
    { label: 'Serial No.', field: 'serialNo' },
    { label: 'Name', field: 'name' },
    { label: 'Discount Target', field: 'discountTarget' },
    { label: 'Discount Type', field: 'discountType' },
    { label: 'Discount Value', field: 'discountValue' },
    { label: 'Start Date', field: 'startDate' },
    { label: 'End Date', field: 'endDate' },

    { label: 'Action', field: 'action' }
  ]
  const store = useMemo(
    () =>
      data?.map((curr, index) => ({
        serialNo: <p className='ml-2'>{index + 1}</p>,
        name: (
          <div className='p-2 text-lg font-tertiary'>
            {curr.name || 'Name not available'}
          </div>
        ),
        discountTarget: curr.discountTarget,
        discountType: curr.discountType,
        discountValue: curr.discountValue,
        endDate: new Date(curr.startDate).toLocaleDateString(),
        startDate: new Date(curr.endDate).toLocaleDateString(),
        action: (
          <Select
            name='status'
            value={curr.status}
            onChange={e => {
              handleStatusChange(curr._id, e.target.value, curr.discountTarget)
            }}
            className={`sm:w-24 lg:w-32 py-1 px-2border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-customP2Primary focus:border-customP2Primary sm:text-sm 
               dark:bg-gray-800  text-gray-900 ${
                 curr.status === 'Blocked'
                   ? 'bg-red-400  text-slate-900   dark:text-red-200 dark:bg-red-900 dark:border-red-900 '
                   : 'bg-green-400 dark:bg-green-900 dark:text-green-200 dark:border-green-900'
               }
              `}
          >
            <option value='Active'>Active</option>
            <option value='Blocked'>Blocked</option>
          </Select>
        )
      })),
    [data]
  )
  return (
    <div>
      {' '}
      <ReusableTable columns={columns} data={store} />
      <AlertDialog
        isOpen={modal.isOpen}
        onCancel={onCancel}
        button2={modal.newStatus}
        onConfirm={onConfirm}
        loading={loading}
      />
    </div>
  )
}

export default DiscountTable
