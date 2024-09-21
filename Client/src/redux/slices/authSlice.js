import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    user: null,
    isAuthenticated: false,
    role: null,
    status: 'blocked'
  },
  reducers: {
    setUser: (state, action) => {
      console.log(action.payload)
      state.user = action.payload.user
      state.isAuthenticated = !!localStorage.getItem('accessToken')
      state.role = action.payload.role
      state.status = action.payload.status
    },
    logoutUser: state => {
      state.user = null
      state.isAuthenticated = !!localStorage.getItem('accessToken')
      state.role = null
    }
  }
})

export default authSlice.reducer
export const { setUser, logoutUser } = authSlice.actions
