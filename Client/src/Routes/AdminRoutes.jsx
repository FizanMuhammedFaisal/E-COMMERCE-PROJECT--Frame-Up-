import React from 'react'
import AdminLoginPage from '../pages/AdminSide/AdminLoginPage'
import AdminLayout from '../components/layout/AdminSide/AdminLayout'
import AuthenticationRouter from '../utils/AuthenticationRouter'
import ProtectionRouter from '../utils/ProtectionRouter'
import { ThemeProvider } from '../context/ThemeContext'
import AdminDashboard from '../pages/AdminSide/AdminDashboard'
import AdminProducts from '../pages/AdminSide/AdminProducts'
import AdminUsers from '../pages/AdminSide/AdminUsers'
import DashboardLayout from '../components/layout/AdminSide/DashBoardLayout'
import AdminAddProducts from '../pages/AdminSide/AdminAddProducts'
import AdminOrders from '../pages/AdminSide/AdminOrders'
import AdminCategory from '../pages/AdminSide/AdminCategory'
import AdminSalesReport from '../pages/AdminSide/AdminSalesReport'
const AdminRoutes = [
  {
    path: '/admin',
    element: (
      <ThemeProvider>
        <AdminLayout />
      </ThemeProvider>
    ),
    children: [
      {
        path: 'login',
        element: <AuthenticationRouter element={<AdminLoginPage />} />
      },
      {
        path: '',
        element: <ProtectionRouter element={<DashboardLayout />} />,
        children: [
          {
            path: 'dashboard', // Default route for dashboard
            element: <AdminDashboard />
          },
          {
            path: 'products',
            element: <AdminProducts />
          },
          {
            path: 'users',
            element: <AdminUsers />
          },
          {
            path: 'add-products',
            element: <AdminAddProducts />
          },
          {
            path: 'orders',
            element: <AdminOrders />
          },
          {
            path: 'category',
            element: <AdminCategory />
          },
          {
            path: 'sales-report',
            element: <AdminSalesReport />
          }
        ]
      }
    ]
  }
]

export default AdminRoutes
