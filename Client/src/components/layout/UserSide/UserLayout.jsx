import React from 'react'
import Navbar from '../../common/Navbar'
import { Outlet } from 'react-router-dom'
import Breadcrumb from '../../common/Breadcrumb'
import { useSelector } from 'react-redux'

import { useFetchCart } from '../../../hooks/useFetchCart'

const UserLayout = () => {
  const { isAuthenticated, role } = useSelector(state => state.auth)
  useFetchCart()
  return (
    <>
      <div className='pb-3'>
        <Navbar />
      </div>

      <div className='mt-10'>
        <Breadcrumb />
      </div>

      <Outlet />
    </>
  )
}

export default UserLayout
