import { useState } from 'react'

import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserRoutes from './Routes/UserRoutes'

const routes = [...UserRoutes]
const router = createBrowserRouter(routes)
function App() {
  return <RouterProvider router={router} />
}

export default App
