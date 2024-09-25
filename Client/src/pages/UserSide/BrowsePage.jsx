import React, { useEffect, useState } from 'react'
import Navbar from '../../components/common/Navbar'
import apiClient from '../../services/api/apiClient'
import ProductCard from '../../components/layout/UserSide/Products/ProductCard'
import { CircularProgress } from '@mui/material'

function BrowsePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  //
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(4)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    setLoading(true)
    apiClient
      .get(
        `/api/products/get-products?page=${currentPage}&limit=${itemsPerPage}`
      )
      .then(response => {
        setProducts(response.data.products || [])
        setTotalItems(response.data.totalItems || 0) // Assuming your API returns totalItems
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching products:', error)
        setError('Failed to load products.')
        setLoading(false)
      })
  }, [currentPage, itemsPerPage])
  console.log(products)
  //
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
  }

  // Loading state
  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <CircularProgress size={35} color='inherit' />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-red-500'>{error}</p>
      </div>
    )
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-gray-600'>No products available at the moment.</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white '>
      <section className='py-10'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold mb-8 text-center text-gray-900'>
            Browse Artworks
          </h2>

          {/* Responsive Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300 ease-in-out'>
            {products.map(product => (
              <ProductCard key={product._id} product={products} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className='flex justify-between items-center mt-8'>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400'
            >
              Previous
            </button>

            <span className='text-gray-700'>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400'
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BrowsePage
