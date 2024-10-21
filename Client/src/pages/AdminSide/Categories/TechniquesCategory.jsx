import { useSelector } from 'react-redux'
import CategoriesTable from '../../../components/layout/AdminSide/category/CategoryTable'
import { CircularProgress } from '@mui/material'
function TechniquesCategory({ AddButton }) {
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
      <div className='flex justify-between'>
        <h2 className='text-2xl ml-4 font-bold'>Techniques</h2>
        <AddButton />
      </div>
      <div className='mt-6'>
        <CategoriesTable type={'techniques'} data={techniques.data} />
      </div>
    </div>
  )
}

export default TechniquesCategory
