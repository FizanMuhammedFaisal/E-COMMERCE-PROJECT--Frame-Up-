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
