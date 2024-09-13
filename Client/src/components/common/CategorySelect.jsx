import React, { useEffect } from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchStyles,
  fetchTechniques,
  fetchThemes
} from '../../redux/slices/AdminCategory/categoriesFetchSlice'

const CategorySelect = ({
  value = [],
  onChange,
  placeholder = 'Select categories...',
  type
}) => {
  const dispatch = useDispatch()

  // Get the state slices based on type
  const { themes, styles, techniques } = useSelector(
    state => state.categoryFetch
  )

  useEffect(() => {
    // Fetch data based on the type prop
    switch (type) {
      case 'theme':
        if (themes.status === 'idle') {
          dispatch(fetchThemes())
        }
        break
      case 'style':
        if (styles.status === 'idle') {
          dispatch(fetchStyles())
        }
        break
      case 'technique':
        if (techniques.status === 'idle') {
          dispatch(fetchTechniques())
        }
        break
      default:
        break
    }
  }, [dispatch, type, themes.status, styles.status, techniques.status])

  // Select the relevant data based on type
  const data = (() => {
    switch (type) {
      case 'theme':
        return themes.data || []
      case 'style':
        return styles.data || []
      case 'technique':
        return techniques.data || []
      default:
        return []
    }
  })()

  // Transform the data to the format react-select expects
  const formattedData = data.map(item => ({
    value: item._id,
    label: item.name
  }))

  return (
    <Select
      isMulti
      options={formattedData}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className='w-full' // Apply normal Tailwind classes
      classNamePrefix='react-select'
      classNames={{
        control: () =>
          'border-gray-600 bg-white dark:bg-gray-900 dark:border-gray-700',
        menu: () => 'bg-black dark:bg-gray-900',
        option: ({ isFocused, isSelected }) =>
          `cursor-pointer ${
            isFocused ? 'bg-customP2Primary dark:bg-customP2Primary' : ''
          } ${isSelected ? 'bg-white text-white' : ''}`,
        multiValue: () =>
          'bg-blue-500 dark:bg-customP2ForegroundD_500 text-blue-900 dark:text-gray-300',
        multiValueLabel: () => 'text-blue-900 dark:text-gray-300',
        multiValueRemove: () =>
          'text-blue-900 dark:text-gray-300 hover:bg-blue-500 dark:hover:bg-blue-900 hover:text-white'
      }}
    />
  )
}

CategorySelect.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(['theme', 'style', 'technique']).isRequired // Ensure type is required and one of the specified values
}

export default CategorySelect
