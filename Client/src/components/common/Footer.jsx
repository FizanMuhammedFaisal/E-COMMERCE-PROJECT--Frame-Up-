import React from 'react'
import { FaFacebookF } from 'react-icons/fa'
import { FaInstagram } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
function Footer() {
  return (
    <div>
      <footer className='bg-customColorTertiary text-slate-50'>
        <div className='mx-auto w-full max-w-screen-xl p-4 py-8 lg:py-8'>
          <div className='md:flex md:justify-between'>
            {/* logo of the brand */}
            <div className='mb-6 md:mb-0'>
              <a href='https://flowbite.com/' className='flex items-center'>
                {/* <img
                  src='https://flowbite.com/docs/images/logo.svg'
                  className='h-8 me-3'
                  alt='FrameUp Logo'
                /> */}
                <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
                  FrameUP
                </span>
              </a>
              <p></p>
            </div>
            <div className='grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3'>
              <div>
                <ul className='text-slate-50 font-primary font-medium'>
                  <li className='mb-4'>
                    <a className='hover:underline hover:text-slate-300'>FAQ</a>
                  </li>
                  <li className='mb-4'>
                    <a className='hover:underline hover:text-slate-300'>
                      Contact Us
                    </a>
                  </li>
                  <li className='mb-4'>
                    <a className='hover:underline hover:text-slate-300'>
                      Returns
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className='text-slate-50 font-primary font-medium'>
                  <li className='mb-4'>
                    <a className='hover:underline hover:text-slate-300'>FAQ</a>
                  </li>
                  <li className='mb-4'>
                    <a className='hover:underline hover:text-slate-300'>
                      Contact Us
                    </a>
                  </li>
                  <li className='mb-4'>
                    <a className='hover:underline hover:text-slate-300'>
                      Returns
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className='my-6 border-gray-200 sm:mx-auto lg:my-8' />
          <div className='grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-4'>
            <div>
              <h2 className='mb-6 text-sm font-semibold font-primary text-gray-900 uppercase dark:text-white'>
                style
              </h2>
              <ul className='text-gray-500 dark:text-gray-400 font-primary font-medium'>
                <li className='mb-4'>
                  <a href='https://flowbite.com/' className='hover:underline'>
                    Flowbite
                  </a>
                </li>
                <li>
                  <a
                    href='https://tailwindcss.com/'
                    className='hover:underline'
                  >
                    Tailwind CSS
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className='mb-6 text-sm font-semibold font-primary text-gray-900 uppercase dark:text-white'>
                Subject
              </h2>
              <ul className='text-gray-500 dark:text-gray-400 font-primary font-medium'>
                <li className='mb-4'>
                  <a
                    href='https://github.com/themesberg/flowbite'
                    className='hover:underline '
                  >
                    Github
                  </a>
                </li>
                <li>
                  <a
                    href='https://discord.gg/4eeurUVvTy'
                    className='hover:underline'
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className='mb-6 text-sm font-semibold text-gray-900 uppercase font-primary dark:text-white'>
                For Artist
              </h2>
              <ul className='text-gray-500 dark:text-gray-400 font-primary font-medium'>
                <li className='mb-4'>
                  <a href='#' className='hover:underline'>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:underline'>
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className='mb-6 text-sm font-semibold text-gray-900 uppercase font-primary dark:text-white'>
                For Artist
              </h2>
              <ul className='text-gray-500 dark:text-gray-400 font-primary font-medium'>
                <li className='mb-4'>
                  <a href='#' className='hover:underline'>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:underline'>
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <hr className='my-6 border-gray-200 sm:mx-auto lg:my-8' />
          <div className='sm:flex sm:items-center sm:justify-between'>
            <span className='text-sm font-primary text-gray-500 sm:text-center dark:text-gray-400'>
              © 2023{' '}
              <a href='https://flowbite.com/' className='hover:underline'>
                Flowbite™
              </a>
              . All Rights Reserved.
            </span>
            <div className='flex mt-4 sm:justify-center sm:mt-0'>
              <a
                href='#'
                className='text-gray-500 hover:text-gray-900 dark:hover:text-white'
              >
                <FaFacebookF />
                <span className='sr-only'>Facebook page</span>
              </a>
              <a
                href='#'
                className='text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5'
              >
                <FaInstagram />
                <span className='sr-only'>Instagram Page</span>
              </a>
              <a
                href='#'
                className='text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5'
              >
                <FaXTwitter />
                <span className='sr-only'>Twitter page</span>
              </a>
              <a
                href='#'
                className='text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5'
              >
                <FaGithub />
                <span className='sr-only'>GitHub account</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
