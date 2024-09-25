import React from 'react'
import AdminLoginPage from '../pages/AdminSide/AdminLoginPage'
import AdminLayout from '../components/layout/AdminSide/AdminLayout'
import AuthenticationRouter from '../utils/AuthenticationRouter'
import ProtectedRoute from '../utils/ProtectedRoute'
import { ThemeProvider } from '../context/ThemeContext'
import AdminDashboard from '../pages/AdminSide/AdminDashboard'
import AdminProducts from '../pages/AdminSide/Products/AdminProducts'
import AdminUsers from '../pages/AdminSide/Users/AdminUsers'
import DashboardLayout from '../components/layout/AdminSide/DashBoardLayout'
import AdminAddProducts from '../pages/AdminSide/AdminAddProducts'
import AdminOrders from '../pages/AdminSide/AdminOrders'
import AdminCategory from '../pages/AdminSide/Categories/AdminCategories'
import AdminSalesReport from '../pages/AdminSide/AdminSalesReport'
import AddCategoriesPage from '../pages/AdminSide/Categories/AddCategoriesPage'
import ProductEditPage from '../pages/AdminSide/Products/ProductEditPage'
import AdminArtists from '../pages/AdminSide/Artists/AdminArtists'
import AddArtists from '../pages/AdminSide/Artists/AddArtists'
const AdminRoutes = [
  {
    path: '/admin/login',
    element: <AuthenticationRouter element={<AdminLoginPage />} />
  },
  {
    path: '',
    element: (
      <ThemeProvider>
        <AdminLayout />
      </ThemeProvider>
    ),
    children: [
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute element={<DashboardLayout />} adminRoute={true} />
        ),
        children: [
          {
            path: '',
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
            path: 'artists',
            element: <AdminArtists />
          },
          {
            path: 'artists/add-artists',
            element: <AddArtists />
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
            path: 'category/add-categories',
            element: <AddCategoriesPage />
          },
          {
            path: 'sales-report',
            element: <AdminSalesReport />
          },
          {
            path: 'products/:productId',
            element: <ProductEditPage />
          }
        ]
      }
    ]
  }
]

export default AdminRoutes
