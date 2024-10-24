import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Tag as TagIcon, ChevronDown, ChevronUp } from 'lucide-react'
import {
  CircularProgress,
  Alert,
  AlertTitle,
  LinearProgress
} from '@mui/material'
import apiClient from '../../services/api/apiClient'
import { useDispatch } from 'react-redux'
import { applyCoupon } from '../../redux/slices/Users/Cart/cartSlice'

const ApplyCouponMenu = ({ totalPurchaseAmount, setAppliedCoupon }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [applied, setApplied] = useState({ code: null, discountAmount: null })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()

  const fetchCoupons = async () => {
    const res = await apiClient.get('/api/coupons/')
    console.log(res.data)
    return res.data.coupons
  }

  const {
    data: coupons,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['coupons'],
    queryFn: fetchCoupons,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  })

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleCouponToggle = async code => {
    setLoading(true)
    setError(null)
    try {
      if (applied.code === code) {
        // remove coupon

        const res = await apiClient.post('/api/coupons/remove-coupon', {
          totalPurchaseAmount
        })
        if (res.data.success) {
          dispatch(applyCoupon({ discount: -applied.discountAmount }))
          setAppliedCoupon(null)
          setApplied({ code: null, discountAmount: null })
        }
      } else {
        if (applied.code) {
          const res = await apiClient.post('/api/coupons/remove-coupon', {
            totalPurchaseAmount
          })
          if (res.data.success) {
            dispatch(applyCoupon({ discount: -applied.discountAmount }))
            setAppliedCoupon(null)
            setApplied({ code: null, discountAmount: null })
          }
        }
        // apply new
        const res = await apiClient.post('/api/coupons/apply-coupon', {
          code,
          totalPurchaseAmount
        })
        if (res.data.success) {
          setAppliedCoupon(code)
          setApplied({ code: code, discountAmount: res.data.discountAmount })
          dispatch(applyCoupon({ discount: res.data.discountAmount }))
        }
      }
    } catch (error) {
      console.error('Error toggling coupon:', error)
      setError(
        error.response?.data?.message ||
          'An error occurred while processing your request.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full mt-6 mx-auto'>
      <div className='bg-white shadow-lg rounded-lg overflow-hidden mb-8'>
        <div className='p-6'>
          <h3 className='text-xl font-semibold mb-4 flex items-center text-gray-800'>
            <TagIcon className='h-6 w-6 mr-3 text-customColorTertiary' />
            Apply Coupon
          </h3>
          <button
            onClick={toggleMenu}
            className='w-full bg-customColorTertiary hover:bg-customColorTertiaryLight text-white py-3 px-4 rounded-md font-medium transition duration-300 ease-in-out text-lg shadow-md flex items-center justify-center'
          >
            <TagIcon className='h-5 w-5 mr-2' />
            {isOpen ? 'Close' : 'Apply Coupon'}
            {isOpen ? (
              <ChevronUp className='ml-2 h-5 w-5' />
            ) : (
              <ChevronDown className='ml-2 h-5 w-5' />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className='border-t border-gray-200'
            >
              <div className='p-6'>
                <h4 className='text-sm font-medium mb-2'>Available Coupons</h4>
                {isLoading && <CircularProgress className='my-4' />}
                {isError && (
                  <Alert severity='error' className='mb-4'>
                    <AlertTitle>Error</AlertTitle>
                    Failed to load coupons. Please try again later.
                  </Alert>
                )}
                {error && (
                  <Alert severity='error' className='mb-4'>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                  </Alert>
                )}
                {coupons && coupons.length > 0 && (
                  <div className='max-h-[200px] overflow-y-auto'>
                    {coupons.map(coupon => (
                      <div
                        key={coupon.code}
                        className='flex justify-between items-center py-2 border-b last:border-b-0'
                      >
                        <div>
                          <p className='font-medium'>{coupon.code}</p>
                          <p className='text-sm text-gray-500'>
                            {coupon.discountType === 'percentage'
                              ? `${coupon.discountAmount}% off`
                              : `₹${coupon.discountAmount} off`}
                            {coupon.maxDiscountAmount &&
                            coupon.discountType === 'percentage'
                              ? ` (Up to ₹${coupon.maxDiscountAmount})`
                              : ''}
                          </p>
                          <p className='text-sm text-gray-500'>
                            Minimum Purchase: ₹{coupon.minPurchaseAmount}
                          </p>
                          <p className='text-sm text-gray-500'>
                            Valid from:{' '}
                            {new Date(coupon.validFrom).toLocaleDateString()} to{' '}
                            {new Date(coupon.validTill).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCouponToggle(coupon.code)}
                          disabled={loading}
                          className={`px-3 py-1 text-sm border rounded transition-colors duration-300 ${
                            applied.code === coupon.code
                              ? 'text-red-500 border-red-500 hover:bg-red-50'
                              : 'text-customColorTertiary border-customColorTertiary hover:bg-indigo-50'
                          }`}
                        >
                          {applied.code === coupon.code ? 'Remove' : 'Apply'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className='mt-2'>
                  {loading && <LinearProgress color='inherit' />}
                </div>

                {coupons && coupons.length === 0 && (
                  <p className='text-sm text-gray-500'>
                    No coupons available at the moment.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ApplyCouponMenu
