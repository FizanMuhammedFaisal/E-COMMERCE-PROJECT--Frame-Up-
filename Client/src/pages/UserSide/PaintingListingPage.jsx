import { useState, useEffect } from 'react'
import api from '../../services/api/api'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ProductBrowseLayout from '../../components/layout/UserSide/Products/ProductBrowseLayout'

const PaintingListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [paintings, setPaintings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    Themes: [],
    Styles: [],
    Techniques: [],
    priceRange: [0, 10000]
  })
  const [sortBy, setSortBy] = useState('featured')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  useEffect(() => {
    const { Themes, Styles, Techniques, priceRange } = filters
    const queryParams = {
      page,
      sortBy,
      themes: Themes.join(','),
      styles: Styles.join(','),
      techniques: Techniques.join(','),
      priceRange: priceRange.join(',')
    }

    // Set the query params in the URL
    setSearchParams(queryParams)

    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await api.get('/products/get-products', {
          params: queryParams
        })
        setPaintings(response.data.products)
      } catch (error) {
        console.error('Failed to fetch paintings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [filters, sortBy, page])

  const toggleFilter = (category, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [category]: prevFilters[category].includes(value)
        ? prevFilters[category].filter(item => item !== value)
        : [...prevFilters[category], value]
    }))
  }

  const clearFilters = () => {
    setFilters({
      Themes: [],
      Styles: [],
      Techniques: [],
      priceRange: [0, 10000]
    })
  }

  const filteredPaintings = paintings.filter(
    painting =>
      (filters.Themes.length === 0 ||
        filters.Themes.includes(painting.Themes)) &&
      (filters.Styles.length === 0 ||
        filters.Styles.includes(painting.Styles)) &&
      (filters.Techniques.length === 0 ||
        filters.Techniques.includes(painting.Techniques)) &&
      painting.productPrice >= filters.priceRange[0] &&
      painting.productPrice <= filters.priceRange[1]
  )

  const sortedPaintings = [...filteredPaintings].sort((a, b) => {
    if (sortBy === 'priceLowToHigh') return a.productPrice - b.productPrice
    if (sortBy === 'priceHighToLow') return b.productPrice - a.productPrice
    return 0 // 'featured' or default
  })

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-12'>
        <h1 className='text-4xl font-bold mb-8 text-gray-800'>
          Discover Unique Artworks
        </h1>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Filters Sidebar */}
          <div
            className={`lg:w-1/4 transition-all duration-300 ease-in-out ${
              isFilterOpen
                ? 'max-h-screen opacity-100'
                : 'max-h-0 opacity-0 lg:max-h-screen lg:opacity-100'
            }`}
          >
            <div className=' p-6 '>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-semibold text-gray-800'>
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className='text-blue-600 hover:text-blue-800 font-medium'
                >
                  Clear All
                </button>
              </div>
              {['Themes', 'Styles', 'Techniques'].map(category => (
                <div key={category} className='mb-6'>
                  <h3 className='font-semibold mb-3 text-gray-700'>
                    {category}
                  </h3>
                  {[
                    'Oil',
                    'Acrylic',
                    'Watercolor',
                    'Mixed Media',
                    'Abstract',
                    'Landscape',
                    'Modern',
                    'Impressionist',
                    'Still Life',
                    'Small',
                    'Medium',
                    'Large'
                  ].map(option => (
                    <div key={option} className='flex items-center mb-2'>
                      <input
                        type='checkbox'
                        id={`${category}-${option}`}
                        checked={filters[category].includes(option)}
                        onChange={() => toggleFilter(category, option)}
                        className='form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out'
                      />
                      <label
                        htmlFor={`${category}-${option}`}
                        className='ml-2 text-gray-700'
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
              <div>
                <button
                  onClick={() => {
                    console.log(filters)
                  }}
                >
                  sdfa
                </button>
                <h3 className='font-semibold mb-3 text-gray-700'>
                  Price Range
                </h3>
                <input
                  type='range'
                  min='0'
                  max='5000'
                  step='100'
                  value={filters.priceRange[1]}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      priceRange: [0, parseInt(e.target.value)]
                    }))
                  }
                  className='w-full'
                />
                <div className='flex justify-between text-gray-600 mt-2'>
                  <span>$0</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Paintings Grid */}
          <ProductBrowseLayout
            setIsFilterOpen={setIsFilterOpen}
            sortedPaintings={sortedPaintings}
            isFilterOpen={isFilterOpen}
            setSortBy={setSortBy}
            sortBy={sortBy}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className='w-full'>
        <button onClick={() => handlePageChange(page - 1)} className=''>
          Previous
        </button>
        <button onClick={() => handlePageChange(page + 1)}>Next</button>
      </div>
    </div>
  )
}

export default PaintingListingPage
