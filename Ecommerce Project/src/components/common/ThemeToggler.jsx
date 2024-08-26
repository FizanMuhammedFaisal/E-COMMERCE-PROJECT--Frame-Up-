import React from 'react'
import { useTheme } from '../../context/ThemeContext'

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      {theme === 'light' ? (
        <button
          onClick={toggleTheme}
          type='button'
          className='block font-medium text-gray-800 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
        >
          <span className='group inline-flex shrink-0 justify-center items-center size-9'>
            <svg
              className='shrink-0 size-4'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='12' cy='12' r='4'></circle>
              <path d='M12 2v2'></path>
              <path d='M12 20v2'></path>
              <path d='m4.93 4.93 1.41 1.41'></path>
              <path d='m17.66 17.66 1.41 1.41'></path>
              <path d='M2 12h2'></path>
              <path d='M20 12h2'></path>
              <path d='m6.34 17.66-1.41 1.41'></path>
              <path d='m19.07 4.93-1.41 1.41'></path>
            </svg>
          </span>
        </button>
      ) : (
        <button
          onClick={toggleTheme}
          type='button'
          className='block font-medium text-gray-800 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200 bg-gray-200 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:bg-neutral-800 dark:focus:bg-neutral-800'
        >
          <span className='group inline-flex shrink-0 justify-center items-center size-9'>
            <svg
              className='shrink-0 size-4'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'></path>
            </svg>
          </span>
        </button>
      )}
    </>
  )
}

export default ThemeToggleButton
