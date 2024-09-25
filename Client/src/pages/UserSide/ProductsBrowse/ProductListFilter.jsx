import React, { useState, useEffect } from 'react'
import {
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '../../../hooks/useDebounce'
const ProductListFilter = ({
  onFiltersChange,
  setIsFilterOpen,
  isFilterOpen,
  setIncludeCategories,
  availableCategories
}) => {
  const [filters, setFilters] = useState({
    Themes: [],
    Styles: [],
    Techniques: [],
    priceRange: [0, 10000],
    aA_zZ: false,
    zZ_aA: false
  })
  const debouncedFilter = useDebounce(filters, 500)
  useEffect(() => {
    onFiltersChange(debouncedFilter)
  }, [debouncedFilter, onFiltersChange])

  const handleFilterChange = (option, value) => {
    setFilters(prev => ({
      ...prev,
      [option]: prev[option].includes(value)
        ? prev[option].filter(item => item !== value)
        : [...prev[option], value]
    }))
  }
  const handleSortChange = filterKey => {
    setFilters(prev => ({
      ...prev,
      aA_zZ: filterKey === 'aA_zZ' ? !prev[filterKey] : false,
      zZ_aA: filterKey === 'zZ_aA' ? !prev[filterKey] : false
    }))
  }

  const handlePriceChange = newPrice => {
    setIncludeCategories(true)
    setFilters(prev => ({
      ...prev,
      priceRange: [prev.priceRange[0], newPrice]
    }))
  }

  const clearFilters = () => {
    setFilters({
      Themes: [],
      Styles: [],
      Techniques: [],
      priceRange: [0, 10000],
      aA_zZ: false,
      zZ_aA: false
    })
  }

  const filterContent = (
    <div className='space-y-6 ps-2 overflow-y-auto max-h-[calc(100vh-100px)] lg:max-h-none'>
      {Object.keys(availableCategories).map(category => (
        <div
          key={category}
          className='border-b border-gray-200 pb-4 last:border-b-0'
        >
          <h3 className='font-semibold mb-3 text-gray-700'>{category}</h3>
          <div className='space-y-2'>
            {availableCategories[category].map(option => (
              <div
                key={`${category}-${option.categoryName}`}
                className='flex items-center'
              >
                <input
                  type='checkbox'
                  id={`${category}-${option.categoryName}`}
                  checked={filters[category].includes(option.categoryName)}
                  onChange={() =>
                    handleFilterChange(category, option.categoryName)
                  }
                  className='form-checkbox h-5 w-5 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500 transition duration-150 ease-in-out'
                />
                <label
                  htmlFor={`${category}-${option.categoryName}`}
                  className='ml-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer'
                >
                  {option.categoryName}
                </label>
                <p className='ms-1 font-thin'>({option.count})</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className='border-b border-gray-200 pb-4 last:border-b-0'>
        <h3 className='font-semibold mb-3 text-gray-700'>Sort</h3>
        <div className='flex items-start flex-col'>
          <div>
            <input
              type='checkbox'
              id='aA_zZ'
              checked={filters['aA_zZ']}
              onChange={() => handleSortChange('aA_zZ')}
              className='form-checkbox h-5 w-5 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500 transition duration-150 ease-in-out'
            />
            <label
              htmlFor='sorting'
              className='ml-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer'
            >
              aA - zZ
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id=' zZ-aA'
              checked={filters['zZ_aA']}
              onChange={() => handleSortChange('zZ_aA')}
              className='form-checkbox h-5 w-5 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500 transition duration-150 ease-in-out'
            />
            <label
              htmlFor='sorting'
              className='ml-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer'
            >
              zZ - aA
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className='font-semibold mb-3 text-gray-700'>Price Range</h3>
        <div className='relative pt-1'>
          <input
            type='range'
            min='0'
            max='10000'
            step='100'
            value={filters.priceRange[1]}
            onChange={e => handlePriceChange(parseInt(e.target.value))}
            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
          />
          <div className='flex justify-between mt-2'>
            <span className='inline-block px-2 py-1 text-sm bg-customColorSecondary text-blue-800 rounded-full'>
              $0
            </span>
            <span className='inline-block px-2 py-1 text-sm bg-customColorSecondary text-blue-800 rounded-full'>
              ${filters.priceRange[1]}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile filter sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className='fixed inset-0 bg-black bg-opacity-65  z-50 lg:hidden'
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%', opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25
              }}
              className='fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-xl z-50'
              onClick={e => e.stopPropagation()}
            >
              <div className='p-6'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-2xl font-semibold text-gray-800 flex items-center'>
                    <AdjustmentsHorizontalIcon className='h-6 w-6 mr-2 text-gray-600' />
                    Filters
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className='text-gray-600  hover:text-gray-800 transition duration-150 ease-in-out'
                  >
                    <XMarkIcon className='h-6 w-6' />
                  </button>
                </div>
                {filterContent}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop filter content */}
      <div className='hidden lg:block bg-white rounded-lg p-6 border border-gray-200'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-semibold text-gray-800 flex items-center'>
            <AdjustmentsHorizontalIcon className='h-6 w-6 mr-2 text-gray-600' />
            Filters
          </h2>
          <button
            onClick={clearFilters}
            className='text-xs ms-3 bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-full hover:bg-gray-100 transition duration-300 ease-in-out'
          >
            Clear All
          </button>
        </div>
        {filterContent}
      </div>
    </>
  )
}

export default ProductListFilter
