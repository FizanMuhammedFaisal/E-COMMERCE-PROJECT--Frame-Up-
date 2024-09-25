import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../slices/authSlice.js'
import adminCategorySlice from '../slices/Admin/AdminCategory/adminCategorySlice.js'
import categoriesFetchSlice from '../slices/Admin/AdminCategory/categoriesFetchSlice.js'
import productSlice from '../slices/Admin/AdminProducts/productSlice.js'
import adminUsersSlice from '../slices/adminUsersSlice.js'
import adminProductsSlice from '../slices/Admin/AdminProducts/adminProductsSlice.js'
import adminArtists from '../slices/Admin/AdminArtists/adminArtists.js'
import cartSlice from '../slices/Users/Cart/cartSlice.js'

const store = configureStore({
  reducer: {
    auth: authSlice,
    adminUsers: adminUsersSlice,
    adminProducts: adminProductsSlice,
    adminCategory: adminCategorySlice,
    categoryFetch: categoriesFetchSlice,
    product: productSlice,
    adminArtists: adminArtists,
    cart: cartSlice
  }
})
export default store
