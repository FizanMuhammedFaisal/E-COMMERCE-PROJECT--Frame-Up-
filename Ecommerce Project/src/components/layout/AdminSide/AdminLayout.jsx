import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../modals/DashBoardSidebar'

function AdminLayout() {
  return (
    <div className='admin-layout'>
      <Outlet /> {/* Renders the matched child route component */}
    </div>
  )
}

export default AdminLayout
