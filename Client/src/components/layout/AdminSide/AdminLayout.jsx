import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

function AdminLayout() {
  return (
    <div className='admin-layout  dark:text-slate-50'>
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
            'bg-white dark:bg-customP2ForegroundD_400 font-primary dark:text-white'
        }}
      />
      <Outlet /> {/* Renders the matched child route component */}
    </div>
  )
}

export default AdminLayout
