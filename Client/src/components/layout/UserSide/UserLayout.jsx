import { useEffect } from 'react'
import Navbar from '../../common/Navbar'
import { Outlet, useLocation } from 'react-router-dom'

import { useSelector } from 'react-redux'

import { useFetchCart } from '../../../hooks/useFetchCart'
import { useScrollToTop } from '../../../hooks/useScrollToTop'

const UserLayout = () => {
  const { isAuthenticated, role } = useSelector(state => state.auth)

  useScrollToTop()
  useFetchCart()
  return (
    <>
      <div className='pb-16'>
        <Navbar />
      </div>

      <Outlet />
    </>
  )
}

export default UserLayout
