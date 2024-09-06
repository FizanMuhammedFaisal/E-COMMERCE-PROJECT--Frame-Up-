import React from 'react'
import Navbar from '../../components/common/Navbar'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/api/apiClient'
function HomePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    dispatch(logoutUser())
    console.log('logged out')
    navigate('/login')
  }
  const handleCall = async () => {
    try {
      const res = await apiClient.get('api/users/hi')
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Navbar />
      <button
        onClick={() => {
          handleLogout()
        }}
      >
        Logout
      </button>
      <button onClick={handleCall}>hey click</button>
    </>
  )
}

export default HomePage
