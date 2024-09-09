import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CategoriesTable from '../../../components/layout/AdminSide/category/CategoryTable'

function StyleCategory() {
  const { styles } = useSelector(state => state.categoryFetch)
  const status = styles.status
  const error = styles.error
  // if (status === 'loading') return <p>Loading...</p>
  // if (status === 'failed') return <p>Error: {error}</p>
  return (
    <div className=''>
      <h2 className='text-2xl text-center font-bold'>Styles</h2>
      <div className='mt-6'>
        <CategoriesTable data={styles.data.result} />
      </div>
    </div>
  )
}

export default StyleCategory
