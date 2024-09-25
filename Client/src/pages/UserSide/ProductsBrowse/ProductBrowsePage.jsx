import { useState, useEffect } from 'react'
import api from '../../../services/api/api'
import { useSearchParams } from 'react-router-dom'
import ProductBrowseLayout from '../../../components/layout/UserSide/Products/ProductBrowseLayout'
import ProductListFilter from './ProductListFilter'
import { useQuery } from '@tanstack/react-query'

const ProductBrowsePage = () => {
  // const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [sortBy, setSortBy] = useState('featured')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [totalpages, setTotalpages] = useState('')
  const [availableCategories, setAvailableCategories] = useState([])
  // State to control when to include categories
  const [includeCategories, setIncludeCategories] = useState(true)
  // Store the filters in state

  const [filters, setFilters] = useState({
    Themes: [],
    Styles: [],
    Techniques: [],
    priceRange: [0, 10000]
  })
  const limit = 3

  // Function to fetch products with the provided filters, page, and sort order
  const fetchProducts = async ({
    page,
    sortBy,
    filters,
    includeCategories
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
        includeCategories
      }
    })
    setTotalpages(response.data.totalPages)
    console.log(response.data)
    return response.data
  }

  // Use React Query to fetch products
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', { sortBy, page, filters, includeCategories }],
    queryFn: () => fetchProducts({ page, sortBy, filters, includeCategories }),
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
    setFilters(newFilters)
  }
  // Pagination handler
  const handlePageChange = newPage => {
    console.log(newPage)
    if (newPage > 0) {
      setPage(newPage)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 font-primary'>
      <div className='container mx-auto px-4 py-12'>
        <h1 className='text-4xl font-bold mb-8 text-textPrimary font-tertiary'>
          Discover Unique Artworks
        </h1>
        <div className='flex flex-col lg:flex-row gap-8'>
          <ProductListFilter
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
      <div className='w-full'></div>
    </div>
  )
}

export default ProductBrowsePage
