import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../services/api/apiClient'
// for fetching userdata on users page on dashboard
export const fetchUsers = createAsyncThunk('users/fetchUsers', async page => {
  const response = await apiClient.get(
    `/api/admin/getusers?page=${page}&limit=15`
  )
  console.log(response)
  return response.data
})

//
//for updating the status of the users
export const updateUserStatus = createAsyncThunk(
  'users/updateStatus',
  async ({ id, status }) => {
    const response = await apiClient.put(`/api/admin/users/${id}/status`, {
      status
    })
    return { id, status }
  }
)

//// ________________________________________________________///////
const adminUsersSlice = createSlice({
  name: 'adminActionsSlice',
  initialState: {
    data: [],
    status: 'idle', // can be  success and faliled
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
      .addCase(fetchUsers.pending, state => {
        state.loading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.status = 'succeeded'
        const newUsers = action.payload.filter(
          user =>
            !state.data.some(existingUser => existingUser._id === user._id)
        )
        state.data = [...state.data, ...newUsers]
        state.hasMore = action.payload.length >= 10
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.loading = false
        state.error = action.error.message
      })
      /// handling the upadte of the state
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload
        const user = state.data.find(user => user._id === id)
        if (user) {
          user.status = status
        }
      })
  }
})
export default adminUsersSlice.reducer
export const { setPage } = adminUsersSlice.actions
