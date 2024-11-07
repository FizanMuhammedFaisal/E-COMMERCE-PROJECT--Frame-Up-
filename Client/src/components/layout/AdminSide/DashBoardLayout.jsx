import { useState } from 'react'
import Sidebar from '../../modals/DashBoardSidebar'
import { Outlet } from 'react-router-dom'
import Breadcrumb from '../../common/Breadcrumb'
import { Toaster } from 'sonner'

const DashboardLayout = () => {
  const [isCompact, setIsCompact] = useState(false)

  const handleSidebarCompact = compact => {
    setIsCompact(compact)
  }

  return (
    <div className='flex h-screen bg-gray-100   dark:bg-customP2BackgroundD_darkest font-primary'>
      <Sidebar setData={handleSidebarCompact} />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1  overflow-x-hidden overflow-y-auto'>
          <div
            className={`p-6 ${isCompact ? 'md:ml-28' : 'md:ml-72'} transition-all duration-300 ease-in-out`}
          >
            <Toaster
              position='top-right'
              toastOptions={{
                success: {
                  className:
                    'text-dark bg-green-500 shadow-lg rounded-lg px-4 py-3 font-medium',
                  duration: 4000
                },
                error: {
                  className:
                    'text-dark bg-red-500 shadow-lg rounded-lg px-4 py-3 font-medium',
                  duration: 4000
                },
                className:
                  'text-dark bg-customP2BackgroundW_700 dark:bg-customP2ForegroundD_200 shadow-lg rounded-lg px-4 py-3 font-medium'
              }}
            />

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
