import { useState } from 'react'
import Sidebar from '../../modals/DashBoardSidebar'
import { Outlet } from 'react-router-dom'
import Breadcrumb from '../../common/Breadcrumb'

const DashboardLayout = () => {
  const [isCompact, setIsCompact] = useState(false)

  const handleSidebarCompact = compact => {
    setIsCompact(compact)
  }

  return (
    <div className='flex h-screen bg-gray-100 dark:bg-customP2BackgroundD_darkest font-primary'>
      <Sidebar setData={handleSidebarCompact} />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-x-hidden overflow-y-auto'>
          <div
            className={`p-6 ${isCompact ? 'md:ml-28' : 'md:ml-72'} transition-all duration-300 ease-in-out`}
          >
            <div className='mt-14'>
              <Breadcrumb showHome={false} type='admin' />
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
