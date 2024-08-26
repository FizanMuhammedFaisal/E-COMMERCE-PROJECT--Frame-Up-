import React from 'react'
import Navbar from '../../components/common/Navbar'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
function HomePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    dispatch(logoutUser())
    console.log('logged out')
    navigate('/login')
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
    </>
  )
}

export default HomePage
