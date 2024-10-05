import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

const PaymentWrapper = () => {
  const { isAuthenticated, status, paymentValidated } = useSelector(
    state => state.auth
  )

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (isAuthenticated && status === 'Blocked') {
    return <Navigate to='/blocked' replace />
  }

  if (!paymentValidated) {
    return <Navigate to='/cart' replace />
  }
  return <Outlet />
}

export default PaymentWrapper
