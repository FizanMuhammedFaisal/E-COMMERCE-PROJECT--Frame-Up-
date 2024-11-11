import UserLoginPage from '../pages/UserSide/Login/UserLoginPage'
import UserSignUpPage from '../pages/UserSide/Signup/UserSignUpPage'
import HomePage from '../pages/UserSide/Home/HomePage.jsx'
import AuthenticationRouter from '../utils/AuthenticationRouter'
import UserOTPPage from '../pages/UserSide/OTP/UserOTPPage.jsx'
import UserLayout from '../components/layout/UserSide/UserLayout'
import BlockedPage from '../pages/UserSide/BlockedUser/BlockedPage'
import ProtectedRoute from '../utils/ProtectedRoute'
import OtpProtectedRoute from '../utils/OtpProtectedRoute.jsx'
import ForgotPasswordPage from '../pages/UserSide/Login/ForgotPasswordPage'
import PasswordResetPage from '../pages/UserSide/Login/PasswordResetPage.jsx'
import ProductBrowsePage from '../pages/UserSide/ProductsBrowse/ProductBrowsePage.jsx'
import ProductDetailPage from '../pages/UserSide/ProductsBrowse/ProductDetailPage.jsx'
import CartPage from '../pages/UserSide/Cart/CartPage.jsx'
import AccountPage from '../pages/UserSide/Account/AccountPage.jsx'
import CheckoutPage from '../pages/UserSide/Checkout/CheckoutPage.jsx'
import CheckoutWrapper from '../utils/CheckoutWrapper.jsx'
import PaymentWrapper from '../utils/PaymentWrapper.jsx'
import OrderConfirmationWrapper from '../utils/OrderConfirmationWrapper.jsx'
import PaymentPage from '../pages/UserSide/Payment/PaymentPage.jsx'
import OrderConfirmedPage from '../pages/UserSide/Payment/OrderConfirmedPage.jsx'
import WishlistPage from '../pages/UserSide/Wishlist/WishlistPage.jsx'
import ArtistsBrowsePage from '../pages/UserSide/Artists/ArtistsBrowsePage.jsx'
import ArtistDetailsPage from '../pages/UserSide/Artists/ArtistDetailsPage.jsx'
import OrderDetails from '../pages/UserSide/Account/OrderDetails.jsx'
import SetUpPage from '../pages/UserSide/Signup/SetUpPage.jsx'
import NotFound from '../pages/UserSide/NotFound/NotFound.jsx'
import UserSideLayout from '../components/layout/UserSide/Layout/UserSideLayout.jsx'
const UserRoutes = [
  {
    path: '',
    element: <UserSideLayout />,
    children: [
      {
        path: '/login',
        element: <AuthenticationRouter element={<UserLoginPage />} />
      },
      {
        path: '/login/forgot-password',
        element: <ForgotPasswordPage />
      },
      {
        path: '/reset-password',
        element: <PasswordResetPage />
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
        path: '/set-up',
        element: <SetUpPage />
      },

      {
        path: '/',
        element: <UserLayout />,
        children: [
          {
            path: '',
            element: <HomePage />
          },
          {
            path: 'all',
            element: <ProductBrowsePage />
          },
          {
            path: 'all/:productId',
            element: <ProductDetailPage />
          },
          {
            path: 'cart',
            element: <CartPage />
          },
          {
            path: 'wishlist',
            element: <WishlistPage />
          },
          {
            path: 'artists',
            element: <ArtistsBrowsePage />
          },
          {
            path: 'artists/:id',
            element: <ArtistDetailsPage />
          },

          {
            path: 'account',
            element: <ProtectedRoute element={<AccountPage />} />
          },
          {
            path: 'account/:routes',
            element: <ProtectedRoute element={<AccountPage />} />
          },
          {
            path: 'account/order-history/:id',
            element: <ProtectedRoute element={<OrderDetails />} />
          },
          {
            path: 'order-confirmed',
            element: <OrderConfirmationWrapper />,
            children: [
              {
                path: '',
                element: <OrderConfirmedPage />
              }
            ]
          }
        ]
      },
      {
        path: '/checkout',
        element: <CheckoutWrapper />,
        children: [
          {
            path: '',
            element: <CheckoutPage />
          },
          {
            path: 'payment',
            element: <PaymentWrapper />,
            children: [
              {
                path: '',
                element: <PaymentPage />
              }
            ]
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  {
    path: '/blocked',
    element: <BlockedPage />
  }
]

export default UserRoutes
