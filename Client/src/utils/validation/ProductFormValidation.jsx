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

  // Validate discount price (optional, only if provided)
  if (formData.discountPrice && formData.discountPrice <= 0) {
    errors.discountPrice =
      'Discount price must be greater than zero if provided'
  }

  // Validate product category
  const productCategories = formData.productCategory || {}
  const hasAtLeastOneCategory = Object.values(productCategories).some(
    categoryArray => Array.isArray(categoryArray) && categoryArray.length > 0
  )

  if (!hasAtLeastOneCategory) {
    errors.productCategory = 'At least one product category is required'
  }

  // Validate product description
  if (!formData.productDescription.trim()) {
    errors.productDescription = 'Product description is required'
  } else if (formData.productDescription.length < 10) {
    errors.productDescription =
      'Description should be at least 10 characters long'
  }
  console.log(formData.artistName)
  // Validate artist (single object, not an array)
  if (!formData.artistName || typeof formData.artistName !== 'object') {
    errors.artist = 'Artist information is required'
  }

  // Validate product information
  if (!formData.productInformation.trim()) {
    errors.productInformation = 'Product information is required'
  } else if (formData.productInformation.length < 20) {
    errors.productInformation =
      'Product information should be at least 20 characters long'
  }

  // Validate product year
  const currentYear = new Date().getFullYear()
  const year = formData.productYear
  if (year < 1000 || year > currentYear) {
    errors.productYear = `Product year must be a valid year between 1000 and ${currentYear}`
  }

  // Validate product stock
  if (!formData.productStock.trim()) {
    errors.productStock = 'Add Product Stock Number'
  } else if (formData.productStock < 0) {
    errors.productStock = 'Stock Number cannot be negative'
  }

  // Validate product images
  if (!DBError) {
    if (
      !Array.isArray(formData.productImages) ||
      formData.productImages.length === 0
    ) {
      errors.productImages = 'At least one product image is required'
    }

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

    if (!Array.isArray(thumbnailImage) || thumbnailImage.length === 0) {
      errors.thumbnailImage = 'Thumbnail image is required'
    }
  }

  // Validate weight (optional, but must be greater than zero if provided)
  if (formData.weight && formData.weight <= 0) {
    errors.weight = 'Weight must be greater than zero'
  }
  // Expanded regex for both raw and formatted dimension inputs
  const dimensionsRegex =
    /^(\d+(\.\d+)?)(?:\s*x\s*)(\d+(\.\d+)?)(?:\s*x\s*)(\d+(\.\d+)?)$|^(\d+(\.\d+)?)"\s*h\s*x\s*(\d+(\.\d+)?)"\s*w\s*x\s*(\d+(\.\d+)?)"\s*d$/i
  if (formData.dimensions) {
    if (!dimensionsRegex.test(formData.dimensions)) {
      errors.dimensions =
        'Dimensions should be in format: width x height x depth (e.g., 10.5x20.75x30 or 10" h x 20" w x 30" d)'
    } else if (!formData.dimensions.includes('"')) {
      // Only format if the dimensions are not already formatted
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

// Helper function to format raw dimensions into the required format
const formatDimensionsFromString = dimensionString => {
  const dimensions = dimensionString.replace(/x$/, '').split('x').map(Number)
  if (dimensions.length !== 3 || dimensions.some(isNaN)) {
    return 'Invalid dimensions. Please provide three numeric values.'
  }
  const [height, width, depth] = dimensions
  return `${height}" h x ${width}" w x ${depth}" d`
}
