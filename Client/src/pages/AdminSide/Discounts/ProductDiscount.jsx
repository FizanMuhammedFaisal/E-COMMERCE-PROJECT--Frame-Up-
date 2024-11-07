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
      <div className='flex justify-between'>
        <h2 className='text-lg sm:text-2xl whitespace-nowrap  text-center font-bold'>
          Product Discount
        </h2>
        <motion.button
          onClick={() => {
            navigate('/dashboard/discounts/add', { state: { type: 'product' } })
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className='flex items-center text-sm sm:text-base px-2 sm:px-3 py-2 whitespace-nowrap  text-white rounded-md shadow  bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500'
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
