import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../modals/DashBoardSidebar'
import { ToastContainer } from 'react-toastify'

function AdminLayout() {
  return (
    <div className='admin-layout dark:text-slate-50'>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Outlet /> {/* Renders the matched child route component */}
    </div>
  )
}

export default AdminLayout
