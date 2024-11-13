export const validateLoginForm = inputLogin => {
  const newError = {}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  if (!emailRegex.test(inputLogin.email))
    newError.email = 'Invalid email format'
  if (!inputLogin.email) newError.email = 'Email is required*'
  // if (!inputLogin.password) newError.password = 'Password is required*'
  // if (!passwordRegex.test(inputLogin.password))
  //   newError.password = 'Incorrect Password'
  // for development purpose
  return newError
}
//register form validation
export const validateRegisterForm = input => {
  const errors = {}

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^(\+?[1-9]{1}[0-9]{1,14}|0[0-9]{9,14})$/
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  if (!input.username) {
    errors.username = 'Name is required*'
  }

  if (!input.email) {
    errors.email = 'Email is required*'
  } else if (!emailRegex.test(input.email)) {
    errors.email = 'Invalid email format'
  } else if (input.email !== input.email.toLowerCase()) {
    errors.email = 'Email must be in all lowercase'
  }

  if (!input.password) {
    errors.password = 'Password is required*'
    // For development purpose
  } else if (!passwordRegex.test(input.password)) {
    errors.password =
      'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a digit, and a special character'
  }

  if (!input.cPassword) {
    errors.cPassword = 'Confirm password is required*'
  } else if (input.password !== input.cPassword) {
    errors.cPassword = 'Passwords do not match'
  }

  if (!input.phone) {
    errors.phone = 'Phone number is required*'
  } else if (!phoneRegex.test(input.phone)) {
    errors.phone = 'Invalid phone number format'
  }

  return errors
}

//Validate EDIT Prouduct
const isNonEmptyString = value =>
  typeof value === 'string' && value.trim() !== ''
const isValidPrice = price => typeof price === 'number' && price >= 0
const isPositiveInteger = value => Number.isInteger(value) && value >= 0
const isNonEmptyArray = value => Array.isArray(value) && value.length > 0
const isValidFile = file =>
  file instanceof File && file.size > 0 && file.type.startsWith('image')
export const validateEditProductForm = (input, newImages) => {
  const errors = {}

  if (!isNonEmptyString(input.productName)) {
    errors.productName = 'Product name is required*'
  } else if (input.productName.length < 3) {
    errors.productName = 'Product name must be at least 3 characters long'
  }

  if (!isNonEmptyString(input.productDescription)) {
    errors.productDescription = 'Description is required*'
  } else if (input.productDescription.length < 10) {
    errors.productDescription = 'Description must be at least 10 characters'
  }

  if (input.productInformation && input.productInformation.length < 10) {
    errors.productInformation =
      'Product information should be at least 10 characters long if provided'
  }

  if (input.productPrice == null) {
    errors.productPrice = 'Price is required*'
  } else if (!isValidPrice(input.productPrice)) {
    errors.productPrice = 'Price must be a valid non-negative number'
  }

  if (input.discountPrice != null && !isValidPrice(input.discountPrice)) {
    errors.discountPrice = 'Discount price must be a valid non-negative number'
  }

  if (
    !isPositiveInteger(input.productYear) ||
    input.productYear > new Date().getFullYear()
  ) {
    errors.productYear =
      'Product year must be a valid year up to the current year'
  }

  if (!isPositiveInteger(input.productStock)) {
    errors.productStock = 'Product stock must be a positive integer'
  }

  if (
    input.weight == null ||
    typeof input.weight !== 'number' ||
    input.weight <= 0
  ) {
    errors.weight = 'Weight is required and must be a positive number'
  }

  const dimensionsRegex =
    /^(\d+(\.\d+)?)(?:\s*x\s*)(\d+(\.\d+)?)(?:\s*x\s*)(\d+(\.\d+)?)$|^(\d+(\.\d+)?)"\s*h\s*x\s*(\d+(\.\d+)?)"\s*w\s*x\s*(\d+(\.\d+)?)"\s*d$/i
  if (input.dimensions) {
    if (!dimensionsRegex.test(input.dimensions)) {
      errors.dimensions =
        'Dimensions should be in format: width x height x depth (e.g., 10.5x20.75x30 or 10" h x 20" w x 30" d)'
    }
  } else {
    errors.dimensions = 'Dimensions are required'
  }

  if (
    !input.artist ||
    !isNonEmptyString(input.artist._id) ||
    !isNonEmptyString(input.artist.name)
  ) {
    errors.artist = 'Artist with valid ID and name is required*'
  }

  if (!isNonEmptyArray(input.productCategories)) {
    errors.productCategories = 'At least one category must be selected'
  }

  if (
    !(
      (isNonEmptyArray(input.thumbnailImage) &&
        input.thumbnailImage.every(isNonEmptyString)) ||
      (isNonEmptyArray(newImages.thumbnailImage) &&
        newImages.thumbnailImage.every(isValidFile))
    )
  ) {
    errors.thumbnailImage =
      'Thumbnail image is required and must be a valid image file'
  }

  if (
    !(
      (isNonEmptyArray(input.productImages) &&
        input.productImages.every(isNonEmptyString)) ||
      (isNonEmptyArray(newImages.productImages) &&
        newImages.productImages.every(isValidFile))
    )
  ) {
    errors.productImages =
      'At least one product image is required and must be a valid image file'
  }

  return errors
}

export const validateAddressForm = address => {
  const errors = {}

  if (!address.addressName) {
    errors.addressName = 'Address Name is required'
  }
  if (!address.name) {
    errors.name = 'Name is required'
  }
  if (!address.phoneNumber) {
    errors.phoneNumber = 'phoneNumber is required'
  } else if (!/^\d{10}$/.test(address.phoneNumber)) {
    errors.phoneNumber = 'PhoneNumber must be a 10-digit number'
  }
  if (!address.address) {
    errors.address = 'address is required'
  }
  if (!address.locality) {
    errors.locality = 'locality is required'
  }
  if (!address.city) {
    errors.city = 'City is required'
  }
  if (!address.state) {
    errors.state = 'State is required'
  }
  if (!address.postalCode) {
    errors.postalCode = 'Postal Code is required'
  } else if (!/^\d{5}$/.test(address.postalCode)) {
    errors.postalCode = 'ZIP Code must be a 5-digit number'
  }

  return errors
}

// validateCoupon.js
export const validateCoupon = formData => {
  let errors = {}
  if (!formData.code) {
    errors.code = 'Coupon code is required'
  } else if (formData.code.length < 3) {
    errors.code = 'Coupon code must be at least 3 characters long'
  }
  if (!formData.discountType) {
    errors.discountType = 'Discount type is required'
  }
  if (!formData.discountAmount) {
    errors.discountAmount = 'Discount amount is required'
  } else if (isNaN(formData.discountAmount) || formData.discountAmount <= 0) {
    errors.discountAmount = 'Discount amount must be a positive number'
  }
  if (
    formData.minPurchaseAmount &&
    (isNaN(formData.minPurchaseAmount) || formData.minPurchaseAmount <= 0)
  ) {
    errors.minPurchaseAmount =
      'Minimum purchase amount must be a positive number'
  }
  if (formData.maxDiscountAmount) {
    if (isNaN(formData.maxDiscountAmount) || formData.maxDiscountAmount <= 0) {
      errors.maxDiscountAmount =
        'Maximum discount amount must be a positive number'
    }
    if (
      formData.minPurchaseAmount &&
      formData.maxDiscountAmount < formData.minPurchaseAmount
    ) {
      errors.maxDiscountAmount =
        'Maximum discount amount cannot be less than minimum purchase amount'
    }
  }
  if (!formData.validFrom) {
    errors.validFrom = 'Valid From date is required'
  }

  if (!formData.validTill) {
    errors.validTill = 'Valid Till date is required'
  }

  if (
    formData.validFrom &&
    formData.validTill &&
    new Date(formData.validFrom) > new Date(formData.validTill)
  ) {
    errors.validTill = 'Valid Till date must be later than Valid From date'
  }

  return errors
}

//Validate Discount
export const validateDiscount = data => {
  const errors = {}

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Discount name is required'
  }
  if (!data.discountTarget) {
    errors.discountTarget = 'Discount target is required'
  }
  console.log(data)
  if (!data.discountType) {
    errors.discountType = 'Discount type is required'
  }
  if (!data.discountValue || data.discountValue <= 0) {
    errors.discountValue = 'Discount value must be greater than 0'
  } else if (data.discountType === 'fixed' && data.discountValue < 0) {
    errors.discountValue =
      'Discount value cannot be negative for fixed discounts'
  } else if (data.discountType === 'percentage' && data.discountValue > 100) {
    errors.discountValue =
      'Discount percentage must be less than or equal to 100'
  }
  if (data.discountType === 'fixed' && (!data.minValue || data.minValue <= 0)) {
    errors.minValue =
      'Min purchase amount must be greater than 0 for fixed discounts'
  }
  if (!data.startDate) {
    errors.startDate = 'Start date is required'
  }

  if (!data.endDate) {
    errors.endDate = 'End date is required'
  }

  if (
    data.startDate &&
    data.endDate &&
    new Date(data.startDate) >= new Date(data.endDate)
  ) {
    errors.endDate = 'End date must be later than the start date'
  }
  if (data.discountTarget && !data.targetId) {
    errors.discountTarget =
      'Target selection is required for this discount target'
  }

  return errors
}
