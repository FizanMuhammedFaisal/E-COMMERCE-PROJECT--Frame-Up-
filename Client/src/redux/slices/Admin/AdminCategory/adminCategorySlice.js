import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../../../services/api/apiClient'

// Async action to post category data
export const addCategory = createAsyncThunk(
  'category/addCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        '/api/admin/add-category',
        categoryData
      )
      return response.data
    } catch (error) {
      // Handle error
      return rejectWithValue(error.response.data)
    }
  }
)

const adminCategorySlice = createSlice({
  name: 'adminCategorySlice',
  initialState: {
    loading: false,
    response: '',
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addCategory.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false
        state.response = action.payload
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})
export default adminCategorySlice.reducer
