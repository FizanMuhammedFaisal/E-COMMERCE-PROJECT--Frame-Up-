import { Navigate } from 'react-router-dom'

const OtpProtectedRoute = ({ element }) => {
  const token = sessionStorage.getItem('x-timer')

  if (!token) {
    return <Navigate to='/login' />
  }

  return element
}

export default OtpProtectedRoute
