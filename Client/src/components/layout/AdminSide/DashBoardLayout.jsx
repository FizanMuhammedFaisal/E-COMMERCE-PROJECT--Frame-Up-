// src/components/AdminLayout.jsx
import React, { useState } from 'react'
import Sidebar from '../../modals/DashBoardSidebar'
import { Outlet } from 'react-router-dom'
import Breadcrumb from '../../common/Breadcrumb'
const DashboardLayout = data => {
  const [isCompact, setIsCompact] = useState(false)
  const handleset = data => {
    setIsCompact(data)
  }
  return (
    <div className='dark:bg-customP2BackgroundD_darkest '>
      <Sidebar setData={handleset} />
      {/* Main content area */}
      <div
        className={`flex-1 p-6 transition-all duration-700 ease-in-out mt-16 ${
          isCompact ? 'md:ml-24' : 'md:ml-80'
        } `}
      >
        {/* This will render the matching child route */}
        <Breadcrumb showHome={false} type='admin' />

        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
