import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import ProductCard from './ProductCard'

function ProductBrowseLayout({
  sortedPaintings,
  setIsFilterOpen,
  isFilterOpen,
  setSortBy,
  sortBy,
  isLoading
}) {
  console.log('inside produck browser layout')
  return (
    <div className='w-full lg:w-3/4'>
      <div className='flex flex-wrap justify-between items-center mb-6'>
        <p className='text-gray-600 font-medium mb-2 lg:mb-0'>
          {sortedPaintings.length} artworks
        </p>
        <div className='flex items-center'>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className='lg:hidden flex items-center justify-center w-10 h-10 mr-2 bg-white rounded-full shadow-md text-gray-600 hover:text-gray-800 focus:outline-none'
          >
            {isFilterOpen ? <FiX size={20} /> : <FiFilter size={20} />}
          </button>
          <div className='relative'>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className='appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='featured'>Featured</option>
              <option value='priceLowToHigh'>Price: Low to High</option>
              <option value='priceHighToLow'>Price: High to Low</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <FiChevronDown size={20} />
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      ) : (
        <ProductCard product={sortedPaintings} />
      )}
    </div>
  )
}

export default ProductBrowseLayout
