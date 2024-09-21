import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import UsersTable from '../../components/common/ReusableTable'
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CircularProgress from '@mui/material/CircularProgress'
import { Select } from '@headlessui/react'
import AlertDialog from '../../components/common/AlertDialog'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUsers,
  setPage,
  updateUserStatus
} from '../../redux/slices/adminUsersSlice'
const AdminUsers = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.adminUsers.data)
  const loading = useSelector(state => state.adminUsers.loading)
  const page = useSelector(state => state.adminUsers.page)
  const hasMore = useSelector(state => state.adminUsers.hasMore)

  const [isOpen, setIsOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  const handleStatusChange = useCallback(
    (id, newStatus) => {
      setIsOpen(true)
      setNewStatus(newStatus)
      setCurrentUserId(id)
    },
    [setIsOpen, setNewStatus, setCurrentUserId]
  )

  const onConfirm = async () => {
    setStatusLoading(true)
    try {
      await dispatch(
        updateUserStatus({ id: currentUserId, status: newStatus })
      ).unwrap()
      toast.success('User status updated successfully!', {
        className:
          'bg-white dark:bg-customP2ForegroundD_400 font-primary dark:text-white '
      })
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to update user status')
      console.error('Failed to update user status:', error)
    } finally {
      setStatusLoading(false)
    }
  }
  const lastUserRef = useRef()
  useEffect(() => {
    dispatch(fetchUsers(page))
  }, [page])

  // Setup IntersectionObserver to load more users when the last user is in view
  useEffect(() => {
    if (loading || !hasMore) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          console.log('Last user in view, loading more users')
          dispatch(setPage(page + 1))
        }
      },
      { rootMargin: '0px', threshold: 1.0 }
    )

    const currentLastUserRef = lastUserRef.current
    if (currentLastUserRef) observer.observe(currentLastUserRef)

    return () => {
      if (currentLastUserRef) observer.unobserve(currentLastUserRef)
    }
  }, [loading, hasMore, page])

  const columns = [
    { label: 'Serial No.', field: 'serialNo' },
    { label: 'Name', field: 'username' },
    { label: 'Email', field: 'email' },

    { label: 'Action', field: 'action' }
  ]

  const data = useMemo(
    () =>
      users.map((user, index) => ({
        serialNo: <p className='ms-5'>{index + 1}</p>,
        username: (
          <div className='p-1 text-lg font-tertiary'>
            {user.username || 'Name not available'}
          </div>
        ),
        email: (
          <div className='p-1 text-lg font-tertiary'>
            {user.email || 'Email not available'}
          </div>
        ),

        action: (
          <Select
            name='status'
            value={user.status}
            onChange={e => {
              handleStatusChange(user._id, e.target.value)
            }}
            className={` sm:w-24 lg:w-28 py-1 px-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm 
         dark:bg-gray-800  text-gray-900 ${
           user.status === 'Blocked'
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
    [users, handleStatusChange]
  )

  return (
    <div className='p-4 dark:bg-customP2BackgroundD_darkest  dark:text-slate-50'>
      <h1 className='text-2xl font-semibold mb-4'>User Management</h1>
      <UsersTable columns={columns} data={data} />
      <div className='text-center mt-4 "'>
        {loading && (
          <CircularProgress
            thickness={7}
            sx={{
              color: 'currentColor'
            }}
            size={30}
          />
        )}
      </div>

      {hasMore && !loading && (
        <div ref={lastUserRef} className='text-center'>
          Scroll to load more...
        </div>
      )}
      {!hasMore && !loading && (
        <div className='text-center'>No more users to load.</div>
      )}
      <AlertDialog
        isOpen={isOpen}
        onCancel={() => {
          setIsOpen(false)
        }}
        button2={newStatus}
        onConfirm={onConfirm}
        loading={statusLoading}
      />
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default AdminUsers
