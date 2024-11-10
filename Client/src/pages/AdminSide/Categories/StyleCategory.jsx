import React from 'react'
import { useSelector } from 'react-redux'
import CategoriesTable from '../../../components/layout/AdminSide/category/CategoryTable'
import { CircularProgress } from '@mui/material'
function StyleCategory({ AddButton }) {
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
      <div className='flex justify-between'>
        <h2 className='text-2xl ml-4 font-bold'>Styles</h2>
        {AddButton}
      </div>
      <div className='mt-6'>
        <CategoriesTable type={'styles'} data={styles.data} />
      </div>
    </div>
  )
}

export default StyleCategory
