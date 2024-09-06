import UserLoginPage from '../pages/UserSide/Login/UserLoginPage'
import UserSignUpPage from '../pages/UserSide/Signup/UserSignUpPage'
import HomePage from '../pages/UserSide/HomePage'
import GoogleAuthLoadingPage from '../pages/UserSide/GoogleAuthLoadingPage'
import AuthenticationRouter from '../utils/AuthenticationRouter'
import UserOTPPage from '../pages/UserSide/UserOTPPage'

const UserRoutes = [
  {
    path: '/login',
    element: <AuthenticationRouter element={<UserLoginPage />} />
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
    element: <AuthenticationRouter element={<UserOTPPage />} />
  },
  {
    path: '/',
    element: <HomePage />
  }
]

export default UserRoutes
