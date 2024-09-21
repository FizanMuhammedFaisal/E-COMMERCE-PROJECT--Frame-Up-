import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ element, adminRoute = false }) => {
  const { isAuthenticated, status, role } = useSelector(state => state.auth)

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  // If user is blocked
  if (isAuthenticated && status === 'Blocked') {
    return <Navigate to='/blocked' replace />
  }

  // If it's an admin route but the user is not an admin, redirect to the home page
  if (adminRoute && role !== 'admin') {
    return <Navigate to='/' replace />
  }

  // If all checks pass, render the element (the protected component)
  return element
}

export default ProtectedRoute
