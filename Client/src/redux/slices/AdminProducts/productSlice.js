import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
let initialState = {
  productName: '',
  productPrice: '',
  productCategory: { themes: [], styles: [], techniques: [] },
  productDescription: '',
  productImages: [],
  thumbnailImage: [],
  weight: '',
  dimensions: '',
  deletedImageUrls: []
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
    addDeletedImageUrl: (state, action) => {
      state.deletedImageUrls.push(action.payload)
    }
  }
})

export default productSlice.reducer
export const { setFormData, resetFormData, deleteImage, addDeletedImageUrl } =
  productSlice.actions
