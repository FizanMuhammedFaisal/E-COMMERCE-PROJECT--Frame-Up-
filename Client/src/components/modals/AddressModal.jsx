import React, { useState } from 'react'
import Modal from 'react-modal'
import { motion } from 'framer-motion'
import { XIcon } from 'lucide-react'
import { useEffect } from 'react'
import apiClient from '../../services/api/apiClient'
import { useMutation } from '@tanstack/react-query'
import { validateAddressForm } from '../../utils/validation/FormValidation'
import { CircularProgress } from '@mui/material'

Modal.setAppElement('#root')

function AddressModal({ isOpen, onClose, onAddAddress, editData }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [errorMessages, setErrorMessages] = useState('')
  const [mode, setMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newAddress, setNewAddress] = useState({
    addressName: '',
    name: '',
    phoneNumber: '',
    address: '',
    locality: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false
  })
  useEffect(() => {
    setError('')
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  useEffect(() => {
    if (editData) {
      setNewAddress(editData)
      setMode(true)
    } else {
      setMode(false)
      setNewAddress({
        addressName: '',
        name: '',
        phoneNumber: '',
        address: '',
        locality: '',
        city: '',
        state: '',
        postalCode: '',
        isDefault: false
      })
    }
  }, [editData])

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target

    setNewAddress(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const createAddress = async newAddress => {
    const response = await apiClient.post('/api/users/add-address', newAddress)
    console.log(response)
    return response.data
  }
  const editAddress = async newAddress => {
    console.log('asd')
    const response = await apiClient.post(
      '/api/users/update-address',
      newAddress
    )
    console.log(response)
    return response.data
  }
  const functionToCall = editData ? editAddress : createAddress
  const { mutate } = useMutation({
    mutationFn: functionToCall,
    onSuccess: data => {
      setMessage(data.message)
      onAddAddress(newAddress)
      setNewAddress({
        addressName: '',
        name: '',
        phoneNumber: '',
        address: '',
        locality: '',
        city: '',
        state: '',
        postalCode: '',
        isDefault: false
      })
      setLoading(false)
      onClose()
    },
    onError: error => {
      console.error('Error creating address:', error)

      setError(error.response?.data?.message || 'An error occurred.')
      setLoading(false)
    }
  })

  const handleSubmit = e => {
    e.preventDefault()

    const validationErrors = validateAddressForm(newAddress)

    if (Object.keys(validationErrors).length > 0) {
      setErrorMessages(validationErrors)
      return
    } else {
      setErrorMessages('')
    }
    setLoading(true)

    mutate(newAddress)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className=' modal-content fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50'
      overlayClassName=' modal-overlay fixed z-50 inset-0'
    >
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-auto'>
        <div className='flex justify-between items-center p-6 border-b'>
          <h2 className='text-2xl font-semibold text-gray-900'>
            {mode ? ' Edit Address' : ' Add New Address'}
          </h2>
          <button
            disabled={loading}
            onClick={onClose}
            className='text-gray-400 hover:text-gray-500'
          >
            <XIcon className='h-6 w-6' />
          </button>
        </div>
        <div
          className={`text-center font-primary font-semibold  ${
            error
              ? 'p-1 bg-red-100 border-red-300 border'
              : 'p-1 bg-transparent'
          }`}
        >
          <p className='text-red-500 hover:text-red-700'>
            {error ? error : ''}
          </p>
        </div>
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          <div>
            <label
              htmlFor='addressName'
              className='block text-sm font-medium text-gray-700'
            >
              Address Name
            </label>
            <input
              type='text'
              id='addressName'
              name='addressName'
              value={newAddress.addressName}
              onChange={handleInputChange}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='e.g., Home, Work'
            />
            {errorMessages && (
              <p className='text-red-500 hover:text-red-300'>
                {errorMessages.addressName}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={newAddress.name}
              onChange={handleInputChange}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='Name'
            />
            {errorMessages && (
              <p className='text-red-500 hover:text-red-300'>
                {errorMessages.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor='phoneNumber'
              className='block text-sm font-medium text-gray-700'
            >
              PhoneNumber
            </label>
            <input
              type='number'
              id='phoneNumber'
              name='phoneNumber'
              value={newAddress.phoneNumber}
              onChange={handleInputChange}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='phoneNumber'
            />
            {errorMessages && (
              <p className='text-red-500 hover:text-red-300'>
                {errorMessages.phoneNumber}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor='address'
              className='block text-sm font-medium text-gray-700'
            >
              Address (House No, Building, street, Area)
            </label>
            <input
              type='text'
              id='address'
              name='address'
              value={newAddress.address}
              onChange={handleInputChange}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            />
            {errorMessages && (
              <p className='text-red-500 hover:text-red-300'>
                {errorMessages.address}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor='locality'
              className='block text-sm font-medium text-gray-700'
            >
              Locality
            </label>
            <input
              type='text'
              id='locality'
              name='locality'
              value={newAddress.locality}
              onChange={handleInputChange}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            />
            {errorMessages && (
              <p className='text-red-500 hover:text-red-300'>
                {errorMessages.locality}
              </p>
            )}
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='city'
                className='block text-sm font-medium text-gray-700'
              >
                City
              </label>
              <input
                type='text'
                id='city'
                name='city'
                value={newAddress.city}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              />
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.city}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor='state'
                className='block text-sm font-medium text-gray-700'
              >
                State
              </label>
              <input
                type='text'
                id='state'
                name='state'
                value={newAddress.state}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              />
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.state}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor='postalCode'
              className='block text-sm font-medium text-gray-700'
            >
              Postal Code
            </label>
            <input
              type='number'
              id='postalCode'
              name='postalCode'
              value={newAddress.postalCode}
              onChange={handleInputChange}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            />
            {errorMessages && (
              <p className='text-red-500 hover:text-red-300'>
                {errorMessages.postalCode}
              </p>
            )}
          </div>
          <div className='flex items-center'>
            <input
              type='checkbox'
              id='isDefault'
              name='isDefault'
              checked={newAddress.isDefault}
              onChange={handleInputChange}
              className='mr-2'
            />
            <label
              htmlFor='isDefault'
              className='block text-sm font-medium text-gray-700'
            >
              Set as Default
            </label>
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full flex justify-center duration-300 min-w-8 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-customColorTertiary hover:bg-customColorTertiaryLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            {loading ? (
              <CircularProgress color='inherit' size={25} />
            ) : mode ? (
              'Edit Address'
            ) : (
              'Add Address'
            )}
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default AddressModal
