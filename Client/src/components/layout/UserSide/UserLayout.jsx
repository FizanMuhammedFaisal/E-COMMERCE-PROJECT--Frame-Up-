import { Navigate, Outlet } from 'react-router-dom'

import { useSelector } from 'react-redux'

import { useFetchCart } from '../../../hooks/useFetchCart'
import { useFetchWishlist } from '../../../hooks/useFetchWishlist'
import { useScrollToTop } from '../../../hooks/useScrollToTop'

const UserLayout = () => {
  const { isAuthenticated, status } = useSelector(state => state.auth)
  useScrollToTop()
  useFetchCart()
  useFetchWishlist()
  if (isAuthenticated && status === 'Blocked') {
    return <Navigate to='/blocked' replace />
  }
  return (
    <>
      <Outlet />
    </>
  )
}

export default UserLayout
