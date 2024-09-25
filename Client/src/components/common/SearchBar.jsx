import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuSearch } from 'react-icons/lu'
import { FiChevronRight } from 'react-icons/fi'
import api from '../../services/api/api'
import { useDebounce } from '../../hooks/useDebounce'
import { Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
const ResultCategory = React.memo(({ category }) => (
  <li>
    <Link
      to={`/category/${category.id}`}
      className='flex items-center text-sm text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out'
    >
      <span>{category.name}</span>
      <FiChevronRight className='ml-auto' />
    </Link>
  </li>
))

const ResultProduct = React.memo(({ product }) => (
  <li>
    <Link
      to={`/products/${product._id}`}
      className='flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-md transition duration-150 ease-in-out'
    >
      <img
        src={product.thumbnailImage}
        alt={product.productName}
        className='w-12 h-12 object-cover rounded-md'
      />
      <div className='flex-grow min-w-0'>
        <p className='text-sm font-medium text-gray-900 truncate'>
          {product.productName}
        </p>
        <p className='text-sm text-gray-500 mt-1'>${product.productPrice}</p>
      </div>
    </Link>
  </li>
))

function SearchBar({ setIsSearchFocused, isSearchFocused }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({
    products: [],
    categories: [],
    message: 'Search Something'
  })
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)

  const fetchSearchResults = async query => {
    if (!query) {
      setResults({ products: [], categories: [], message: 'Search Something' })
      return
    }

    try {
      setLoading(true)
      const response = await api.get(`products/search/items?q=${query}`)
      setLoading(false)

      if (
        response.data.products.length === 0 &&
        response.data.categories.length === 0
      ) {
        setResults({
          products: [],
          categories: [],
          message: 'Nothing found'
        })
      } else {
        setResults({
          products: response.data.products || [],
          categories: response.data.categories || [],
          message: ''
        })
      }
    } catch (error) {
      console.error('Error fetching search results:', error)
      setLoading(false)
      setResults({
        products: [],
        categories: [],
        message: 'Error fetching results'
      })
    }
  }

  const debouncedQuery = useDebounce(query, 300)

  const handleType = e => {
    setQuery(e.target.value)
  }

  useEffect(() => {
    fetchSearchResults(debouncedQuery)
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setIsSearchFocused])

  const searchInputVariants = {
    small: { width: '150px' },
    large: { width: '175px' }
  }

  const resultsVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className='relative ml-auto sm:ml-0' ref={searchRef}>
      <motion.div
        className='relative z-10'
        initial='small'
        animate={isSearchFocused ? 'large' : 'small'}
        variants={searchInputVariants}
      >
        <input
          type='text'
          placeholder='Search...'
          value={query}
          onChange={handleType}
          className='w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
          onFocus={() => setIsSearchFocused(true)}
        />
        <button className='absolute right-3 top-1/2 transform -translate-y-1/2'>
          <LuSearch className='text-lg text-gray-500' />
        </button>
      </motion.div>

      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            className='absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20'
            style={{
              width: '384px',
              maxWidth: '100vw',
              right: 0
            }}
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={resultsVariants}
          >
            <div className='max-h-[60vh] overflow-y-auto'>
              <div className='p-4 border-b border-gray-200'>
                {loading ? (
                  <div className='flex justify-center'>
                    <CircularProgress size={30} color='inherit' />
                  </div>
                ) : (
                  <>
                    {results.message ? (
                      <p className='text-sm text-gray-500 text-center'>
                        {results.message}
                      </p>
                    ) : (
                      <>
                        {results.categories.length > 0 && (
                          <>
                            <h3 className='text-sm font-semibold text-gray-700 mb-2'>
                              Categories
                            </h3>
                            <ul className='space-y-1'>
                              {results.categories.map((category, index) => (
                                <ResultCategory
                                  category={category}
                                  key={category.id}
                                />
                              ))}
                            </ul>
                          </>
                        )}
                        {results.products.length > 0 && (
                          <>
                            <h3 className='text-sm font-semibold text-gray-700 mb-2 mt-4'>
                              Products
                            </h3>
                            <ul className='space-y-3'>
                              {results.products.map((product, index) => (
                                <ResultProduct
                                  key={product.id}
                                  product={product}
                                />
                              ))}
                            </ul>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
              {query && !loading && (
                <div className='p-4 border-t border-gray-200 bg-gray-50'>
                  <Link
                    to={`/search?q=${encodeURIComponent(query)}`}
                    className='text-sm text-blue-600 hover:underline block text-center'
                  >
                    View all results for "{query}"
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar
ResultCategory.displayName = 'ResultCategory'
ResultProduct.displayName = 'ResultProduct'
