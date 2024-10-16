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
            navigate('/dashboard/discounts/add', { state: { type: 'Product' } })
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className='p-2 rounded-sm px-4 me-2 bg-customP2Primary text-white font-semibold  hover:bg-opacity-75  text-sm   transition-colors duration-300'
        >
          Add Product Discount
        </motion.button>
      </div>
      <div className='mt-6'>
        <DiscountTable type={'styles'} data={productDiscounts.data} />
      </div>
    </div>
  )
}

export default ProductDiscount
