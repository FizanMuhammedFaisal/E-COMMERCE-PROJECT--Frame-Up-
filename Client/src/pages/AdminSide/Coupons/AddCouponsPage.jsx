import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { CalendarIcon } from 'lucide-react'

// Assuming you have an addCoupon action in your Redux slice
// import { addCoupon } from '../path/to/your/couponSlice'

export default function AddCouponForm() {
  const [formData, setFormData] = useState({
    code: '',
    discountType: '',
    discountAmount: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    validFrom: '',
    validTill: '',
    isActive: true
  })
  const [error, setError] = useState('')

  const dispatch = useDispatch()

  const handleChange = e => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (
      !formData.code ||
      !formData.discountType ||
      !formData.discountAmount ||
      !formData.validFrom ||
      !formData.validTill
    ) {
      setError('All required fields must be filled')
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
      // Assuming you have an addCoupon action
      // const result = await dispatch(addCoupon(newCoupon)).unwrap()

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
        isActive: true
      })
      setError('')
    } catch (err) {
      console.error('Failed to add coupon:', err)
      setError('Failed to add coupon. Please try again.')
    }
  }

  return (
    <div className='p-8 rounded-lg w-full lg:max-w-full font-primary mx-auto md:px-20 mt-10'>
      <h1 className='text-4xl font-primary font-bold mb-6 text-start'>
        Add New Coupon
      </h1>

      {error && (
        <div className='dark:bg-customP2ForegroundD_400 border-customP2ForegroundD_600 border bg-customP2ForeGroundW_500 py-2 mb-4 rounded-lg'>
          <p className='text-red-900 dark:text-red-500 ms-4 text-start'>
            {error}
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
            className='p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50'
          />
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
            className='p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50'
          >
            <option value=''>Select discount type</option>
            <option value='percentage'>Percentage</option>
            <option value='fixed'>Fixed</option>
          </select>
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
            className='p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50'
          />
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
            className='p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50'
          />
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
            className='p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50'
          />
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
              className='p-2 pr-10 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50 [color-scheme:light]'
            />
            <CalendarIcon className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300' />
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
              className='p-2 pr-10 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2ForegroundD_100 sm:text-sm dark:text-slate-50 [color-scheme:light]'
            />
            <CalendarIcon className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300' />
          </div>
        </div>

        <div className='form-group'>
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              name='isActive'
              checked={formData.isActive}
              onChange={handleChange}
              className='form-checkbox h-5 w-5 text-customP2Primary'
            />
            <span className='text-sm font-semibold text-gray-700 dark:text-slate-200'>
              Is Active
            </span>
          </label>
        </div>

        <div className='text-center'>
          <button
            type='submit'
            className='bg-customP2Primary text-white px-4 py-2 rounded-md hover:bg-customP2ForegroundD_600 transition'
          >
            Add Coupon
          </button>
        </div>
      </form>
    </div>
  )
}
