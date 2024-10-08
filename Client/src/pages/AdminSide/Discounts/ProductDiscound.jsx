import React from 'react'
import { useSelector } from 'react-redux'
import CategoriesTable from '../../../components/layout/AdminSide/category/CategoryTable'
import { CircularProgress } from '@mui/material'
function ProductDiscound() {
  const { styles } = useSelector(state => state.categoryFetch)
  const status = styles.status
  const error = styles.error
  if (status === 'loading' || !styles.data)
    return (
      <div className='text-center dark:bg-gray-800'>
        <CircularProgress color={'inherit'} size={25} />
      </div>
    )
  if (status === 'failed') return <p>Error: {error}</p>

  return (
    <div className=''>
      <h2 className='text-2xl text-center font-bold'>Product Discound</h2>
      <div className='mt-6'>
        <CategoriesTable type={'styles'} data={styles.data} />
      </div>
    </div>
  )
}

export default ProductDiscound
