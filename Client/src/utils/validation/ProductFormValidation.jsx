import { EraserIcon } from 'lucide-react'
import { setFormData } from '../../redux/slices/Admin/AdminProducts/productSlice'

const validateProductForm = (
  formData,
  DBError,
  productImages,
  thumbnailImage,
  dispatch
) => {
  const errors = {}

  // Validate product name
  if (!formData.productName.trim()) {
    errors.productName = 'Product name is required'
  }

  // Validate product price
  if (!formData.productPrice || formData.productPrice <= 0) {
    errors.productPrice = 'Product price must be greater than zero'
  }
  // Validate product price
  if (!formData.discountPrice || formData.discountPrice <= 0) {
    errors.discountPrice = 'Product price must be greater than zero'
  }
  if (
    formData.discountPrice <= 0 ||
    formData.discountPrice >= formData.productPrice
  ) {
    errors.discountPrice = 'Product price must be less than actuall price'
  }

  // Validate product category
  const productCategories = formData.productCategory || {}

  // Check if at least one category type is non-empty
  const hasAtLeastOneCategory = Object.values(productCategories).some(
    categoryArray => Array.isArray(categoryArray) && categoryArray.length > 0
  )

  if (!hasAtLeastOneCategory) {
    errors.productCategory =
      'At least one product category (themes, styles, or techniques) is required'
  }

  // Validate product description (optional but can have min length)
  if (!formData.productDescription.trim()) {
    errors.productDescription = 'Product description is required'
  } else if (formData.productDescription.length < 10) {
    errors.productDescription =
      'Description should be at least 10 characters long'
  }
  const artistName = formData.artistName || []

  // Check if at least one element in the artistName array is an object
  const hasOneOption = artistName.some(
    option =>
      typeof option === 'object' &&
      !Array.isArray(option) &&
      Object.keys(option).length > 0
  )

  if (!hasOneOption) {
    errors.artistName = 'At least one artist Name is required'
  }

  // Validate product information (optional but can have min length)
  if (!formData.productInformation.trim()) {
    errors.productInformation = 'Product information is required'
  } else if (formData.productInformation.length < 20) {
    errors.productInformation =
      'Product information should be at least 20 characters long'
  }

  const currentYear = new Date().getFullYear()
  const year = formData.productYear
  if (year < 1000 || year > currentYear) {
    errors.productYear = `Product year must be a valid year between 1000 and ${currentYear}`
  }
  if (!formData.productStock.trim()) {
    errors.productStock = 'Add Product Stock Number'
  } else if (formData.productStock && formData.productStock < 0) {
    errors.productStock = 'Stock Number Cannot be Negative'
  }
  // Validate product images
  if (!DBError) {
    if (
      !Array.isArray(formData.productImages) ||
      formData.productImages.length === 0
    ) {
      errors.productImages = 'At least one product image is required'
    }

    // Validate thumbnail image
    if (
      !Array.isArray(formData.thumbnailImage) ||
      formData.thumbnailImage.length === 0
    ) {
      errors.thumbnailImage = 'Thumbnail image is required'
    }
  } else {
    if (!Array.isArray(productImages) || productImages.length === 0) {
      errors.productImages = 'At least one product image is required'
    }

    // Validate thumbnail image
    if (!Array.isArray(thumbnailImage) || thumbnailImage.length === 0) {
      errors.thumbnailImage = 'Thumbnail image is required'
    }
  }

  // Validate weight (optional, but can check for proper value)
  if (formData.weight && formData.weight <= 0) {
    errors.weight = 'Weight must be greater than zero'
  }

  const dimensionsRegex =
    /^(\d+)(?:\s*["']?\s*[hH]\s*)?\s*x\s*(\d+)(?:\s*["']?\s*[wW]\s*)?\s*x\s*(\d+)(?:\s*["']?\s*[dD]\s*)?$/i

  if (formData.dimensions) {
    if (!dimensionsRegex.test(formData.dimensions)) {
      errors.dimensions =
        'Dimensions should be in format: width x height x depth (e.g., 10x20x30)'
    } else if (!formData.dimensions.includes('"')) {
      const formattedDimensions = formatDimensionsFromString(
        formData.dimensions
      )
      dispatch(setFormData({ id: 'dimensions', value: formattedDimensions }))
    }
  } else {
    errors.dimensions = 'Dimensions are required'
  }

  return errors
}

export default validateProductForm
const formatDimensionsFromString = dimensionString => {
  // Remove any trailing 'x' and split the string by 'x'
  const dimensions = dimensionString.replace(/x$/, '').split('x').map(Number)

  // Check if we have exactly 3 dimensions (height, width, depth)
  if (dimensions.length !== 3 || dimensions.some(isNaN)) {
    return 'Invalid dimensions. Please provide three numeric values.'
  }
  const [height, width, depth] = dimensions
  return `${height}" h x ${width}" w x ${depth}" d`
}
