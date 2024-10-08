import { useSelector } from 'react-redux'
import CategoriesTable from '../../../components/layout/AdminSide/category/CategoryTable'
import { CircularProgress } from '@mui/material'

function CategoryDiscound() {
  const { themes } = useSelector(state => state.categoryFetch)
  const status = themes.status
  const error = themes.error

  if (status === 'loading' || !themes.data)
    return (
      <div className='text-center dark:bg-gray-800'>
        <CircularProgress color={'inherit'} size={25} />
      </div>
    )
  if (status === 'failed') return <p>Error: {error}</p>

  return (
    <div>
      <h2 className='text-2xl text-center font-bold'>Category Discound</h2>

      <div className='mt-6'>
        <CategoriesTable type={'themes'} data={themes.data} />
      </div>
    </div>
  )
}

export default CategoryDiscound