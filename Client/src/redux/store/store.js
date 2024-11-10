import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../slices/authSlice.js'
import adminCategorySlice from '../slices/Admin/AdminCategory/adminCategorySlice.js'
import categoriesFetchSlice from '../slices/Admin/AdminCategory/categoriesFetchSlice.js'
import productSlice from '../slices/Admin/AdminProducts/productSlice.js'
import adminUsersSlice from '../slices/adminUsersSlice.js'
import adminProductsSlice from '../slices/Admin/AdminProducts/adminProductsSlice.js'
import adminArtists from '../slices/Admin/AdminArtists/adminArtists.js'
import cartSlice from '../slices/Users/Cart/cartSlice.js'
import addressSlice from '../slices/Users/Address/addressSlice.js'
import adminDiscountSlice from '../slices/Admin/AdminDiscount/adminDiscountSlice.js'
import checkoutSlice from '../slices/Users/Checkout/checkoutSlice.js'
import wishlistSlice from '../slices/Users/Wishlist/wishlistSlice.js'

const store = configureStore({
  reducer: {
    auth: authSlice,
    adminUsers: adminUsersSlice,
    adminProducts: adminProductsSlice,
    adminCategory: adminCategorySlice,
    categoryFetch: categoriesFetchSlice,
    adminArtists: adminArtists,
    adminDiscount: adminDiscountSlice,
    product: productSlice,
    cart: cartSlice,
    address: addressSlice,
    checkout: checkoutSlice,
    wishlist: wishlistSlice
  }
})
export default store
