import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../../services/api/apiClient'

// Define async thunks for fetching data
export const fetchThemes = createAsyncThunk(
  'categories/fetchThemes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/admin/get-category-themes')
      console.log(response.data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchStyles = createAsyncThunk(
  'categories/fetchStyles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/admin/get-category-styles')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchTechniques = createAsyncThunk(
  'categories/fetchTechniques',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/admin/get-category-techniques')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    themes: {
      data: [],
      status: 'idle',
      error: null
    },
    styles: {
      data: [],
      status: 'idle',
      error: null
    },
    techniques: {
      data: [],
      status: 'idle',
      error: null
    }
  },
  reducers: {},
  extraReducers: builder => {
    // Themes
    builder
      .addCase(fetchThemes.pending, state => {
        state.themes.status = 'loading'
      })
      .addCase(fetchThemes.fulfilled, (state, action) => {
        state.themes.status = 'succeeded'
        state.themes.data = action.payload
      })
      .addCase(fetchThemes.rejected, (state, action) => {
        state.themes.status = 'failed'
        state.themes.error = action.payload
      })

    // Styles
    builder
      .addCase(fetchStyles.pending, state => {
        state.styles.status = 'loading'
      })
      .addCase(fetchStyles.fulfilled, (state, action) => {
        state.styles.status = 'succeeded'
        state.styles.data = action.payload
      })
      .addCase(fetchStyles.rejected, (state, action) => {
        state.styles.status = 'failed'
        state.styles.error = action.payload
      })

    // Techniques
    builder
      .addCase(fetchTechniques.pending, state => {
        state.techniques.status = 'loading'
      })
      .addCase(fetchTechniques.fulfilled, (state, action) => {
        state.techniques.status = 'succeeded'
        state.techniques.data = action.payload
      })
      .addCase(fetchTechniques.rejected, (state, action) => {
        state.techniques.status = 'failed'
        state.techniques.error = action.payload
      })
  }
})

export default categoriesSlice.reducer
