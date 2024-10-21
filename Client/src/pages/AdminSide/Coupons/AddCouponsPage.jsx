import { useState } from 'react'
import { toast } from 'react-toastify'
import apiClient from '../../../services/api/apiClient'

import { CalendarIcon } from 'lucide-react'
import { validateCoupon } from '../../../utils/validation/FormValidation'
import { useNavigate } from 'react-router-dom'

export default function AddCouponForm() {
  const [formData, setFormData] = useState({
    code: '',
    discountType: '',
    discountAmount: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    validFrom: '',
    validTill: '',
    status: true
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const handleChange = e => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // Validate form data
    const validationErrors = validateCoupon(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const newCoupon = {
      ...formData,
      discountAmount: Number(formData.discountAmount),
      minPurchaseAmount: formData.minPurchaseAmount
        ? Number(formData.minPurchaseAmount)
        : 0,
      maxDiscountAmount: formData.maxDiscountAmount
        ? Number(formData.maxDiscountAmount)
        : undefined,
      validFrom: new Date(formData.validFrom),
      validTill: new Date(formData.validTill)
    }

    try {
      const res = await apiClient.post('/api/coupons/add-coupon', { newCoupon })
      navigate('/dashboard/coupons')
      toast.success('Coupon Created', {
        className:
          'bg-white dark:bg-customP2ForegroundD_400 font-primary dark:text-white'
      })

      // Reset form fields
      setFormData({
        code: '',
        discountType: '',
        discountAmount: '',
        minPurchaseAmount: '',
        maxDiscountAmount: '',
        validFrom: '',
        validTill: '',
        status: true
      })
      setErrors({})
    } catch (err) {
      console.error('Failed to add coupon:', err)
      setErrors({ general: 'Failed to add coupon. Please try again.' })
    }
  }

  return (
    <div className='p-8 rounded-lg w-full lg:max-w-full font-primary mx-auto md:px-20 mt-10'>
      <h1 className='text-4xl font-primary font-bold mb-6 text-start'>
        Add New Coupon
      </h1>

      {errors.general && (
        <div className='dark:bg-customP2ForegroundD_400 border-customP2ForegroundD_600 border bg-customP2ForeGroundW_500 py-2 mb-4 rounded-lg'>
          <p className='text-red-900 dark:text-red-500 ms-4 text-start'>
            {errors.general}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='form-group'>
          <label
            htmlFor='code'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Coupon Code
          </label>
          <input
            type='text'
            id='code'
            name='code'
            value={formData.code}
            onChange={handleChange}
            placeholder='Enter coupon code'
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          />
          <div className='pt-2 font-tertiary'>
            {errors && (
              <p className='text-red-500 hover:text-red-300'>{errors.code}</p>
            )}
          </div>
        </div>

        <div className='form-group'>
          <label
            htmlFor='discountType'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Discount Type
          </label>
          <select
            id='discountType'
            name='discountType'
            value={formData.discountType}
            onChange={handleChange}
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          >
            <option value=''>Select discount type</option>
            <option value='percentage'>Percentage</option>
            <option value='fixed'>Fixed</option>
          </select>
          <div className='pt-2 font-tertiary'>
            {errors && (
              <p className='text-red-500 hover:text-red-300'>
                {errors.discountType}
              </p>
            )}
          </div>
        </div>

        <div className='form-group'>
          <label
            htmlFor='discountAmount'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Discount Amount
          </label>
          <input
            type='number'
            id='discountAmount'
            name='discountAmount'
            value={formData.discountAmount}
            onChange={handleChange}
            placeholder='Enter discount amount'
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          />
          <div className='pt-2 font-tertiary'>
            {errors && (
              <p className='text-red-500 hover:text-red-300'>
                {errors.discountAmount}
              </p>
            )}
          </div>
        </div>

        <div className='form-group'>
          <label
            htmlFor='minPurchaseAmount'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Minimum Purchase Amount
          </label>
          <input
            type='number'
            id='minPurchaseAmount'
            name='minPurchaseAmount'
            value={formData.minPurchaseAmount}
            onChange={handleChange}
            placeholder='Enter minimum purchase amount'
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          />
          <div className='pt-2 font-tertiary'>
            {errors && (
              <p className='text-red-500 hover:text-red-300'>
                {errors.minPurchaseAmount}
              </p>
            )}
          </div>
        </div>

        <div className='form-group'>
          <label
            htmlFor='maxDiscountAmount'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Maximum Discount Amount
          </label>
          <input
            type='number'
            id='maxDiscountAmount'
            name='maxDiscountAmount'
            value={formData.maxDiscountAmount}
            onChange={handleChange}
            placeholder='Enter maximum discount amount'
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          />
          <div className='pt-2 font-tertiary'>
            {errors && (
              <p className='text-red-500 hover:text-red-300'>
                {errors.maxDiscountAmount}
              </p>
            )}
          </div>
        </div>

        <div className='form-group relative'>
          <label
            htmlFor='validFrom'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Valid From
          </label>
          <div className='relative'>
            <input
              type='datetime-local'
              id='validFrom'
              name='validFrom'
              value={formData.validFrom}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
            />
            <CalendarIcon className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300' />
          </div>
          <div className='pt-2 font-tertiary'>
            {errors && (
              <p className='text-red-500 hover:text-red-300'>
                {errors.validFrom}
              </p>
            )}
          </div>
        </div>

        <div className='form-group relative'>
          <label
            htmlFor='validTill'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Valid Till
          </label>
          <div className='relative'>
            <input
              type='datetime-local'
              id='validTill'
              name='validTill'
              value={formData.validTill}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
            />
            <CalendarIcon className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300' />
          </div>
          <div className='pt-2 font-tertiary'>
            {errors && (
              <p className='text-red-500 hover:text-red-300'>
                {errors.validTill}
              </p>
            )}
          </div>
        </div>

        <div className='form-group'>
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              name='status'
              checked={formData.status}
              onChange={handleChange}
              className='form-checkbox h-5 w-5 text-customP2Primary'
            />
            <span className='text-sm font-semibold text-gray-700 dark:text-slate-200'>
              Status: {formData.status ? 'Active' : 'Blocked'}
            </span>
          </label>
        </div>

        <div className='text-center'>
          <button
            type='submit'
            className=' bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500 text-white px-4 py-2 rounded-md  transition'
          >
            Add Coupon
          </button>
        </div>
      </form>
    </div>
  )
}
