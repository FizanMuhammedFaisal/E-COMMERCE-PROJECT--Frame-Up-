import axios from 'axios'
import { setUser } from '../../redux/slices/authSlice'
import store from '../../redux/store/store.js'
import api from './api.js'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
})
apiClient.interceptors.request.use(config => {
  const { accessToken } = store.getState().auth
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
    console.log('sending the reqq')
  }
  return config
})

apiClient.interceptors.response.use(
  response => {
    console.log('response was successful')
    if (response.data.token) {
      store.dispatch(setUser({ accessToken: response.data.token }))
    }
    return response
  },
  async error => {
    const originalRequest = error.config
    console.log('some error on response')
    // Check if the error is an authentication error
    if (error.response.status === 401) {
      try {
        const res = await api.get(
          '/api/users/access',
          {},
          { withCredentials: true }
        )
        const accessToken = res.data.token
        console.log(accessToken)

        if (accessToken) {
          store.dispatch(setUser({ accessToken }))

          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError)
        store.dispatch(setUser({ accessToken: null }))
      }
    }
    return Promise.reject(error)
  }
)
export default apiClient
