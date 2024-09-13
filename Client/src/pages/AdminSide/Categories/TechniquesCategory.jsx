import { useSelector } from 'react-redux'
import CategoriesTable from '../../../components/layout/AdminSide/category/CategoryTable'
import { CircularProgress } from '@mui/material'
function TechniquesCategory() {
  const { techniques } = useSelector(state => state.categoryFetch)
  const status = techniques.status
  const error = techniques.error

  if (status === 'loading' || !techniques.data)
    return (
      <div className='text-center dark:bg-gray-800'>
        <CircularProgress color={'inherit'} size={25} />
      </div>
    )
  if (status === 'failed') return <p>Error: {error}</p>

  return (
    <div>
      <h2 className='text-2xl text-center font-bold'>Techniques</h2>
      <div className='mt-6'>
        <CategoriesTable data={techniques.data} />
      </div>
    </div>
  )
}

export default TechniquesCategory
