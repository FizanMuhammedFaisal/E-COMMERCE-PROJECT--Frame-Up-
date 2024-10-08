import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../../../services/api/apiClient'

// Define async thunks for fetching product discounts
export const fetchProductDiscounts = createAsyncThunk(
  'discounts/fetchProductDiscounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/admin/get-product-discounts')
      return response.data.result
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Define async thunks for fetching category discounts
export const fetchCategoryDiscounts = createAsyncThunk(
  'discounts/fetchCategoryDiscounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/admin/get-category-discounts')
      return response.data.result
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const adminDiscountSlice = createSlice({
  name: 'adminDiscounts',
  initialState: {
    productDiscounts: {
      data: [],
      status: 'idle',
      error: null
    },
    categoryDiscounts: {
      data: [],
      status: 'idle',
      error: null
    }
  },
  reducers: {
    updateDiscountStatus: (state, action) => {
      const { newStatus, type, id } = action.payload
      console.log(newStatus, type, id)
      const discounts = state[type]?.data

      if (discounts) {
        const item = discounts.find(item => item._id === id)

        if (item) {
          item.status = newStatus
        }
      }
    }
  },
  extraReducers: builder => {
    // Product Discounts
    builder
      .addCase(fetchProductDiscounts.pending, state => {
        state.productDiscounts.status = 'loading'
      })
      .addCase(fetchProductDiscounts.fulfilled, (state, action) => {
        state.productDiscounts.status = 'succeeded'
        state.productDiscounts.data = action.payload
      })
      .addCase(fetchProductDiscounts.rejected, (state, action) => {
        state.productDiscounts.status = 'failed'
        state.productDiscounts.error = action.payload
      })

    // Category Discounts
    builder
      .addCase(fetchCategoryDiscounts.pending, state => {
        state.categoryDiscounts.status = 'loading'
      })
      .addCase(fetchCategoryDiscounts.fulfilled, (state, action) => {
        state.categoryDiscounts.status = 'succeeded'
        state.categoryDiscounts.data = action.payload
      })
      .addCase(fetchCategoryDiscounts.rejected, (state, action) => {
        state.categoryDiscounts.status = 'failed'
        state.categoryDiscounts.error = action.payload
      })
  }
})

export default adminDiscountSlice.reducer
export const { updateDiscountStatus } = adminDiscountSlice.actions
