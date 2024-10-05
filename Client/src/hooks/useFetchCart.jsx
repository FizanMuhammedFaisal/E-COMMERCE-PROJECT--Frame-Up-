import { useDispatch } from 'react-redux'
import { setCart } from '../redux/slices/Users/Cart/cartSlice'
import { useEffect, useState } from 'react'
import apiClient from '../services/api/apiClient'

const useFetchCart = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get('/api/cart')
        dispatch(setCart(res.data.cart))
        return { success: true, message: 'fetched' }
      } catch (error) {
        setError('Failed to fetch cart data')
        return {
          success: false,
          error: 'failed to fetchcart'
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])
}

export { useFetchCart }
