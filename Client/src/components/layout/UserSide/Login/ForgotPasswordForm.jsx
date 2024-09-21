import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../../../services/api/api'

function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState('')
  function validateEmail(formData) {
    const errors = {}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!emailPattern.test(formData.email)) {
      errors.email = 'Invalid email address'
    }

    return errors
  }
  const handleForgotPasswordSubmit = async e => {
    e.preventDefault()
    const formData = { email }
    const errors = validateEmail(formData)

    if (Object.keys(errors).length > 0) {
      return setErrors(errors)
    }

    try {
      console.log(email)
      const res = await api.post('/users/sendtoken', formData)
      console.log(res)

      const item = sessionStorage.setItem('x-timer', res.data.token)
      navigate('/send-otp?to=reset', { replace: true })
    } catch (error) {
      const responseError = error?.response?.data?.message || error
      setErrors({ ...errors, responseError })
    }
  }

  return (
    <div className='flex bg-slate-50 min-h-full  flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-3xl font-tertiary leading-7 font-semibold text-center text-textPrimary'>
          Forgot Password
        </h2>
      </div>

      <div className='mt-5 sm:mx-auto sm:w-full sm:max-w-sm'>
        <p className='mb-12 text-center text-sm text-gray-500'>
          Remember your password?{' '}
          <Link
            to='/login'
            className='font-semibold leading-6 text-textPrimary hover:underline'
          >
            Sign In
          </Link>
        </p>

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
              htmlFor='email'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Email address
            </label>
            <div className='mt-2'>
              <input
                id='email'
                name='email'
                type='text'
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete='email'
                className='block w-full border-0 py-1.5 text-textPrimary shadow-sm ring-1 ring-inset ring-neutral-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6'
              />
              <div className='pt-2 font-tertiary'>
                {errors.email && (
                  <p className='text-red-500 hover:text-red-300'>
                    {errors.email}
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
              Confirm Email
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
