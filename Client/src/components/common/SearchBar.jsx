import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuSearch } from 'react-icons/lu'
import { FiChevronRight } from 'react-icons/fi'
import api from '../../services/api/api'
import { useDebounce } from '../../hooks/useDebounce'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CircularProgress } from '@mui/material'

const ResultCategory = React.memo(({ category }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const handleCategorySelect = (event, category) => {
    event.preventDefault()
    console.log(category)
    const newSearchParams = new URLSearchParams(searchParams)
    const qname = category.type + 's'
    const q = category.name
    if (q) {
      newSearchParams.set(qname, q)
      setSearchParams(newSearchParams)
    }
  }
  return (
    <li>
      <div
        onClick={e => handleCategorySelect(e, category)}
        className='flex items-center text-sm text-gray-600 hover:text-customColorTertiarypop transition duration-150 ease-in-out'
      >
        <span>{category.name}</span>
        <FiChevronRight className='ml-auto' />
      </div>
    </li>
  )
})
const ResultProduct = React.memo(({ product }) => (
  <li>
    <Link
      to={`/all/${product._id}`}
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
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
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

  const handleSearchSubmit = event => {
    event.preventDefault()
    const newSearchParams = new URLSearchParams(searchParams)
    const q = query.trim()
    if (q) {
      newSearchParams.set('searchQuery', q)
      navigate({
        pathname: '/all',
        search: `?${newSearchParams.toString()}`
      })
      setSearchParams(newSearchParams)
    }
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
    small: { width: '120px' },
    large: { width: '133px' }
  }

  const resultsVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className='relative ml-auto sm:ml-0' ref={searchRef}>
      <form onSubmit={handleSearchSubmit}>
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
            className='w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customColorTertiarypop text-sm'
            onClick={() => setIsSearchFocused(true)}
          />
          <button className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            <LuSearch className='text-lg text-gray-500' />
          </button>
        </motion.div>
      </form>

      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            className='absolute -right-16  sm:right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20'
            style={{
              width: '384px',
              maxWidth: '100vw'
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
                                  key={product._id}
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
                  <p
                    onClick={() => {
                      const newSearchParams = new URLSearchParams(searchParams)
                      newSearchParams.set('searchQuery', query)
                      newSearchParams.set('searchQuery', query)
                      navigate({
                        pathname: '/all',
                        search: `?${newSearchParams.toString()}`
                      })
                      setIsSearchFocused(false)
                    }}
                    className='text-sm text-customColorTertiarypop hover:underline block text-center'
                  >
                    View all results for "{query}"
                  </p>
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
