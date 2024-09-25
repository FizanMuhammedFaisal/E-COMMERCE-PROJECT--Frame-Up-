import React, { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import api from '../../../services/api/api'
import { validateLoginForm } from '../../../utils/validation/FormValidation'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setUser } from '../../../redux/slices/authSlice'
import { useDispatch } from 'react-redux'
import { provider, auth } from '../../../services/firebase/firebase'
import { signInWithPopup } from 'firebase/auth'
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const idToken = await user.getIdToken()

      console.log(idToken, user) // You can log idToken here for debugging
      const res = await api.post('/users/google/auth', { idToken })
      const accessToken = res.data.accessToken
      localStorage.setItem('accessToken', accessToken)
      const data = {
        user: res.data._id,
        role: res.data.role,
        status: res.data.status
      }
      dispatch(setUser(data))
    } catch (error) {
      // Handle Errors here.
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error email:', error.customData?.email)
      console.error('Error credential:', error.credential)
    }
  }
  //------handle login
  const handleLoginSubmit = async e => {
    e.preventDefault()
    const formData = { email, password }
    const errors = validateLoginForm(formData)
    console.log(errors)
    if (Object.keys(errors).length > 0) {
      return setErrors(errors)
    }

    try {
      const res = await api.post('/users/login', formData)
      const accessToken = res.data.accessToken
      localStorage.setItem('accessToken', accessToken)
      const data = {
        user: res.data._id,
        role: res.data.role,
        status: res.data.status
      }
      dispatch(setUser(data))
      console.log(res)
    } catch (error) {
      const responseError = error?.response?.data?.message || error
      setErrors({ ...errors, responseError })
    }
  }
  return (
    <>
      <div className='flex bg-slate-50 min-h-full flex-1  flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto mt-6 sm:w-full sm:max-w-sm'>
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
          <p className='mb-12  text-center text-sm text-gray-500'>
            Don't have an Account?{' '}
            <a
              onClick={() => {
                navigate('/signup')
              }}
              className='font-semibold leading-6 text-textPrimary hover:underline'
            >
              SignUp !
            </a>
          </p>
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
                  className='block w-full  border-0 py-1.5 text-textPrimary shadow-sm ring-1 ring-inset ring-neutral-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6'
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
                <div className='text-sm'>
                  <Link
                    className='font-semibold text-textPrimary hover:underline'
                    to={'/login/forgot-password'}
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                  }}
                  autoComplete='current-password'
                  className='block w-full  border-0 py-1.5 text-textPrimary shadow-sm ring-1 ring-inset ring-neutral-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6'
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
                className='flex  w-4/12 justify-center duration-300  bg-customColorTertiary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customColorPrimary hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customColorSecondary'
              >
                Sign in
              </button>
            </div>
            <div className='text-slate-950 mt-10 items-center grid-cols-3 grid'>
              <hr className='text-slate-950' />
              <p className='text-center'>OR</p>
              <hr className='text-slate-950' />
            </div>
            <div>
              <button
                className='bg-white border py-2 w-full mb-24 flex hover:bg-customColorSecondary duration-300'
                onClick={() => {
                  handleGoogleAuth()
                }}
                type='button'
              >
                <FcGoogle className='text-3xl text-black ms-20 opacity-70' />{' '}
                <p className=' font-tertiary  mt-1 ms-5 font-semibold '>
                  Login With Google
                </p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginForm
