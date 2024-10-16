import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../../../services/api/apiClient'

export const fetchProductDiscounts = createAsyncThunk(
  'discounts/fetchProductDiscounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/admin/get-product-discounts')
      return response.data.discounts
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchCategoryDiscounts = createAsyncThunk(
  'discounts/fetchCategoryDiscounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/admin/get-category-discounts')
      return response.data.discounts
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const addDiscount = createAsyncThunk(
  'discounts/addDiscount',

  async (discountData, { rejectWithValue }) => {
    console.log(discountData)
    try {
      const response = await apiClient.post('/api/admin/add-discount', {
        discountData
      })
      return response.data.discount
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
    },
    addDiscountStatus: 'idle',
    addDiscountError: null
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

    // Add Discount
    builder
      .addCase(addDiscount.pending, state => {
        state.addDiscountStatus = 'loading'
      })
      .addCase(addDiscount.fulfilled, (state, action) => {
        state.addDiscountStatus = 'succeeded'
        // You can choose to push the newly added discount to either productDiscounts or categoryDiscounts based on its type
        const newDiscount = action.payload
        if (newDiscount.offerType === 'Products') {
          state.productDiscounts.data.push(newDiscount)
        } else if (newDiscount.offerType === 'Category') {
          state.categoryDiscounts.data.push(newDiscount)
        }
      })
      .addCase(addDiscount.rejected, (state, action) => {
        state.addDiscountStatus = 'failed'
        state.addDiscountError = action.payload
      })
  }
})

export default adminDiscountSlice.reducer
export const { updateDiscountStatus } = adminDiscountSlice.actions
