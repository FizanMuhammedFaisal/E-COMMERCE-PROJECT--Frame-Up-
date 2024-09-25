import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../../../services/api/apiClient'

// Fetching artists for AdminArtists page
export const fetchArtists = createAsyncThunk(
  'artists/fetchArtists',
  async page => {
    const response = await apiClient.get(
      `/api/artists/getartists?page=${page}&limit=17`
    )
    return response.data
  }
)

// Updating the status of an artist
export const updateArtistStatus = createAsyncThunk(
  'artists/updateStatus',
  async ({ id, status }) => {
    const response = await apiClient.put(`/api/admin/artists/${id}/status`, {
      status
    })
    return { id, status }
  }
)

const adminArtistsSlice = createSlice({
  name: 'adminArtists',
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
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchArtists.pending, state => {
        state.loading = true
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.loading = false
        state.status = 'succeeded'
        const newArtists = action.payload.filter(
          artist =>
            !state.data.some(
              existingArtist => existingArtist._id === artist._id
            )
        )
        state.data = [...state.data, ...newArtists]
        state.hasMore = action.payload.length >= 10
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.status = 'failed'
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateArtistStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload
        const artist = state.data.find(artist => artist._id === id)
        if (artist) {
          artist.status = status
        }
      })
  }
})

export default adminArtistsSlice.reducer
export const { setPage } = adminArtistsSlice.actions
