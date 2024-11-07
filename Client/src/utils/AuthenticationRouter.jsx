import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

function AuthenticationRouter({ element }) {
  const { isAuthenticated, role } = useSelector(state => state.auth)
  const location = useLocation()
  const from = location.state?.from || '/'
  if (isAuthenticated) {
    if (role === 'admin') {
      return <Navigate to='/dashboard' />
    } else {
      return <Navigate to={from} />
    }
  } else {
    return element
  }
}

export default AuthenticationRouter
