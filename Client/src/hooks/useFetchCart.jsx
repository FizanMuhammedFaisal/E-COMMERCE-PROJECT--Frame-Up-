import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '../redux/slices/Users/Cart/cartSlice'
import { useEffect, useState } from 'react'
import apiClient from '../services/api/apiClient'

const useFetchCart = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        setLoading(true)
        try {
          const res = await apiClient.get('/api/cart')

          dispatch(setCart(res.data.cart))
        } catch (error) {
          setError('Failed to fetch cart data')
        } finally {
          setLoading(false)
        }
      }

    }

    fetchCart()
  }, [isAuthenticated])
}

export { useFetchCart }
