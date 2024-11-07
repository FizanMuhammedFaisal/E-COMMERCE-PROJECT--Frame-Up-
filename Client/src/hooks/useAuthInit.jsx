import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/slices/authSlice'
import api from '../services/api/api'

const useAuthInit = () => {
  const dispatch = useDispatch()
  const [authReady, setAuthReady] = useState(false)
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await api.get('/users/access', {
          withCredentials: true
        })
        const data = {
          user: response.data.user,
          role: response.data.role,
          status: response.data.status,
          accessToken: response.data.accessToken
        }
        dispatch(setUser(data))
      } catch (error) {
        console.error('Failed to refresh access token', error)
      } finally {
        setAuthReady(true)
      }
    }

    refreshAccessToken()
  }, [dispatch])
  return { authReady }
}

export default useAuthInit
