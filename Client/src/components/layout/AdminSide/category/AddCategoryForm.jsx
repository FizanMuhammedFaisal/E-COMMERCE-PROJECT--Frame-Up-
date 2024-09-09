import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCategory } from '../../../../redux/slices/AdminCategory/adminCategorySlice'
import { toast, ToastContainer } from 'react-toastify'
function AddCategoryForm() {
  // State for the form inputs
  const [categoryName, setCategoryName] = useState('')
  const [categoryType, setCategoryType] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  // Function to handle form submission
  const handleSubmit = async e => {
    e.preventDefault()

    // Validate the form
    if (!categoryName || !categoryType || !description) {
      setError('All fields are required')
      return
    }

    // Handle the category submission logic here
    const newCategory = {
      name: categoryName,
      type: categoryType,
      description: description
    }
    try {
      // Dispatch the action and unwrap the result
      const result = await dispatch(addCategory(newCategory)).unwrap()

      toast.success('Category Created ', {
        className:
          'bg-white dark:bg-customP2ForegroundD_400 font-primary dark:text-white'
      })

      console.log('Category added successfully:', result)
      // Optionally, you can show a success message or handle it however you like

      // Clear the form and error
      setCategoryName('')
      setCategoryType('')
      setDescription('')
      setError('')
    } catch (err) {
      console.error('Failed to add category:', err)
      // Set the error based on the rejected reason
      setError(err.message)
    }
  }

  return (
    <div className='  p-8  rounded-lg  w-full lg:max-w-full font-primary mx-auto md:px-20 mt-10'>
      <h1 className='text-4xl  font-primary font-bold mb-6 text-start'>
        Add New Category
      </h1>

      {/* Display any error messages */}
      {error && (
        <div className='dark:bg-customP2ForegroundD_400 border-customP2ForegroundD_600 border bg-customP2ForeGroundW_500 py-2 mb-4 rounded-lg'>
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
            className='mt-1 block w-full px-4 py-2 border dark:bg-customP2ForegroundD_100  dark:border-customP2ForegroundD_400 border-gray-300 rounded-md shadow-sm focus:ring-customP2Primary focus:border-customP2Primary ring-customP2Primary sm:text-sm'
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
            className='mt-1 block w-full px-4 py-2 border dark:bg-customP2ForegroundD_100  dark:border-customP2ForegroundD_400 border-gray-300 rounded-md shadow-sm focus:ring-customP2Primary focus:border-customP2Primary ring-customP2Primary sm:text-sm'
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
            className='mt-1 block w-full px-4 py-2 border dark:bg-customP2ForegroundD_100  dark:border-customP2ForegroundD_400 border-gray-300 rounded-md shadow-sm focus:ring-customP2Primary focus:border-customP2Primary ring-customP2Primary sm:text-sm'
          ></textarea>
        </div>

        {/* Add Category Button */}
        <div className=' text-center'>
          <button
            type='submit'
            className='  bg-customP2Primary text-white px-4 py-2 rounded-md  hover:bg-customP2ForegroundD_600 transition'
          >
            Add Category
          </button>
        </div>
      </form>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
      />
    </div>
  )
}

export default AddCategoryForm
