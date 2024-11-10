import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    role: null,
    status: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isAuthenticated = !!action.payload.accessToken
      state.role = action.payload.role
      state.status = action.payload.status
    },
    logoutUser: state => {
      state.user = null
      state.isAuthenticated = false
      state.accessToken = null
      state.role = null
    }
  }
})

export default authSlice.reducer
export const { setUser, logoutUser } = authSlice.actions
