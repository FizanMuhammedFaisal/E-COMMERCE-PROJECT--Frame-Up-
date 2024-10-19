import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom/dist'

const CheckoutWrapper = () => {
  const { isAuthenticated, status } = useSelector(state => state.auth)
  const { checkoutValidated } = useSelector(state => state.checkout)

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (isAuthenticated && status === 'Blocked') {
    return <Navigate to='/blocked' replace />
  }

  if (!checkoutValidated) {
    return <Navigate to='/cart' replace />
  }
  return <Outlet />
}

export default CheckoutWrapper
