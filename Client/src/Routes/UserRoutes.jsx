import UserLoginPage from '../pages/UserSide/Login/UserLoginPage'
import UserSignUpPage from '../pages/UserSide/Signup/UserSignUpPage'
import HomePage from '../pages/UserSide/HomePage'
import GoogleAuthLoadingPage from '../pages/UserSide/GoogleAuthLoadingPage'
import AuthenticationRouter from '../utils/AuthenticationRouter'
import UserOTPPage from '../pages/UserSide/UserOTPPage'
import BrowsePage from '../pages/UserSide/BrowsePage'
import ProductDetailPage from '../pages/UserSide/ProductDetailPage'
import UserLayout from '../components/layout/UserSide/UserLayout'
import BlockedPage from '../pages/UserSide/BlockedUser/BlockedPage'
import ProtectedRoute from '../utils/ProtectedRoute'
import OtpProtectedRoute from '../utils/OtpProtectedRoute.jsx'
import ForgotPasswordPage from '../pages/UserSide/Login/ForgotPasswordPage'
import PasswordResetPage from '../pages/UserSide/Login/PasswordResetPage.jsx'
import PaintingListingPage from '../pages/UserSide/PaintingListingPage.jsx'

const UserRoutes = [
  {
    path: '/login',
    element: <AuthenticationRouter element={<UserLoginPage />} />
  },
  {
    path: '/login/forgot-password',
    element: <AuthenticationRouter element={<ForgotPasswordPage />} />
  },
  {
    path: '/reset-password',
    element: <PasswordResetPage />
  },
  {
    path: '/test',
    element: <GoogleAuthLoadingPage />
  },
  {
    path: '/signUp',
    element: <AuthenticationRouter element={<UserSignUpPage />} />
  },
  {
    path: '/send-otp',
    element: <OtpProtectedRoute element={<UserOTPPage />} />
  },
  {
    path: '/blocked',
    element: <BlockedPage />
  },
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        path: '', // Empty path means this is the index route for "/"
        element: <HomePage />
      },
      {
        path: 'all',
        element: <PaintingListingPage />
      },
      {
        path: 'products/:productId',
        element: <ProductDetailPage />
      }
    ]
  }
]

export default UserRoutes
