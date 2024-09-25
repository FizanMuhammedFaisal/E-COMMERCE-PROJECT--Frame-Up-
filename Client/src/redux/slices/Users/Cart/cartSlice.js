import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../../../services/api/apiClient'

const cartSlice = createSlice({
  name: 'cartSlice',
  initialState: {
    data: [
      {
        id: 1,
        name: 'Beautiful Landscape Painting',
        image: 'https://via.placeholder.com/150', // Replace with an actual image URL
        price: 49.99,
        quantity: 1
      },
      {
        id: 2,
        name: 'Abstract Art Piece',
        image: 'https://via.placeholder.com/150', // Replace with an actual image URL
        price: 75.0,
        quantity: 2
      },
      {
        id: 3,
        name: 'Modern Sculpture',
        image: 'https://via.placeholder.com/150', // Replace with an actual image URL
        price: 120.0,
        quantity: 1
      }
    ],
    loading: false
  },
  reducers: {}
})
export default cartSlice.reducer
