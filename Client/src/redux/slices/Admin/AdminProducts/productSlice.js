import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
let initialState = {
  productName: '',
  productPrice: '',
  discountPrice: '',
  productYear: '',
  productStock: '',
  productCategory: { themes: [], styles: [], techniques: [] },
  artist: '',
  productDescription: '',
  productInformation: '',
  productImages: [],
  thumbnailImage: [],
  weight: '',
  dimensions: ''
}
const productSlice = createSlice({
  name: 'productSlice',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      const { id, value } = action.payload

      if (['themes', 'styles', 'techniques'].includes(id)) {
        state.productCategory[id] = value
      } else {
        state[id] = value
      }
    },
    resetFormData: state => {
      return { ...initialState } // Reset to initial form state
    },
    deleteImage: (state, action) => {
      const { imageid, type } = action.payload

      if (type === 'productImages') {
        state.productImages = state.productImages.filter(img => img !== imageid)
      }
      if (type === 'thumbnailImage') {
        state.thumbnailImage = null
      }
    },
    updateFormData: (state, action) => {
      const { id, value } = action.payload
      if (['themes', 'styles', 'techniques'].includes(id)) {
        // Update nested productCategory fields
        state.productCategory[id] = value
      } else if (Array.isArray(state[id])) {
        // If it's an array  merge the arrays while keeping existing elements
        state[id] = [...state[id], ...value]
      } else if (typeof state[id] === 'object' && state[id] !== null) {
        // If it's an object (deep merge for objects)
        state[id] = { ...state[id], ...value }
      } else {
        // For primitive types (strings, numbers, etc.), update directly
        state[id] = value
      }
    }
  }
})

export default productSlice.reducer
export const {
  setFormData,
  resetFormData,
  deleteImage,
  addDeletedImageUrl,
  updateFormData
} = productSlice.actions
