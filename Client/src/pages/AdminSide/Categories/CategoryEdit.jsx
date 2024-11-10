import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../../services/api/apiClient'
import Spinner from '../../../components/common/Animations/Spinner'

export default function CategoryEdit() {
  const { categoryId } = useParams()
  const [category, setCategory] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const fetchCategory = async () => {
    const res = await apiClient.get(`/api/admin/category/${categoryId}`)
    console.log(res)
    return res.data.category
  }

  const { data, isLoading, isError } = useQuery({
    queryFn: fetchCategory,
    queryKey: ['category', categoryId]
  })

  useEffect(() => {
    if (data) {
      setCategory(data)
    }
  }, [data])

  const handleInputChange = e => {
    const { name, value } = e.target
    setCategory(prev => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (
      !category ||
      !category.name ||
      !category.type ||
      !category.description
    ) {
      setError('All fields are required')
      return
    }

    try {
      setError('')
      await apiClient.put(`/api/admin/category/update/${categoryId}`, category)

      toast.success('Category Updated')
      setCategory('')
      navigate('/dashboard/category')
    } catch (err) {
      console.error('Failed to update category:', err)
      if (err.response && err.response.data.errors) {
        const errorMessages = err.response.data.errors
          .map(error => error.msg)
          .join(', ')
        setError(errorMessages)
      } else if (err.response && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('An error occurred')
      }
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spinner center={true} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='text-red-500 text-center'>Failed to load category</div>
    )
  }

  return (
    <div className='p-8 rounded-lg w-full lg:max-w-full font-primary mx-auto md:px-20 mt-10'>
      <h1 className='text-4xl font-primary font-bold mb-6 text-start'>
        Edit Category
      </h1>

      {error && (
        <div className='dark:bg-customP2BackgroundD bg-red-100 dark:border-customP2ForegroundD_600 border bg-customP2ForeGroundW_500 py-2 mb-4 rounded-lg'>
          <p className='text-red-900 dark:text-red-500 ms-4 text-start'>
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='form-group'>
          <label
            htmlFor='categoryName'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Category Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={category?.name || ''}
            onChange={handleInputChange}
            placeholder='Enter category name'
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          />
        </div>

        <div className='form-group'>
          <label
            htmlFor='categoryType'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Category Type:
          </label>
          <select
            id='type'
            name='type'
            value={category?.type || ''}
            onChange={handleInputChange}
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          >
            <option value=''>Select type</option>
            <option value='Theme'>Theme</option>
            <option value='Style'>Style</option>
            <option value='Technique'>Technique</option>
          </select>
        </div>

        <div className='form-group'>
          <label
            htmlFor='description'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Description:
          </label>
          <textarea
            id='description'
            name='description'
            value={category?.description || ''}
            onChange={handleInputChange}
            placeholder='Enter category description'
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          ></textarea>
        </div>

        <div className='text-center'>
          <button
            type='submit'
            className='bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500 text-white px-4 py-2 rounded-md transition'
          >
            Update Category
          </button>
        </div>
      </form>
    </div>
  )
}
