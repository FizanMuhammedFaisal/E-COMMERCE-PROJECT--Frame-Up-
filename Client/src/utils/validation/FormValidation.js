export const validateLoginForm = inputLogin => {
  const newError = {}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  if (!emailRegex.test(inputLogin.email))
    newError.email = 'Invalid email format'
  if (!inputLogin.email) newError.email = 'Email is required*'
  if (!inputLogin.password) newError.password = 'Password is required*'
  // if (!passwordRegex.test(inputLogin.password))
  //   newError.password = 'Incorrect Password'
  // for development purpose
  return newError
}
//register form validation
export const validateRegisterForm = input => {
  const errors = {}

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^(\+?[1-9]{1}[0-9]{1,14})$/
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
    // } else if (!passwordRegex.test(input.password)) {
    //   errors.password = 'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a digit, and a special character'
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
