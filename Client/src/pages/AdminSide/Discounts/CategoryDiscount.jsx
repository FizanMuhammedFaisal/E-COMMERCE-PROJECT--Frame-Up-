import { useSelector } from 'react-redux'

import { CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import DiscountTable from './DiscountTable'
function CategoryDiscount() {
  const { categoryDiscounts } = useSelector(state => state.adminDiscount)
  const status = categoryDiscounts.status
  const error = categoryDiscounts.error
  const navigate = useNavigate()
  if (status === 'loading' || !categoryDiscounts?.data)
    return (
      <div className='text-center dark:bg-gray-800'>
        <CircularProgress color={'inherit'} size={25} />
      </div>
    )
  if (status === 'failed') return <p>Error: {error}</p>

  return (
    <div>
      <h2 className='text-2xl text-center font-bold'>Category Discount</h2>
      <div className='flex justify-end'>
        <motion.button
          onClick={() => {
            navigate('/dashboard/discounts/add', {
              state: { type: 'category' }
            })
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className='flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700'
        >
          Add Category Discount
        </motion.button>
      </div>
      <div className='mt-6'>
        <DiscountTable
          type={'categoryDiscounts'}
          data={categoryDiscounts?.data}
        />
      </div>
    </div>
  )
}

export default CategoryDiscount
