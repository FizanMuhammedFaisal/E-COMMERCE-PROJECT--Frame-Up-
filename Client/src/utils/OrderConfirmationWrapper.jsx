import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom/dist'

const OrderConfirmationWrapper = () => {
  const { isAuthenticated, status } = useSelector(state => state.auth)
  const { orderConfirmed } = useSelector(state => state.checkout)

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (isAuthenticated && status === 'Blocked') {
    return <Navigate to='/blocked' replace />
  }

  if (!orderConfirmed) {
    return <Navigate to='/cart' replace />
  }
  return <Outlet />
}

export default OrderConfirmationWrapper
