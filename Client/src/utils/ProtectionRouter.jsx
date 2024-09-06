import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function AuthenticationRouter({ element }) {
  const { isAuthenticated, role } = useSelector(state => state.auth)

  if (isAuthenticated) {
    return element
  }

  // Handle redirection based on role
  if (role === 'admin') {
    return <Navigate to='/admin/login' />
  } else if (role === 'user') {
    return <Navigate to='/login' />
  } else {
    // Default redirection for unexpected roles or unauthenticated state
    return <Navigate to='/login' />
  }
}

export default AuthenticationRouter
