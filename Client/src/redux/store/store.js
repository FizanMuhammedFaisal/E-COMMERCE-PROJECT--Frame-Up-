import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../slices/authSlice.js'
import adminActionsSlice from '../slices/adminActionsSlice.js'

const store = configureStore({
  reducer: {
    auth: authSlice,
    adminActions: adminActionsSlice
  }
})
export default store
