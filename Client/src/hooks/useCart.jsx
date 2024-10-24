import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import apiClient from '../services/api/apiClient'
import {
  addToCartd,
  removeItemFromCart,
  updateQuantity
} from '../redux/slices/Users/Cart/cartSlice'
const useCart = () => {
  const dispatch = useDispatch()
  const { data: globalCart } = useSelector(state => state.cart)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const addToCart = async (productId, quantity = 0) => {
    setLoading(true)
    setError(null)

    try {
      const res = await apiClient.post('/api/cart/add-to-cart', {
        productId,
        quantity
      })
      if (!res.data?.cart?.items) {
        setError('Failed to add items to cart')
        return { success: false, error: 'Failed to add items to cart' }
      }

      dispatch(addToCartd(res.data.cart))
      return { success: true, cart: res.data.cart.items }
    } catch (error) {
      console.log(error)
      console.log(error.response.data.message)
      setError('Failed to add items to cart')
      return {
        success: false,
        error: error?.response?.data?.message || 'Failed to add items to cart'
      }
    } finally {
      setLoading(false)
    }
  }
  // for removing product from cart
  const removeFromCart = async productId => {
    setLoading(true)
    setError(null)

    try {
      const res = await apiClient.delete(`/api/cart/remove/${productId}`)
      console.log(res)
      dispatch(removeItemFromCart({ productId }))
      return { success: true, cart: res.data.cart }
    } catch (error) {
      setError('Failed to remove item from cart')
      return { success: false, error: 'Failed to remove item from cart' }
    } finally {
      setLoading(false)
    }
  }
  const updateCartQuantity = async (productId, quantityChange) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.put('/api/cart/update-quantity', {
        productId,
        quantityChange
      })
      const quantity = res.data.quantity
      dispatch(updateQuantity({ productId, quantity }))
      return { success: true, cart: res.data.quantity }
    } catch (error) {
      setError('Failed to update cart quantity')
      return { success: false, error: 'Failed to update cart quantity' }
    } finally {
      setLoading(false)
    }
  }

  return {
    addToCart,
    error,
    loading,
    cart: globalCart,
    removeFromCart,
    updateCartQuantity
  }
}

export { useCart }
