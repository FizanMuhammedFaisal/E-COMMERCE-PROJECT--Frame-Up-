import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
})
apiClient.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
    console.log('sending the reqq')
  }
  return config
})

apiClient.interceptors.response.use(
  response => {
    console.log('response was successfull')
    if (response.data.token) {
      localStorage.setItem('accessToken', response.data.token)
    }

    return response
  },
  async error => {
    const originalRequest = error.config
    console.log('some error on response')
    // Check if the error is an authentication error
    if (error.response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken')
      console.log(refreshToken)
      if (refreshToken) {
        try {
          const res = await apiClient.post('/api/users/access', {
            token: refreshToken
          })
          const accessToken = res.data.token

          if (accessToken) {
            // Save the new access token in localStorage and retry original request
            // localStorage.setItem('accessToken', accessToken)
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return apiClient(originalRequest)
          }
        } catch (refreshError) {
          console.error('Refresh token error:', refreshError)
        }
      } else {
        console.error('refresh token is not present or expired', refreshToken)
      }
    }
    return Promise.reject(error)
  }
)
export default apiClient
