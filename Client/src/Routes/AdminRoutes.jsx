import AdminLoginPage from '../pages/AdminSide/AdminLoginPage'
import AdminLayout from '../components/layout/AdminSide/AdminLayout'
import AuthenticationRouter from '../utils/AuthenticationRouter'
import ProtectedRoute from '../utils/ProtectedRoute'
import { ThemeProvider } from '../context/ThemeContext'
import AdminDashboard from '../pages/AdminSide/Dashboard/AdminDashboard'
import BestSellers from '../pages/AdminSide/Dashboard/BestSellers'
import AdminProducts from '../pages/AdminSide/Products/AdminProducts'
import AdminUsers from '../pages/AdminSide/Users/AdminUsers'
import DashboardLayout from '../components/layout/AdminSide/DashBoardLayout'
import AdminAddProducts from '../pages/AdminSide/AdminAddProducts'
import AdminOrders from '../pages/AdminSide/Orders/AdminOrders'
import AdminCategory from '../pages/AdminSide/Categories/AdminCategories'
import AdminSalesReport from '../pages/AdminSide/AdminSalesReport'
import AddCategoriesPage from '../pages/AdminSide/Categories/AddCategoriesPage'
import ProductEditPage from '../pages/AdminSide/Products/ProductEditPage'
import AdminArtists from '../pages/AdminSide/Artists/AdminArtists'
import AddArtists from '../pages/AdminSide/Artists/AddArtists'
import OrdersEditPage from '../pages/AdminSide/Orders/OrdersEditPage'
import AdminDiscountPage from '../pages/AdminSide/Discounts/AdminDiscountPage'
import AddDiscountPage from '../pages/AdminSide/Discounts/AddDiscountPage'
import AdminCouponsPage from '../pages/AdminSide/Coupons/AdminCouponsPage'
import AddCouponsPage from '../pages/AdminSide/Coupons/AddCouponsPage'

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
            path: 'best-sellers',
            element: <BestSellers />
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
            path: 'orders/:orderId',
            element: <OrdersEditPage />
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
            path: 'products/:productId',
            element: <ProductEditPage />
          },
          {
            path: 'discounts',
            element: <AdminDiscountPage />
          },
          {
            path: 'discounts/add',
            element: <AddDiscountPage />
          },

          {
            path: 'coupons',
            element: <AdminCouponsPage />
          },
          {
            path: 'coupons/add-coupons',
            element: <AddCouponsPage />
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
