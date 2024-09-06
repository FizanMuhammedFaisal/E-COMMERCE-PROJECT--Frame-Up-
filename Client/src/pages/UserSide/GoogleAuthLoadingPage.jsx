import React, { useEffect, useState, useRef } from 'react'
import UsersTable from '../../components/common/ReusableTable'
import apiClient from '../../services/api/apiClient'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const observer = useRef()

  useEffect(() => {
    fetchUsers(page)
  }, [page])

  const fetchUsers = async page => {
    setLoading(true)
    try {
      const response = await apiClient.get(`/api/admin/getusers?page=${page}`)
      setUsers(prevUsers => [...prevUsers, ...response.data])
      setHasMore(response.data.length > 0)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  // Infinite Scroll Logic
  const lastUserRef = useRef()
  useEffect(() => {
    if (loading) return
    if (!hasMore) return
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
    if (lastUserRef.current) observer.observe(lastUserRef.current)
    return () => {
      if (lastUserRef.current) observer.unobserve(lastUserRef.current)
    }
  }, [loading, hasMore])

  const columns = [
    { label: 'Serial No.', field: 'serialNo' },
    { label: 'Name', field: 'username' },
    { label: 'email', field: 'email' }
  ]

  // Filtered Data
  const filteredData = users
    .filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((user, index) => ({
      serialNo: index + 1,
      username: (
        <div className='p-2 bg-purple-500'>
          {user.username || 'name not available'}
        </div>
      ),
      email: (
        <div className='p-2 bg-slate-500'>
          {user.email || 'phone number not available'}
        </div>
      )
    }))

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-semibold mb-4'>User Management</h1>
      <input
        type='text'
        placeholder='Search users...'
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className='mb-4 p-2 border rounded w-full'
      />
      <UsersTable columns={columns} data={filteredData} />
      {loading && <div>Loading...</div>}
      {hasMore && (
        <div ref={lastUserRef} className='text-center'>
          Loading more users...
        </div>
      )}
    </div>
  )
}

export default AdminUsers
