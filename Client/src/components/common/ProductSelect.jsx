import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useRef, useCallback } from 'react'
import apiClient from '../../services/api/apiClient'

export default function InfiniteScrollSelect({
  placeholder = 'Select a product...',
  onSelect
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)
  const dropdownRef = useRef(null)
  const listRef = useRef(null)

  const loadOptions = useCallback(async (page, search) => {
    setLoading(true)
    try {
      const res = await apiClient.get(`/api/products/get-products-admin`, {
        params: { page, search, includeCategories: false, limit: 9 }
      })
      const newOptions = res.data.products.map(product => ({
        value: product._id,
        label: product.productName
      }))
      setLoading(false)
      setHasMore(res.data.hasNextPage)
      return newOptions
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
      return []
    }
  }, [])

  const loadMoreOptions = useCallback(async () => {
    if (loading || !hasMore) return
    const newOptions = await loadOptions(page, searchTerm)
    setOptions(prevOptions => {
      const uniqueNewOptions = newOptions.filter(
        newOption =>
          !prevOptions.some(prevOption => prevOption.value === newOption.value)
      )
      return [...prevOptions, ...uniqueNewOptions]
    })
    setPage(prev => prev + 1)
  }, [loading, hasMore, loadOptions, page, searchTerm])

  useEffect(() => {
    const handleSearch = async () => {
      setOptions([])
      setPage(1)
      setHasMore(true)
      const newOptions = await loadOptions(1, searchTerm)
      setOptions(newOptions)
      setPage(2)
    }
    handleSearch()
  }, [searchTerm, loadOptions])

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!isOpen || !listRef.current) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        loadMoreOptions()
      }
    }

    const listElement = listRef.current
    listElement.addEventListener('scroll', handleScroll)
    return () => listElement.removeEventListener('scroll', handleScroll)
  }, [isOpen, loadMoreOptions])

  const handleSelectOption = option => {
    setSelectedOption(option)
    setIsOpen(false)

    if (onSelect) {
      onSelect(option)
    }
  }

  return (
    <div className='relative w-64' ref={dropdownRef}>
      <button
        className='w-full px-4 py-2 text-left bg-white dark:bg-customP2ForegroundD_100 border border-gray-300 dark:border-customP2ForegroundD_400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:text-slate-50'
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ChevronUpDownIcon className='absolute right-2 top-2.5 h-5 w-5 text-gray-400 dark:text-slate-300' />
      </button>
      {isOpen && (
        <div className='absolute z-10 w-full mt-1 bg-white dark:bg-customP2ForegroundD_100 border border-gray-300 dark:border-customP2ForegroundD_400 rounded-md shadow-lg'>
          <div className='form-group'>
            <input
              type='text'
              className='w-full px-4 py-2 border-b border-gray-300 dark:border-customP2ForegroundD_400 focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:bg-customP2ForegroundD_100 dark:text-slate-50'
              placeholder='Search products...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <ul ref={listRef} className='max-h-60 overflow-y-auto'>
            {options.map(option => (
              <li
                key={option.value}
                className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-customP2ForegroundD_200 cursor-pointer dark:text-slate-50'
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </li>
            ))}
            {loading && (
              <li className='px-4 py-2 text-center text-gray-500 dark:text-slate-300'>
                Loading...
              </li>
            )}
            {!loading && !hasMore && options.length > 0 && (
              <li className='px-4 py-2 text-center text-gray-500 dark:text-slate-300'>
                No more products
              </li>
            )}
            {!loading && options.length === 0 && (
              <li className='px-4 py-2 text-center text-gray-500 dark:text-slate-300'>
                No products found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export function Component() {
  const handleSelect = option => {
    console.log('Selected product:', option)
  }

  return (
    <div className='flex items-center justify-center w-full h-screen bg-gray-100 dark:bg-customP2ForegroundD_200'>
      <InfiniteScrollSelect onSelect={handleSelect} />
    </div>
  )
}
