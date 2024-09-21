import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function AuthenticationRouter({ element }) {
  const { isAuthenticated, role } = useSelector(state => state.auth)
  console.log(isAuthenticated, role)
  if (isAuthenticated) {
    if (role === 'admin') {
      return <Navigate to='/dashboard' />
    } else {
      return <Navigate to='/' />
    }
  } else {
    return element
  }
}

export default AuthenticationRouter
