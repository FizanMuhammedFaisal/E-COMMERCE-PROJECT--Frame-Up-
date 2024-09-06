import { useState } from 'react'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserRoutes from './Routes/UserRoutes'
import AdminRoutes from './Routes/AdminRoutes'
import { ToastContainer } from 'react-toastify'

const routes = [...UserRoutes, ...AdminRoutes]
const router = createBrowserRouter(routes)
function App() {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  )
}

export default App
