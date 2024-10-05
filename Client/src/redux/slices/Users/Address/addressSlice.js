import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedAddressId: null
}

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setSelectedAddressRedux: (state, action) => {
      state.selectedAddressId = action.payload
    },
    clearSelectedAddress: state => {
      state.selectedAddressId = null
    }
  }
})

export const { setSelectedAddressRedux, clearSelectedAddress } =
  addressSlice.actions

export default addressSlice.reducer
