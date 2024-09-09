import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../slices/authSlice.js'
import adminActionsSlice from '../slices/adminActionsSlice.js'
import adminCategorySlice from '../slices/AdminCategory/adminCategorySlice.js'
import categoriesFetchSlice from '../slices/AdminCategory/categoriesFetchSlice.js'

const store = configureStore({
  reducer: {
    auth: authSlice,
    adminActions: adminActionsSlice,
    adminCategory: adminCategorySlice,
    categoryFetch: categoriesFetchSlice
  }
})
export default store
