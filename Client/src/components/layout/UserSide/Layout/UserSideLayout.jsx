import { Outlet } from 'react-router-dom'
import Navbar from '../../../common/Navbar'
import Footer from '../../../common/Footer'
import { Toaster } from 'sonner'

function AdminLayout() {
  return (
    <div className='admin-layout dark:text-slate-50'>
      <div className='pb-16'>
        <Navbar />
      </div>
      <Toaster
        position='bottom-right'
        toastOptions={{
          success: {
            className:
              'text-dark bg-green-500 shadow-lg rounded-lg px-4 py-3 font-medium',
            duration: 4000
          },
          error: {
            className:
              'toast-error text-dark bg-red-500 shadow-lg rounded-lg px-4 py-3 font-medium !important',
            duration: 4000
          },
          className: 'bg-white font-primary text-customColorTertiary'
        }}
        richColors
      />

      <Outlet />
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default AdminLayout
