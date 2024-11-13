import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '../redux/slices/Users/Cart/cartSlice'
import { useEffect, useState } from 'react'
import apiClient from '../services/api/apiClient'
import {
  addItemsToWishlist,
  addToWishlist
} from '../redux/slices/Users/Wishlist/wishlistSlice'



const useFetchWishlist = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated) {
        setLoading(true)
        try {
          const res = await apiClient.get('/api/wishlist/')
          console.log(res?.data)
          dispatch(addItemsToWishlist(res?.data?.wishlist.items))
          setData(res?.data?.wishlist)
        } catch (error) {
          setError('Failed to fetch cart data')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchWishlist()
  }, [isAuthenticated])
  return { loading, error, data }
}

export { useFetchWishlist }
