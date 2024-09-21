import React from 'react'
import Navbar from '../../common/Navbar'
import { Outlet } from 'react-router-dom'
import Breadcrumb from '../../common/Breadcrumb'
import { useSelector } from 'react-redux'

const UserLayout = () => {
  const { isAuthenticated, role } = useSelector(state => state.auth)

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <Outlet />
    </>
  )
}

export default UserLayout
