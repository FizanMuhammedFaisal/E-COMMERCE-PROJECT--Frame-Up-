import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    user: null,
    isAuthenticated: false,
    role: null,
    status: null,
    checkoutValidated: false,
    paymentValidated: false,
    orderConfirmed: false
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
    },
    validateChekout: state => {
      state.checkoutValidated = true
    },
    validatePayment: state => {
      state.paymentValidated = true
    },
    validateOrder: state => {
      state.orderConfirmed = true
    },
    clearValidations: state => {
      state.paymentValidated = false
      state.checkoutValidated = false
    },
    clearValidateOrder: state => {
      state.orderConfirmed = false
    }
  }
})

export default authSlice.reducer
export const {
  setUser,
  logoutUser,
  validateChekout,
  validatePayment,
  clearValidations,
  validateOrder
} = authSlice.actions
