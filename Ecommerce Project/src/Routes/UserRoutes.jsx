import UserLoginPage from '../pages/UserSide/UserLoginPage'
import UserSignUpPage from '../pages/UserSide/UserSignUpPage'
import HomePage from '../pages/UserSide/HomePage'
import GoogleAuthLoadingPage from '../pages/UserSide/GoogleAuthLoadingPage'
import AuthenticationRouter from '../utils/AuthenticationRouter'

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
    path: '/home',
    element: <HomePage />
  }
]

export default UserRoutes
