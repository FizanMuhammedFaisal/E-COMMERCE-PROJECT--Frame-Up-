import React, { useState, useEffect, useRef } from 'react'
import AsyncSelect from 'react-select/async'

function TestSelect() {
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const selectRef = useRef(null)

  const generateOptions = (count, startIndex) => {
    return Array.from({ length: count }, (_, index) => ({
      label: `Option ${startIndex + index + 1}`,
      value: `value${startIndex + index + 1}`
    }))
  }

  const loadOptions = (inputValue, callback) => {
    setIsLoading(true)
    setTimeout(() => {
      const newOptions = generateOptions(20, (page - 1) * 20)
      setOptions(prevOptions => [...prevOptions, ...newOptions])
      callback(
        newOptions.filter(option =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      )
      setIsLoading(false)
    }, 1000)
  }

  const handleInputChange = newValue => {
    console.log('Input changed:', newValue)
  }

  const handleChange = selectedOption => {
    console.log('Option selected:', selectedOption)
  }

  const handleMenuOpen = () => {
    console.log('Menu opened')
  }

  const handleMenuClose = () => {
    console.log('Menu closed')
  }

  const handleMenuScrollToBottom = () => {
    console.log('Scrolled to bottom of menu')
    setPage(prevPage => prevPage + 1)
    loadOptions('', () => {})
  }

  const customStyles = {
    control: provided => ({
      ...provided,
      borderColor: 'gray-600',
      backgroundColor: 'white',
      '&:hover': {
        borderColor: 'customP2Primary'
      }
    }),
    menu: provided => ({
      ...provided,
      backgroundColor: 'white'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? 'customP2Primary' : 'white',
      color: state.isFocused ? 'white' : 'gray-900',
      cursor: 'pointer'
    }),
    multiValue: provided => ({
      ...provided,
      backgroundColor: 'blue-500'
    }),
    multiValueLabel: provided => ({
      ...provided,
      color: 'blue-900'
    }),
    multiValueRemove: provided => ({
      ...provided,
      color: 'blue-900',
      '&:hover': {
        backgroundColor: 'blue-500',
        color: 'white'
      }
    })
  }

  return (
    <div className='w-full max-w-md mx-auto mt-10'>
      <AsyncSelect
        ref={selectRef}
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        onMenuScrollToBottom={handleMenuScrollToBottom}
        placeholder='Select a Product...'
        className='w-full'
        classNamePrefix='react-select'
        styles={customStyles}
        isLoading={isLoading}
        loadingMessage={() => 'Loading more options...'}
        noOptionsMessage={() => 'No options available'}
      />
    </div>
  )
}

export default TestSelect
