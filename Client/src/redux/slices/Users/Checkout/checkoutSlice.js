import { createSlice } from '@reduxjs/toolkit'

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    checkoutValidated: false,
    paymentValidated: false,
    orderConfirmed: false
  },
  reducers: {
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
export default checkoutSlice.reducer
export const {
  validateChekout,
  validateOrder,
  validatePayment,
  clearValidateOrder,
  clearValidations
} = checkoutSlice.actions
