// utils/validation/ProductFormValidation.js

const validateProductForm = formData => {
  const errors = {}

  // Validate product name
  if (!formData.productName.trim()) {
    errors.productName = 'Product name is required'
  }

  // Validate product price
  if (!formData.productPrice || formData.productPrice <= 0) {
    errors.productPrice = 'Product price must be greater than zero'
  }

  // Validate product category
  if (!formData.productCategory.length < 0) {
    errors.productCategory = 'Product category is required'
  }

  // Validate product description (optional but can have min length)
  if (!formData.productDescription.trim()) {
    errors.productDescription = 'Product description is required'
  } else if (formData.productDescription.length < 10) {
    errors.productDescription =
      'Description should be at least 10 characters long'
  }

  // Validate product images
  if (!formData.productImages || formData.productImages.length === 0) {
    errors.productImages = 'At least one product image is required'
  }

  // Validate thumbnail image
  if (!formData.thumbnailImage || formData.thumbnailImage.length === 0) {
    errors.thumbnailImage = 'Thumbnail image is required'
  }

  // Validate weight (optional, but can check for proper value)
  if (formData.weight && formData.weight <= 0) {
    errors.weight = 'Weight must be greater than zero'
  }

  // Validate dimensions (optional, but should match a specific format, e.g., "10x20x30")
  const dimensionsRegex = /^\d+x\d+x\d+$/
  if (formData.dimensions && !dimensionsRegex.test(formData.dimensions)) {
    errors.dimensions =
      'Dimensions should be in format: width x height x depth (e.g., 10x20x30)'
  }

  return errors
}

export default validateProductForm
