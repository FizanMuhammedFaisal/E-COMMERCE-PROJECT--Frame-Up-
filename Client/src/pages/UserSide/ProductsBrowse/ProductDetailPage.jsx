import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductDetails from '../../../components/layout/UserSide/Products/ProductDetails'
import api from '../../../services/api/api'
import Spinner from '../../../components/common/Animations/Spinner'
import { useQuery } from '@tanstack/react-query'
import ErrorComponent from '../../../components/common/Animations/ErrorComponent'
function ProductDetailPage() {
  const { productId } = useParams()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const fetchData = async () => {
    const res = await api.get(`/products/${productId}`)
    if (!res.data.product || res.data.product.length === 0) {
      throw new Error('Product not found')
    }
    return res.data.product[0]
  }
  const {
    data: product,
    isLoading,
    isError,
    error
  } = useQuery({
    queryFn: fetchData,
    queryKey: ['productData', productId]
  })

  const handleThumbnailClick = index => {
    setSelectedImageIndex(index)
  }

  if (isLoading) return <Spinner center={true} />
  if (isError) {
    return <ErrorComponent error={error} />
  }

  const allImages = [
    ...(product.thumbnailImage || []),
    ...(product.productImages || [])
  ]

  return (
    <div className='min-h-screen font-primary bg-white'>
      {product ? (
        <ProductDetails
          allImages={allImages}
          handleThumbnailClick={handleThumbnailClick}
          selectedImageIndex={selectedImageIndex}
          product={product}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default ProductDetailPage
