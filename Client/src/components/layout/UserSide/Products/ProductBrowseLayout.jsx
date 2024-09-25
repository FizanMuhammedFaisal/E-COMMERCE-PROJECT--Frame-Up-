import React, { useState } from 'react'
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList } from 'react-icons/fi'
import ProductCard from './ProductCard'
import CircularProgress from '@mui/material/CircularProgress'

function ProductBrowseLayout({
  sortedProducts,
  setIsFilterOpen,
  isFilterOpen,
  setSortBy,
  sortBy,
  isLoading,
  currentPage,
  totalPages,
  handlePageChange
}) {
  const [viewMode, setViewMode] = useState('grid')

  const renderPaginationButtons = () => {
    const buttons = []
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mx-1 px-4 py-2 rounded-md transition-colors duration-200 ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-100'
          }`}
        >
          {i}
        </button>
      )
    }
    return buttons
  }

  return (
    <div className='w-full lg:w-3/4 bg-gray-50 p-6 rounded-lg shadow-lg'>
      <div className='flex flex-wrap justify-between items-center mb-6'>
        <p className='text-gray-600 font-medium mb-2 lg:mb-0'>
          Displaying {sortedProducts.length} artworks
        </p>
        <div className='flex items-center space-x-4'>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className='lg:hidden flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md text-gray-600 hover:text-gray-800 focus:outline-none transition-colors duration-200'
          >
            {isFilterOpen ? <FiX size={20} /> : <FiFilter size={20} />}
          </button>
          <div className='relative'>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className='appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
            >
              <option value='featured'>Featured</option>
              <option value='priceLowToHigh'>Price: Low to High</option>
              <option value='priceHighToLow'>Price: High to Low</option>
            </select>
            <FiChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          </div>
          <div className='hidden sm:flex space-x-2'>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiList size={20} />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <div
            className={`grid ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            } gap-6 transition-all duration-300 ease-in-out`}
          >
            {sortedProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                viewMode={viewMode}
              />
            ))}
          </div>
          <div className='flex justify-center mt-8'>
            {renderPaginationButtons()}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductBrowseLayout
