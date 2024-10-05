// src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../../../services/api/apiClient'

// Fetch products action
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async page => {
    const response = await apiClient.get(
      `/api/products/get-products-admin?page=${page}`
    )
    return response.data
  }
)
export const updateProductStatus = createAsyncThunk(
  'users/ProductStatus',
  async ({ id, status }) => {
    const response = await apiClient.put(`/api/products/${id}/status`, {
      status
    })

    return { id, status }
  }
)
// Product slice
const adminProductsSlice = createSlice({
  name: 'products',
  initialState: {
    data: [],
    status: 'idle',
    loading: false,
    error: null,
    page: 1,
    hasMore: true
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload || state.page + 1
    },
    deleteData: (state, action) => {
      state.data = []
      state.page = 1
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.status = 'succeeded'
        const newProducts = action.payload.products.filter(
          product =>
            !state.data.some(
              existingProduct => existingProduct._id === product._id
            )
        )
        state.data = [...state.data, ...newProducts]

        state.hasMore = action.payload.products.length >= 10
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.loading = false
        state.error = action.error.message
      })
      /// handling the upadte of the state
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload
        const user = state.data.find(product => product._id === id)
        if (user) {
          user.status = status
        }
      })
  }
})

export const { setPage, deleteData } = adminProductsSlice.actions
export default adminProductsSlice.reducer
