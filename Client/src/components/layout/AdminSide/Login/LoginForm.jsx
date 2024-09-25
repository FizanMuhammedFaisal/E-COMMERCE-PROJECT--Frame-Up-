import React, { useEffect, useState } from 'react'

import api from '../../../../services/api/api'
import { validateLoginForm } from '../../../../utils/validation/FormValidation'

import { setUser } from '../../../../redux/slices/authSlice'
import { useDispatch } from 'react-redux'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const dispatch = useDispatch()

  //------handle login
  const handleLoginSubmit = async e => {
    e.preventDefault()
    const formData = { email, password }
    const errors = validateLoginForm(formData)
    if (errors) {
      setErrors(errors)
    }

    try {
      const res = await api.post('/admin/login', formData)
      const accessToken = res.data.accessToken
      localStorage.setItem('accessToken', accessToken)
      const data = { user: res.data._id, role: res.data.role }
      dispatch(setUser(data))
      console.log(res)
    } catch (error) {
      const responseError = error?.response?.data?.message || error
      setErrors({ ...errors, responseError })
    }
  }
  return (
    <>
      <div className='flex bg-customP2BackgroundW min-h-full mt-5 flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          {/* <img
            alt='Your Company'
            src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
            className='mx-auto h-10 w-auto'
          /> */}
          <h2 className='mt-10  text-3xl font-tertiary leading-7 font-semibold text-center text-textPrimary'>
            Sign Into your account
          </h2>
        </div>

        <div className=' mt-5 sm:mx-auto sm:w-full sm:max-w-sm'>
          <div
            className={`text-center font-primary font-semibold  ${
              errors.responseError
                ? 'p-1 bg-red-100 border-red-300 border'
                : 'p-1 bg-transparent'
            }`}
          >
            <p className='text-red-500 hover:text-red-700'>
              {errors.responseError ? errors.responseError : ''}
            </p>
          </div>

          <form
            onSubmit={e => {
              handleLoginSubmit(e)
            }}
            className='space-y-6'
          >
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
                  onChange={e => {
                    setEmail(e.target.value)
                  }}
                  autoComplete='email'
                  className='block w-full  border-0 py-1.5 text-textPrimary shadow-sm ring-1 ring-inset ring-neutral-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-customP2Primary sm:text-sm sm:leading-6'
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
            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Password
                </label>
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  value={password}
                  required
                  onChange={e => {
                    setPassword(e.target.value)
                  }}
                  autoComplete='current-password'
                  className='block w-full  border-0 py-1.5 text-textPrimary shadow-sm ring-1 ring-inset ring-neutral-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-customP2Primary  sm:text-sm sm:leading-6'
                />
              </div>
              <div className='pt-2 font-tertiary'>
                {errors.password && (
                  <p className='text-red-500 hover:text-red-300'>
                    {errors.password}
                  </p>
                )}
              </div>
            </div>
            <div className='flex justify-center pt-2'>
              <button
                type='submit'
                className='flex  w-4/12 justify-center duration-300  bg-customP2Primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customP2Button hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customColorSecondary'
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginForm
