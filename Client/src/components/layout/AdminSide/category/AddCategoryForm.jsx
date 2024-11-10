import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addCategory } from '../../../../redux/slices/Admin/AdminCategory/adminCategorySlice'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'
import {
  fetchStyles,
  fetchTechniques,
  fetchThemes
} from '../../../../redux/slices/Admin/AdminCategory/categoriesFetchSlice'
function AddCategoryForm() {
  const location = useLocation()
  const { type } = location.state || { type: null }
  const [categoryName, setCategoryName] = useState('')
  const [categoryType, setCategoryType] = useState(type)
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const handleSubmit = async e => {
    e.preventDefault()

    if (!categoryName || !categoryType || !description) {
      setError('All fields are required')
      return
    }

    const newCategory = {
      name: categoryName,
      type: categoryType,
      description: description
    }
    try {
      await dispatch(addCategory(newCategory)).unwrap()

      toast.success('Category Created ', {
        className:
          'bg-white dark:bg-customP2ForegroundD_400 font-primary dark:text-white'
      })
      switch (categoryType) {
        case 'Theme':
          dispatch(fetchThemes())
          break
        case 'Style':
          dispatch(fetchStyles())
          break
        case 'Technique':
          dispatch(fetchTechniques())
          break
        default:
          break
      }
      setCategoryName('')
      setCategoryType('')
      setDescription('')
      setError('')
    } catch (err) {
      console.error('Failed to add category:', err)
      console.error('Failed to update category:', err)
      if (err && err.errors) {
        const errorMessages = err.errors.map(error => error.msg).join(', ')
        setError(errorMessages)
      } else if (err && err.message) {
        setError(err.message)
      } else {
        setError('An error occurred')
      }
    }
  }

  return (
    <div className='  p-8  rounded-lg  w-full lg:max-w-full font-primary mx-auto md:px-20 mt-10'>
      <h1 className='text-4xl  font-primary font-bold mb-6 text-start'>
        Add New Category
      </h1>

      {/* Display any error messages */}
      {error && (
        <div className='dark:bg-customP2BackgroundD border-customP2ForegroundD_600 border bg-customP2ForeGroundW_500 py-2 mb-4 rounded-lg'>
          <p className='text-red-900 dark:text-red-500 ms-4 text-start'>
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Category Name Input */}
        <div className='form-group '>
          <label
            htmlFor='categoryName'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Category Name
          </label>
          <input
            type='text'
            id='categoryName'
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
            placeholder='Enter category name'
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          />
        </div>

        {/* Category Type Input */}
        <div className='form-group '>
          <label
            htmlFor='categoryType'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Category Type:
          </label>
          <select
            id='categoryType'
            value={categoryType}
            onChange={e => setCategoryType(e.target.value)}
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          >
            <option value=''>Select type</option>
            <option value='Theme'>Theme</option>
            <option value='Style'>Style</option>
            <option value='Technique'>Technique</option>
          </select>
        </div>

        {/* Description Input */}
        <div className='form-group'>
          <label
            htmlFor='description'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Description:
          </label>
          <textarea
            id='description'
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder='Enter category description'
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          ></textarea>
        </div>

        {/* Add Category Button */}
        <div className=' text-center'>
          <button
            type='submit'
            className='   bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500 text-white px-4 py-2 rounded-md   transition'
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCategoryForm
