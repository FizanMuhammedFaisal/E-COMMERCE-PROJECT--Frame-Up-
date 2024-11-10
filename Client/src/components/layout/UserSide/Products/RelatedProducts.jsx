import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../../services/api/apiClient'
import ProductCard from './ProductCard'
import Spinner from '../../../common/Animations/Spinner'
import { useDispatch, useSelector } from 'react-redux'
import {
  addToWishlist,
  removeFromWishlist
} from '../../../../redux/slices/Users/Wishlist/wishlistSlice'
import { toast } from 'sonner'

function RelatedProducts({ productId }) {
  const fetchRelatedProducts = async () => {
    try {
      const response = await apiClient.get(
        `/api/products/get-related-products/${productId}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching related products:', error)
      throw error
    }
  }
  const wishlistItems = useSelector(state => state.wishlist.items)
  const { isAuthenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const handleAddToWishlist = async productId => {
    if (!isAuthenticated) {
      return toast.error('Login to Add To Wislist')
    }
    try {
      const res = await apiClient.post('/api/wishlist/add', { productId })
      console.log(res.data)
      if (res.status) {
        dispatch(addToWishlist(productId))
      }
    } catch (error) {
      //handle error case
      console.log(error)
    }
  }
  const handleRemoveFromWishlist = async productId => {
    try {
      const res = await apiClient.post('/api/wishlist/remove', { productId })
      console.log(res.data)
      if (res.status) {
        dispatch(removeFromWishlist(productId))
      }
    } catch (error) {
      //handle error case
      console.log(error)
    }
  }

  const { data, isError, isLoading } = useQuery({
    queryFn: fetchRelatedProducts,
    queryKey: ['relatedProducts', productId],
    staleTime: 5 * 60 * 1000
  })

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-40'>
        <Spinner size={1} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='text-center text-red-500 py-4'>
        Unable to load related products. Please try again later.
      </div>
    )
  }

  if (!data?.products || data.products.length === 0) {
    return (
      <div className='text-center text-gray-500 py-4'>
        No related products found.
      </div>
    )
  }

  return (
    <div className='py-8'>
      <h2 className='text-2xl font-bold mb-4 px-4'>Related Products</h2>
      <div className='flex overflow-x-auto scrollbar-hidden gap-6 px-4 pb-4'>
        {data.products.map(product => (
          <div
            key={`${product._id}relatedProducts`}
            className='flex-shrink-0 flex flex-col w-64'
          >
            <ProductCard
              addToWishlist={handleAddToWishlist}
              removeFromWishlist={handleRemoveFromWishlist}
              wishlistItems={wishlistItems}
              viewMode='grid'
              product={product}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
