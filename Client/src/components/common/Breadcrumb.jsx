import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Breadcrumb = ({ showHome = true }) => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  return (
    <nav className='bg-gray-100 p-3 rounded-md w-full' aria-label='breadcrumb'>
      <ol className='list-reset flex items-center'>
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
            <li key={index} className='text-gray-500'>
              <span className='mx-2'>/</span>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </li>
          ) : (
            <li key={index}>
              <span className='mx-2'>/</span>
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
