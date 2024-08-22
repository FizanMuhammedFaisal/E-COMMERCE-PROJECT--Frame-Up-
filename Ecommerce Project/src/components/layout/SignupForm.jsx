import React from 'react'
import { FcGoogle } from 'react-icons/fc'
function SignupForm() {
  return (
    <>
      <div className='flex bg-slate-50 min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          {/* <img
            alt='Your Company'
            src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
            className='mx-auto h-10 w-auto'
          /> */}
          <h2 className='mt-10  text-3xl font-tertiary leading-7 font-semibold text-center text-textPrimary'>
            Create account
          </h2>
        </div>

        <div className=' mt-5 sm:mx-auto sm:w-full sm:max-w-sm'>
          <p className='mb-14  text-center text-sm text-gray-500'>
            Already have an Account?{' '}
            <a
              href='#'
              className='font-semibold leading-6 text-textPrimary hover:underline'
            >
              Login Here
            </a>
          </p>
          <form action='#' className='space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                User Name
              </label>
              <div className='mt-2'>
                <input
                  id='UserName'
                  name='username'
                  type='text'
                  required
                  className='block w-full  border-0 py-1.5 text-textPrimary shadow-sm ring-1 ring-inset ring-neutral-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div>
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
                  type='email'
                  required
                  autoComplete='email'
                  className='block w-full  border-0 py-1.5 text-textPrimary shadow-sm ring-1 ring-inset ring-neutral-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Mobile Number
              </label>
              <div className='mt-2'>
                <input
                  id='mobile'
                  name='mobile'
                  type='number'
                  min='1'
                  max='10'
                  required
                  autoComplete='email'
                  className='block w-full  border-0 py-1.5 text-textPrimary shadow-sm ring-1 ring-inset ring-neutral-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6'
                />
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
                  <a
                    href='#'
                    className='font-semibold text-textPrimary hover:underline'
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  autoComplete='current-password'
                  className='block w-full  border-0 py-1.5 text-textPrimary shadow-sm ring-1 ring-inset ring-neutral-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6'
                />
              </div>
              <label
                htmlFor='password'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Repeat Password
              </label>
              <div className='mt-2'>
                <input
                  id='rpassword'
                  name='rpassword'
                  type='password'
                  required
                  autoComplete='current-password'
                  className='block w-full  border-0 py-1.5 text-textPrimary shadow-sm ring-1 ring-inset ring-neutral-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='flex justify-center'>
              <button
                type='submit'
                className='flex  w-4/12 justify-center duration-300  bg-customColorTertiary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-textPrimary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customColorSecondary'
              >
                Sign Up
              </button>
            </div>
            <div className='text-slate-950 mt-10 items-center grid-cols-3 grid'>
              <hr className='text-slate-950' />
              <p className='text-center'>OR</p>
              <hr className='text-slate-950' />
            </div>
            <div>
              <button className='bg-white border py-2 w-full mb-24 flex hover:bg-customColorSecondary duration-300'>
                <div className='mx-auto flex'>
                  <FcGoogle className='text-3xl  opacity-70 ' />{' '}
                  <p className=' font-tertiary  ms-5 font-semibold '>
                    Login With Google
                  </p>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignupForm
