import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../../../services/api/apiClient'

const initialState = {
  userId: null,
  items: [],
  subtotal: 0,
  totalPrice: 0,
  updatedAt: '',
  discount: 0,
  status: 'active',
  loading: false,
  error: null
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await apiClient.get('/api/cart')
  return response.data
})

const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
    setCart: (state, action) => {
      const { userId, items, subtotal, totalPrice, discount, updatedAt } =
        action.payload
      state.userId = userId
      state.items = items
      state.subtotal = subtotal
      state.totalPrice = totalPrice
      state.discount = discount
      state.updatedAt = updatedAt
    },

    addToCartd: (state, action) => {
      const items = action.payload
      console.log(items)
      state.items = items
      // Recalculate subtotal and total price
      state.subtotal = calculateSubtotal(state.items)
      state.totalPrice = calculateTotalPrice(state.items, state.discount)
    },
    // Decrement the quantity of a product in the cart
    updateQuantity: (state, action) => {
      const { productId, quantity = 0 } = action.payload
      console.log(productId, quantity)
      console.log(action.payload)
      const existingProduct = state.items.find(
        item => item.productId === productId
      )

      if (existingProduct) {
        existingProduct.quantity = quantity
        // Remove the product if quantity reaches zero
        // if (existingProduct.quantity <= 0) {
        //   state.items = state.items.filter(item => item.productId !== productId)
        // }
      }
      // Recalculate subtotal and total price
      state.subtotal = calculateSubtotal(state.items)
      state.totalPrice = calculateTotalPrice(state.items, state.discount)
    },
    applyCoupon: (state, action) => {
      const { discount } = action.payload
      state.discount += discount
      state.subtotal = calculateSubtotal(state.items)
      state.totalPrice = calculateTotalPrice(state.items, state.discount)
    },

    removeItemFromCart: (state, action) => {
      const { productId } = action.payload
      state.items = state.items.filter(item => item.productId !== productId)
      // Recalculate subtotal and total price
      state.subtotal = calculateSubtotal(state.items)
      state.totalPrice = calculateTotalPrice(state.items, state.discount)
    },
    clearCart: state => {
      state.items = []
      state.subtotal = 0
      state.totalPrice = 0
      state.discount = 0
    }
    // applyDiscount: (state, action) => {
    //   // state.discount = action.payload
    //   // state.totalPrice = calculateTotalPrice(state.items, state.discount)
    // }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.loading = true
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.userId = action.payload.userId
        state.items = action.payload.items
        state.subtotal = action.payload.subtotal
        state.totalPrice = action.payload.totalPrice
        state.discount = action.payload.discount
        state.updatedAt = action.payload.updatedAt
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

const calculateSubtotal = items => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

const calculateTotalPrice = (items, discount) => {
  const subtotal = calculateSubtotal(items)
  return subtotal - discount
}

export const {
  setCart,
  addToCartd,
  updateQuantity,
  removeItemFromCart,
  clearCart,
  applyCoupon
} = cartSlice.actions

export default cartSlice.reducer
