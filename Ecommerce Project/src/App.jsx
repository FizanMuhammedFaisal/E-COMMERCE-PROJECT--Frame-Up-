import { useState } from 'react'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserRoutes from './Routes/UserRoutes'
import AdminRoutes from './Routes/AdminRoutes'

const routes = [...UserRoutes, ...AdminRoutes]
const router = createBrowserRouter(routes)
function App() {
  return <RouterProvider router={router} />
}

export default App
