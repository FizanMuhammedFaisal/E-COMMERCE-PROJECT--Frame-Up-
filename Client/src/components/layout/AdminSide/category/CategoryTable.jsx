import { Select } from '@headlessui/react'
import apiClient from '../../../../services/api/apiClient'
import CategoriesTable from '../../../common/ReusableTable'
import React, { useMemo, useState } from 'react'
import AlertDialog from '../../../common/AlertDialog'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { updateStatus } from '../../../../redux/slices/Admin/AdminCategory/categoriesFetchSlice'

function CategoryTable({ data, type }) {
  const [modal, setModal] = useState({ isOpen: false, newStatus: '', id: '' })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const columns = [
    { label: 'Serial No.', field: 'serialNo' },
    { label: 'Name', field: 'name' },
    { label: 'Description', field: 'description' },

    { label: 'Action', field: 'action' }
  ]

  const handleStatusChange = (id, newStatus) => {
    console.log(newStatus)
    setModal({ isOpen: true, newStatus, id: id })
  }
  const onConfirm = async () => {
    setLoading(true)
    try {
      const res = await apiClient.post('/api/admin/categories/update-status', {
        id: modal.id,
        newStatus: modal.newStatus
      })
      dispatch(updateStatus({ newStatus: modal.newStatus, type, id: modal.id }))
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
  const store = useMemo(
    () =>
      data?.map((curr, index) => ({
        serialNo: index + 1,
        name: (
          <div className='p-2 text-lg font-tertiary'>
            {curr.name || 'Name not available'}
          </div>
        ),
        description: (
          <div className='p-2 text-lg font-tertiary'>
            {curr.description || 'No Description'}
          </div>
        ),

        action: (
          <Select
            name='status'
            value={curr.status}
            onChange={e => {
              handleStatusChange(curr._id, e.target.value)
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
      <CategoriesTable columns={columns} data={store} />
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

export default CategoryTable
