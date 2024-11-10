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
      <div className='flex justify-between'>
        <h2 className='text-lg sm:text-2xl whitespace-nowrap  text-center font-bold'>
          Category Discount
        </h2>
        <motion.button
          onClick={() => {
            navigate('/dashboard/discounts/add', {
              state: { type: 'Category' }
            })
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className=' flex items-center text-sm sm:text-base px-2 sm:px-3 py-2 whitespace-nowrap  text-white rounded-md shadow  bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500'
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
