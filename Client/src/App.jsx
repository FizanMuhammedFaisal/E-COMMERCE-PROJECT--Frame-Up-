import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserRoutes from './Routes/UserRoutes'
import AdminRoutes from './Routes/AdminRoutes'
import { ToastContainer } from 'react-toastify'
import useSessionTimeout from './hooks/useSessionTimeout'
import SessionTimeoutOverlay from './components/common/SessionTimeoutOverlay'
import useAuthInit from './hooks/useAuthInit'
import { CircularProgress } from '@mui/material'
import Spinner from './components/common/Animations/Spinner'

const routes = [...UserRoutes, ...AdminRoutes]
const router = createBrowserRouter(routes)

function App() {
  const { authReady } = useAuthInit()
  const { sessionExpired } = useSessionTimeout() // custom hook for managing sessionTimeout
  if (!authReady) {
    return <Spinner />
  }
  return (
    <>
      {sessionExpired && <SessionTimeoutOverlay />}
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  )
}

export default App
