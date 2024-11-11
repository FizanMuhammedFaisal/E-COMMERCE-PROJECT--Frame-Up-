import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: []
  },
  reducers: {
    addToWishlist: (state, action) => {
      const itemIds = Array.isArray(action.payload)
        ? action.payload
        : [action.payload]
      itemIds.forEach(itemId => {
        console.log(itemId)
        if (!state.items.includes(itemId)) {
          state.items.push(itemId)
        }
      })
    },
    addItemsToWishlist: (state, action) => {
      const itemIds = Array.isArray(action.payload)
        ? action.payload
        : [action.payload]
      console.log(itemIds)
      itemIds.forEach(itemId => {
        console.log(itemId)
        if (!state.items.includes(itemId._id)) {
          state.items.push(itemId._id)
        }
      })
    },
    removeFromWishlist: (state, action) => {
      const itemId = action.payload
      state.items = state.items.filter(id => id !== itemId)
    },
    clearWishlist: state => {
      state.items = []
    }
  }
})

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  addItemsToWishlist
} = wishlistSlice.actions
export default wishlistSlice.reducer
