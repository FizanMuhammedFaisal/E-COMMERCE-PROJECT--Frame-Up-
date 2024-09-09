import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Breadcrumb = ({ showHome = true }) => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  return (
    <nav
      className='dark:bg-customP2BackgroundD_300 bg-customP2BackgroundW_400 py-2 rounded-2xl w-full'
      aria-label='breadcrumb'
    >
      <ol className='list-reset ms-3 flex items-center'>
        {/* Conditionally render Home link */}
        {showHome && (
          <li>
            <Link to='/' className='text-blue-600 hover:text-blue-700'>
              Home
            </Link>
          </li>
        )}

        {/* Dynamically generate breadcrumbs based on current path */}
        {pathnames.map((value, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = index === pathnames.length - 1

          return isLast ? (
            <li key={index} className='dark:text-gray-300 text-gray-700'>
              <span className='mx-2 text-white font-bold'>/</span>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </li>
          ) : (
            <li key={index}>
              <span className='mx-2 text-white font-bold'>/</span>
              <Link to={routeTo} className='text-blue-600 hover:text-blue-700'>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
