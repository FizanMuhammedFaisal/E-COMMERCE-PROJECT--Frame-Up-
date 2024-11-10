import { useState, useEffect } from 'react'
import {
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '../../../hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'

function ProductListFilter({
  onFiltersChange,
  setIsFilterOpen,
  isFilterOpen,
  availableCategories,
  onSearch
}) {
  const [searchData, setSearchData] = useState('')
  const [filters, setFilters] = useState({
    Themes: [],
    Styles: [],
    Techniques: [],
    priceRange: [0, 100000],
    aA_zZ: false,
    zZ_aA: false
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const [urlLoaded, setUrlLoaded] = useState(false)

  useEffect(() => {
    const initialFilters = {
      Themes: searchParams.get('Themes')?.split(',') || [],
      Styles: searchParams.get('Styles')?.split(',') || [],
      Techniques: searchParams.get('Techniques')?.split(',') || [],
      priceRange: [0, Number(searchParams.get('priceRange')) || 100000],
      aA_zZ: searchParams.get('aA_zZ') === 'true',
      zZ_aA: searchParams.get('zZ_aA') === 'true'
    }
    const search = searchParams.get('searchQuery') || ''
    setFilters(initialFilters)
    setSearchData(search)
    setUrlLoaded(true)

    onFiltersChange(initialFilters)
    onSearch(search)
  }, [searchParams])
  const [expandedCategories, setExpandedCategories] = useState({})
  const debouncedFilter = useDebounce(filters, 500)
  const debouncedSearchData = useDebounce(searchData, 500)

  useEffect(() => {
    if (!urlLoaded) {
      return setUrlLoaded(true)
    }
    const newParams = new URLSearchParams(searchParams)

    onFiltersChange(debouncedFilter)
    onSearch(debouncedSearchData)

    if (searchData.length > 0) {
      newParams.set('searchQuery', searchData)
    } else {
      newParams.delete('searchQuery')
    }

    if (debouncedFilter.Themes.length > 0) {
      newParams.set('Themes', debouncedFilter.Themes.join(','))
    }
    if (debouncedFilter.Styles.length > 0) {
      newParams.set('Styles', debouncedFilter.Styles.join(','))
    } else {
      newParams.delete('Styles')
    }

    if (debouncedFilter.Techniques.length > 0) {
      newParams.set('Techniques', debouncedFilter.Techniques.join(','))
    } else {
      newParams.delete('Techniques')
    }

    if (debouncedFilter.priceRange[1] !== 10000) {
      newParams.set('priceRange', debouncedFilter.priceRange[1].toString())
    } else {
      newParams.delete('priceRange')
    }

    // Handle sorting options
    if (debouncedFilter.aA_zZ) {
      newParams.set('aA_zZ', 'true')
      newParams.delete('zZ_aA')
    } else if (debouncedFilter.zZ_aA) {
      newParams.set('zZ_aA', 'true')
      newParams.delete('aA_zZ')
    } else {
      newParams.delete('aA_zZ')
      newParams.delete('zZ_aA')
    }

    if (newParams.toString() !== searchParams.toString()) {
      setSearchParams(newParams)
    }

    // Trigger filtering/search
  }, [debouncedFilter, debouncedSearchData])
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
      priceRange: [0, 100000],
      aA_zZ: false,
      zZ_aA: false
    })
  }

  const toggleCategory = category => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const filterContent = (
    <div className='space-y-6 ps-2 overflow-y-auto max-h-[calc(100vh-100px)] lg:max-h-none'>
      {Object.keys(availableCategories).map(category => (
        <div
          key={category}
          className='border-b border-gray-200 pb-4 last:border-b-0'
        >
          <div className='flex justify-between items-center'>
            <h3 className='font-semibold mb-3 text-gray-700'>{category}</h3>
            <button
              onClick={() => toggleCategory(category)}
              className='focus:outline-none'
            >
              {expandedCategories[category] ? (
                <MinusIcon className='h-5 w-5 text-gray-500' />
              ) : (
                <PlusIcon className='h-5 w-5 text-gray-500' />
              )}
            </button>
          </div>
          <AnimatePresence>
            {expandedCategories[category] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='space-y-2 overflow-hidden'
              >
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
                      className='form-checkbox h-5 w-5 text- rounded-full border-gray-300 focus:ring-customP2BackgroundD_600 transition duration-300 ease-in-out accent-customColorTertiary'
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
              </motion.div>
            )}
          </AnimatePresence>
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
              className='form-checkbox h-5 w-5 text-customColorTertiaryLight rounded-full border-gray-300 focus:ring-customColorTertiaryLight transition duration-150 ease-in-out accent-customColorTertiary'
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
              className='form-checkbox h-5 w-5 text-customColorTertiaryLight rounded-full border-gray-300 focus:ring-customColorTertiaryLight transition duration-150 ease-in-out accent-customColorTertiary'
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
            max='100000'
            step='100'
            value={filters.priceRange[1]}
            onChange={e => handlePriceChange(parseInt(e.target.value))}
            className='w-full h-2 bg-customColorPrimaryLight border border-customaccent-customColorTertiary rounded-lg appearance-none cursor-pointer accent-customColorTertiary'
          />
          <div className='flex justify-between mt-2'>
            <span className='inline-block px-2 py-1 text-sm bg-customColorPrimary text-customP2BackgroundD_600 rounded-full '>
              ₹0
            </span>
            <span className='inline-block px-2 py-1 text-sm bg-customColorPrimary text-customP2BackgroundD_600 rounded-full'>
              ₹{filters.priceRange[1]}
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
              className='fixed inset-y-0 left-0 w-4/5 max-w-xs bg-customColorSecondary shadow-xl z-50'
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
      <div className='hidden lg:block bg-white rounded-lg p-6 '>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-semibold text-gray-800 flex items-center'>
            <AdjustmentsHorizontalIcon className='h-6 w-6 mr-2 text-gray-600' />
            Filters
          </h2>
          <button
            onClick={clearFilters}
            className='text-xs ms-3 bg-white border hover:bg-customaccent-customColorTertiary/40  border-gray-300 text-gray-700 py-1 px-3 rounded-full transition duration-300 ease-in-out'
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
