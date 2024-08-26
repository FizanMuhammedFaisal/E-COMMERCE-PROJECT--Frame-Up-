// src/components/AdminLayout.jsx
import React, { useState } from 'react'
import Sidebar from '../../modals/DashBoardSidebar'
import { Outlet } from 'react-router-dom'

const DashboardLayout = data => {
  const [isCompact, setIsCompact] = useState(false)
  const handleset = data => {
    setIsCompact(data)
    console.log(data)
  }
  return (
    <div className='dark:bg-customP2BackgroundD_darkest '>
      <Sidebar setData={handleset} />
      {/* Main content area */}
      <div
        className={`flex-1 p-6 transition-all duration-700 ease-in-out ${
          isCompact ? 'md:ml-24' : 'md:ml-80'
        } `}
      >
        {/* This will render the matching child route */}
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
