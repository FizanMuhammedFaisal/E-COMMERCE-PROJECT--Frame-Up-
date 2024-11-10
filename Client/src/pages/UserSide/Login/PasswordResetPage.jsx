import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/api/api'

const PasswordResetPage = () => {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    const checkResetToken = async () => {
      try {
        const res = await api.post(
          '/users/check-reset-token',
          {},
          { withCredentials: true }
        )
        if (res.data.isValid) {
          setIsAuthorized(true)
        } else {
          navigate('/login') // Redirect if not authorized
        }
      } catch (error) {
        console.error('Error checking token:', error)
        navigate('/login') // Redirect if an error occurs
      }
    }

    checkResetToken()
  }, [navigate])

  if (!isAuthorized) {
    return <p>Loading...</p>
  }

  // Function to validate form inputs
  const validateForm = () => {
    const newErrors = {}
    // Password validation rules
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/\d/.test(password)) {
      newErrors.password = 'Password must contain at least one number'
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password =
        'Password must contain at least one special character'
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleForgotPasswordSubmit = async e => {
    e.preventDefault()
    if (validateForm()) {
      setPassword('')
      setConfirmPassword('')
      try {
        const res = await api.post(
          '/users/reset-password',
          { password },
          { withCredentials: true }
        )
        if (res.data.success) {
          setSuccessMessage('Password successfully reset!')
          setErrors({})
          sessionStorage.removeItem('x-timer')
          navigate('/login')
        }
      } catch (error) {
        setErrors({ responseError: 'Failed to reset password' })
      }
    }
  }

  return (
    <>
      <div className='flex bg-slate-50 min-h-screen  flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h2 className='mt-10 text-3xl font-tertiary leading-7 font-semibold text-center text-textPrimary'>
            Enter Your New Password
          </h2>
        </div>

        <div className='mt-5 sm:mx-auto sm:w-full sm:max-w-sm'>
          {successMessage && (
            <div className='p-2 mb-4 bg-green-100 border border-green-300 text-center font-primary font-semibold'>
              <p className='text-green-700'>{successMessage}</p>
            </div>
          )}

          {errors.responseError && (
            <div className='p-2 mb-4 bg-red-100 border border-red-300 text-center font-primary font-semibold'>
              <p className='text-red-500 hover:text-red-700'>
                {errors.responseError}
              </p>
            </div>
          )}

          <form onSubmit={handleForgotPasswordSubmit} className='space-y-6'>
            <div className='w-full pt-3'>
              <label
                htmlFor='password'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                New Password
              </label>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete='new-password'
                  className='block w-full border-0 py-1.5 text-textPrimary shadow-sm ring-1 ring-inset ring-neutral-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6'
                />
                <div className='pt-2 font-tertiary'>
                  {errors.password && (
                    <p className='text-red-500 hover:text-red-300'>
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className='w-full'>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Confirm Password
              </label>
              <div className='mt-2'>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete='new-password'
                  className='block w-full border-0 py-1.5 text-textPrimary shadow-sm ring-1 ring-inset ring-neutral-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6'
                />
                <div className='pt-2 font-tertiary'>
                  {errors.confirmPassword && (
                    <p className='text-red-500 hover:text-red-300'>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className='flex justify-center pt-2 pb-28'>
              <button
                type='submit'
                className='flex w-full justify-center duration-300 bg-customColorTertiary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customColorPrimary hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customColorSecondary'
              >
                Make New Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default PasswordResetPage
