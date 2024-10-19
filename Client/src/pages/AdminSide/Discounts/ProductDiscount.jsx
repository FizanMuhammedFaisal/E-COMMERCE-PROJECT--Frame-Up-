import React from 'react'
import { useSelector } from 'react-redux'

import { CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import DiscountTable from './DiscountTable'
function ProductDiscount() {
  const { productDiscounts } = useSelector(state => state.adminDiscount)
  const status = productDiscounts.status
  const error = productDiscounts.error
  const navigate = useNavigate()
  if (status === 'loading' || !productDiscounts?.data)
    return (
      <div className='text-center dark:bg-gray-800'>
        <CircularProgress color={'inherit'} size={25} />
      </div>
    )
  if (status === 'failed') return <p>Error: {error}</p>

  return (
    <div className=''>
      <h2 className='text-2xl text-center font-bold'>Product Discount</h2>
      <div className='flex justify-end'>
        <motion.button
          onClick={() => {
            navigate('/dashboard/discounts/add', { state: { type: 'product' } })
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className='flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700'
        >
          Add Product Discount
        </motion.button>
      </div>
      <div className='mt-6'>
        <DiscountTable type={'productDiscounts'} data={productDiscounts.data} />
      </div>
    </div>
  )
}

export default ProductDiscount
