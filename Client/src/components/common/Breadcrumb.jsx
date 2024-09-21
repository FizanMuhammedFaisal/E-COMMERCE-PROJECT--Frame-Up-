import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Breadcrumb = ({ showHome = true, type = 'user' }) => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  const containerClass =
    type === 'admin'
      ? 'dark:bg-gray-800 bg-gray-200 py-2 rounded-2xl w-full'
      : ' bg-white py-2  bg-gray-400 ps-16 w-full'

  const linkClass =
    type === 'admin'
      ? 'text-blue-500 hover:text-blue-600'
      : 'text-blue-600 hover:text-blue-700'

  const lastItemClass =
    type === 'admin'
      ? 'dark:text-gray-400 text-gray-800'
      : 'dark:text-gray-300 text-gray-700'

  return (
    <nav className={containerClass} aria-label='breadcrumb '>
      <ol className='list-reset ms-3 flex items-center'>
        {/* Conditionally render Home link */}
        {showHome && (
          <li>
            <Link to='/' className={linkClass}>
              Home
            </Link>
          </li>
        )}

        {/* Dynamically generate breadcrumbs based on current path */}
        {pathnames.map((value, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = index === pathnames.length - 1

          return isLast ? (
            <li key={index} className={lastItemClass}>
              <span className='mx-2  font-bold'>＞</span>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </li>
          ) : (
            <li key={index}>
              <span className='mx-2 text-white font-bold'>/</span>
              <Link to={routeTo} className={linkClass}>
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
