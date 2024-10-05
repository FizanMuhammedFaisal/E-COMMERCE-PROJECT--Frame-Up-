import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import apiClient from '../../../services/api/apiClient'
import ProductDetails from '../../../components/layout/UserSide/Products/ProductDetails'
import api from '../../../services/api/api'

function ProductDetailPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get(`/products/${productId}`)
      .then(response => {
        setProduct(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching product:', error)
        setError('Failed to load product details.')
        setLoading(false)
      })
  }, [productId])

  const handleThumbnailClick = index => {
    setSelectedImageIndex(index)
  }

  if (loading) return <div className='text-center py-16'>Loading...</div>
  if (error) return <div className='text-center py-16'>{error}</div>

  const allImages = [
    ...(product.thumbnailImage || []),
    ...(product.productImages || [])
  ]

  return (
    <div className='min-h-screen bg-white'>
      <ProductDetails
        allImages={allImages}
        handleThumbnailClick={handleThumbnailClick}
        selectedImageIndex={selectedImageIndex}
        product={product}
      />
    </div>
  )
}

export default ProductDetailPage
