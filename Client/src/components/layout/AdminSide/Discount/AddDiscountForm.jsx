import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addDiscount } from '../../../../redux/slices/Admin/AdminDiscount/adminDiscountSlice'
import {
  fetchStyles,
  fetchTechniques,
  fetchThemes
} from '../../../../redux/slices/Admin/AdminCategory/categoriesFetchSlice'
import ProductSelect from '../../../common/ProductSelect'

export default function AddDiscountForm() {
  const location = useLocation()
  const { type } = location.state || ''
  const [discountData, setDiscountData] = useState({
    name: '',
    discountTarget: type,
    discountType: '',
    discountValue: '',
    startDate: '',
    endDate: '',
    description: '',
    targetId: '',
    status: 'Active'
  })
  const [error, setError] = useState('')
  const dispatch = useDispatch()

  const { themes, styles, techniques } = useSelector(
    state => state.categoryFetch
  )
  const categories = [...themes.data, ...styles.data, ...techniques.data]

  useEffect(() => {
    dispatch(fetchThemes())
    dispatch(fetchStyles())
    dispatch(fetchTechniques())
  }, [dispatch])

  const handleChange = e => {
    const { name, value } = e.target
    setDiscountData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (
      !discountData.name ||
      !discountData.discountTarget ||
      !discountData.targetId ||
      !discountData.discountType ||
      !discountData.discountValue ||
      !discountData.startDate ||
      !discountData.endDate
    ) {
      setError('Please fill in all required fields')
      return
    }

    try {
      const result = await dispatch(addDiscount(discountData)).unwrap()
      toast.success('Discount Created', {
        className:
          'bg-white dark:bg-customP2ForegroundD_400 font-primary dark:text-white'
      })
      console.log('Discount added successfully:', result)
      setDiscountData({
        name: '',
        discountTarget: '',
        discountType: '',
        discountValue: '',
        startDate: '',
        endDate: '',

        targetId: '',
        status: 'active'
      })
      setError('')
    } catch (err) {
      console.error('Failed to add discount:', err)
      setError(err.message || 'An error occurred while adding the discount')
    }
  }

  const handleSelectedOption = option => {
    setDiscountData(prev => ({ ...prev, targetId: option.value }))
  }

  return (
    <div className='p-8 rounded-lg w-full lg:max-w-full font-primary mx-auto md:px-20 mt-10'>
      <h1 className='text-4xl font-primary font-bold mb-6 text-start'>
        Add New Discount
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
            htmlFor='name'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Discount Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={discountData.name}
            onChange={handleChange}
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
            placeholder='Enter discount name'
          />
        </div>

        <div className='form-group'>
          <label
            htmlFor='discountTarget'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Offer Type
          </label>
          <select
            id='discountTarget'
            name='discountTarget'
            value={discountData.discountTarget}
            onChange={handleChange}
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          >
            <option value=''>Select offer type</option>
            <option value='Category'>Category</option>
            <option value='Products'>Products</option>
          </select>
        </div>

        {discountData.discountTarget && (
          <div className='form-group'>
            <label
              htmlFor='targetId'
              className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
            >
              {discountData.discountTarget === 'Products'
                ? 'Product'
                : 'Category'}
            </label>
            {discountData.discountTarget === 'Products' ? (
              <ProductSelect onSelect={handleSelectedOption} />
            ) : (
              <select
                id='targetId'
                name='targetId'
                value={discountData.targetId}
                onChange={handleChange}
                className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
              >
                <option value=''>Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

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
            value={discountData.discountType}
            onChange={handleChange}
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          >
            <option value=''>Select type</option>
            <option value='percentage'>Percentage</option>
            <option value='fixed'>Fixed Amount</option>
          </select>
        </div>

        <div className='form-group'>
          <label
            htmlFor='discountValue'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Discount Value
          </label>
          <input
            type='number'
            id='discountValue'
            name='discountValue'
            value={discountData.discountValue}
            onChange={handleChange}
            min='0'
            placeholder={
              discountData.discountType === 'percentage'
                ? 'Enter percentage (0-100)'
                : 'Enter fixed amount'
            }
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          />
        </div>

        <div className='form-group'>
          <label
            htmlFor='startDate'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Start Date
          </label>
          <input
            type='datetime-local'
            id='startDate'
            name='startDate'
            value={discountData.startDate}
            onChange={handleChange}
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          />
        </div>

        <div className='form-group'>
          <label
            htmlFor='endDate'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            End Date
          </label>
          <input
            type='datetime-local'
            id='endDate'
            name='endDate'
            value={discountData.endDate}
            onChange={handleChange}
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          />
        </div>

        <div className='form-group'>
          <label
            htmlFor='status'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Status
          </label>
          <select
            id='status'
            name='status'
            value={discountData.status}
            onChange={handleChange}
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          >
            <option value='Active'>Active</option>
            <option value='Expired'>Expired</option>
            <option value='Disabled'>Disabled</option>
          </select>
        </div>

        <div className='text-center'>
          <button
            type='submit'
            className=' bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500 text-white px-4 py-2 rounded-md  transition'
          >
            Add Discount
          </button>
        </div>
      </form>
    </div>
  )
}
