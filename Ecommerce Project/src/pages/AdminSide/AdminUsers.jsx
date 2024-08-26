import React, { useEffect, useRef, useState } from 'react'
import UsersTable from '../../components/common/ReusableTable'
import apiClient from '../../services/api/apiClient'
import CircularProgress from '@mui/material/CircularProgress'
import { Select } from '@headlessui/react'
import AlertDialog from '../../components/common/AlertDialog'
const AdminUsers = () => {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [users, setUsers] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const handleStatusChange = (id, newStatus) => {
    setIsOpen(true)
    setNewStatus(newStatus)
    setCurrentUserId(id)
  }

  const onConfirm = async () => {
    setStatusLoading(true)
    setUsers(prevUsers =>
      prevUsers.map(user => {
        return user._id === currentUserId
          ? { ...user, status: newStatus }
          : user
      })
    )
    const updatedUser = users.find(user => user._id === currentUserId)

    if (!updatedUser) {
      setStatusLoading(false)
      setIsOpen(false)
      return
    }

    try {
      const res = await apiClient.put(
        `api/admin/users/${updatedUser._id}/status`,
        {
          status: newStatus
        }
      )
      console.log(res)

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === currentUserId ? { ...user, status: newStatus } : user
        )
      )
    } catch (error) {
      console.error('Failed to update user status:', error)
    } finally {
      setStatusLoading(false)
      setIsOpen(false)
    }

    //call axios
  }
  const lastUserRef = useRef()

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await apiClient.get(`/api/admin/getusers?page=${page}`)
        console.log(response)

        if (response.data.length > 0) {
          setUsers(prevUsers => {
            const newUsers = response.data.filter(
              user => !prevUsers.some(prevUser => prevUser.email === user.email) // Assuming each user has a unique `id`
            )
            return [...prevUsers, ...newUsers]
          })
          setHasMore(true)
        } else {
          setHasMore(false)
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [page])

  useEffect(() => {
    // Only clear users when the component mounts initially
    setUsers([])
    setPage(1)
    setHasMore(true)
  }, [])

  // Setup IntersectionObserver to load more users when the last user is in view
  useEffect(() => {
    if (loading || !hasMore) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1)
        }
      },
      { rootMargin: '0px', threshold: 1.0 }
    )

    const currentLastUserRef = lastUserRef.current
    if (currentLastUserRef) observer.observe(currentLastUserRef)

    return () => {
      if (currentLastUserRef) observer.unobserve(currentLastUserRef)
    }
  }, [loading, hasMore])

  const columns = [
    { label: 'Serial No.', field: 'serialNo' },
    { label: 'Name', field: 'username' },
    { label: 'Email', field: 'email' },

    { label: 'Action', field: 'action' }
  ]
  console.log(users)

  const data = users.map((user, index) => ({
    serialNo: index + 1, // Adjust serialNo based on overall index
    username: (
      <div className='p-2 text-lg font-tertiary'>
        {user.username || 'Name not available'}
      </div>
    ),
    email: (
      <div className='p-2 text-lg font-tertiary'>
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
        className={` w-40 py-2 px-3 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm 
         dark:bg-gray-800  text-gray-900 ${
           user.status === 'Blocked'
             ? 'bg-red-400  text-slate-900 dark:text-slate-50 dark:bg-red-600 '
             : 'bg-green-400 dark:bg-green-700 dark:text-slate-50'
         }
        `}
      >
        <option value='Active'>Active</option>
        <option value='Blocked'>Blocked</option>
      </Select>
    )
  }))

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

      {!loading && hasMore && (
        <div ref={lastUserRef} className='text-center'>
          Scroll to load more...
        </div>
      )}
      {!hasMore && <div className='text-center'>No more users to load.</div>}
      <AlertDialog
        isOpen={isOpen}
        onCancel={() => {
          setIsOpen(false)
        }}
        button2={newStatus}
        onConfirm={onConfirm}
        loading={statusLoading}
      />
    </div>
  )
}

export default AdminUsers
