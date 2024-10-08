import { useState, useEffect } from 'react'
import api from '../../../services/api/api'
import { useSearchParams } from 'react-router-dom'
import ProductBrowseLayout from '../../../components/layout/UserSide/Products/ProductBrowseLayout'
import ProductListFilter from './ProductListFilter'
import { useQuery } from '@tanstack/react-query'

const ProductBrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [sortBy, setSortBy] = useState('featured')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [totalpages, setTotalpages] = useState('')
  const [availableCategories, setAvailableCategories] = useState([])
  // State to control when to include categories
  const [includeCategories, setIncludeCategories] = useState(true)
  // Store the filters in state
  const [searchData, setSearchData] = useState(null)
  const [filters, setFilters] = useState({
    searchQuery: '',
    Themes: [],
    Styles: [],
    Techniques: [],
    priceRange: [0, 10000]
  })
  const limit = 6

  // Function to fetch products with the provided filters, page, and sort order
  const fetchProducts = async ({
    page,
    sortBy,
    filters,
    includeCategories,
    searchData
  }) => {
    const { Themes, Styles, Techniques, priceRange, aA_zZ, zZ_aA } = filters
    const response = await api.get('/products/get-products', {
      params: {
        page,
        limit,
        sortBy,
        themes: Themes.join(','),
        styles: Styles.join(','),
        techniques: Techniques.join(','),
        priceRange: priceRange.join(','),
        aA_zZ,
        zZ_aA,
        includeCategories,
        searchData
      }
    })
    setTotalpages(response.data.totalPages)

    return response.data
  }

  // Use React Query to fetch products
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'products',
      { sortBy, page, filters, includeCategories, searchData }
    ],
    queryFn: () =>
      fetchProducts({ page, sortBy, filters, includeCategories, searchData }),
    keepPreviousData: true
  })

  // Update the products when new data arrives
  useEffect(() => {
    if (data && data.products) {
      setProducts(data.products)
      if (data.availableCategories) {
        setAvailableCategories(data.availableCategories)
      }
    }
  }, [data])

  // Handle filter change and update the filters state
  const handleFiltersChange = newFilters => {
    // Update the URL with filters

    setFilters(newFilters)
  }
  const onSearch = searchData => {
    setSearchData(searchData)
  }
  // Pagination handler
  const handlePageChange = newPage => {
    if (newPage > 0) {
      setPage(newPage)

      const params = new URLSearchParams(searchParams)
      params.set('page', newPage)
      setSearchParams(params)
    }
  }

  return (
    <div className='min-h-screen bg-white  w-full font-primary'>
      <div>
        <div className=' py-6 mb-7  flex justify-center'>
          <h1 className=' md:text-4.5xl  text-4xl font-primary tracking-tight leading-5 font-semibold text-center text-customColorTertiaryDark'>
            {searchData
              ? `Search Result for '${searchData}'`
              : '  Discover Unique Artworks'}
          </h1>
        </div>
        <div className='flex flex-col  mx-9 lg:flex-row gap-8'>
          <ProductListFilter
            onSearch={onSearch}
            isFilterOpen={isFilterOpen}
            availableCategories={availableCategories}
            onFiltersChange={handleFiltersChange}
            setIsFilterOpen={setIsFilterOpen}
            setIncludeCategories={setIncludeCategories}
          />
          {/* Product Grid */}
          <ProductBrowseLayout
            handlePageChange={handlePageChange}
            setIsFilterOpen={setIsFilterOpen}
            sortedProducts={products}
            isFilterOpen={isFilterOpen}
            setSortBy={setSortBy}
            sortBy={sortBy}
            isLoading={isLoading}
            totalPages={totalpages}
            currentPage={page}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductBrowsePage
