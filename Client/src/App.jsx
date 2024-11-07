import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration
} from 'react-router-dom'
import UserRoutes from './Routes/UserRoutes'
import AdminRoutes from './Routes/AdminRoutes'

import useSessionTimeout from './hooks/useSessionTimeout'
import SessionTimeoutOverlay from './components/common/SessionTimeoutOverlay'
import useAuthInit from './hooks/useAuthInit'
import Spinner from './components/common/Animations/Spinner'

const routes = [...UserRoutes, ...AdminRoutes]
const router = createBrowserRouter(routes)
function App() {
  const { authReady } = useAuthInit()
  const { sessionExpired } = useSessionTimeout() // custom hook for managing sessionTimeout

  if (!authReady) {
    return <Spinner center={true} />
  }
  return (
    <>
      {sessionExpired && <SessionTimeoutOverlay />}
      <RouterProvider router={router}>
        <ScrollRestoration />
      </RouterProvider>
    </>
  )
}

export default App
