import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../slices/authSlice.js'
import adminCategorySlice from '../slices/AdminCategory/adminCategorySlice.js'
import categoriesFetchSlice from '../slices/AdminCategory/categoriesFetchSlice.js'
import productSlice from '../slices/AdminProducts/productSlice.js'
import adminUsersSlice from '../slices/adminUsersSlice.js'
import adminProductsSlice from '../slices/AdminProducts/adminProductsSlice.js'

const store = configureStore({
  reducer: {
    auth: authSlice,
    adminUsers: adminUsersSlice,
    adminProducts: adminProductsSlice,
    adminCategory: adminCategorySlice,
    categoryFetch: categoriesFetchSlice,
    product: productSlice
  }
})
export default store
