import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserRoutes from './Routes/UserRoutes'
import AdminRoutes from './Routes/AdminRoutes'
import { ToastContainer } from 'react-toastify'
import useSessionTimeout from './hooks/useSessionTimeout'
import SessionTimeoutOverlay from './components/common/SessionTimeoutOverlay'

const routes = [...UserRoutes, ...AdminRoutes]
const router = createBrowserRouter(routes)
function App() {
  const { sessionExpired } = useSessionTimeout() // custom hook for managing sessionTimeout
  return (
    <>
      {sessionExpired && <SessionTimeoutOverlay />}
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  )
}

export default App
