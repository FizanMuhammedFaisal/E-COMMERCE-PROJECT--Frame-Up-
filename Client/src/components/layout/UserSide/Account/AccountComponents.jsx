import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import apiClient from '../../../../services/api/apiClient'
import { useEffect } from 'react'
import { CircularProgress } from '@mui/material'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CreditCardIcon,
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon
} from 'lucide-react'
import AlertDialog from '../../../common/AlertDialog'

import AddressModal from '../../../modals/AddressModal'
import { IoCash } from 'react-icons/io5'
const EditProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({})
  const [editedUser, setEditedUser] = useState()
  const [errorMessages, seterrorMessages] = useState({})
  const [error, seterror] = useState('')
  const [loading, setloading] = useState(false)
  const handleInputChange = e => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value })
  }

  const validateFields = () => {
    let tempErrors = {}
    if (!editedUser.name) {
      tempErrors.name = 'Name is required'
    }
    if (!editedUser.email) {
      tempErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(editedUser.email)) {
      tempErrors.email = 'Email is not valid'
    }
    return tempErrors
  }

  const handleSaveProfile = async () => {
    seterror('')
    const errors = validateFields(editedUser)
    if (Object.keys(errors).length > 0) {
      return seterrorMessages(errors)
    }
    seterrorMessages({})
    const updatedUser = { ...editedUser }
    try {
      setloading(true)
      const res = await apiClient.post('/api/users/update-profile', {
        updatedUser
      })
      if (res.status === 200) {
        setUserData(updatedUser)
      }
    } catch (error) {
      console.log(error)

      if (error?.response?.data?.message) {
        seterror(error?.response?.data?.message)
      } else {
        seterror("Couldn't update user. Please try again.")
      }
    }
    setloading(false)
    setIsEditing(false)
  }
  const fetchUser = async () => {
    const res = await apiClient.get('/api/users/get-user')

    return res.data
  }
  const { data, isLoading } = useQuery({
    queryFn: () => fetchUser(),
    queryKey: ['user'],
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 10
  })
  useEffect(() => {
    if (data?.userData) {
      setUserData(data.userData)
      setEditedUser(data.userData)
    }
  }, [data])
  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-gray-900'>Edit Profile</h2>
      <div>
        {error && <p className='text-red-500 hover:text-red-300'>{error}</p>}
      </div>
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSaveProfile()
          }}
        >
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Name
              </label>
              <input
                type='text'
                name='name'
                id='name'
                value={editedUser?.name || ''}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-customColorTertiarypop focus:border-customColorTertiarypop sm:text-sm'
              />
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <input
                type='text'
                name='email'
                id='email'
                value={editedUser?.email || ''}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-customColorTertiarypop focus:border-customColorTertiarypop sm:text-sm'
              />
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor='phone'
                className='block text-sm font-medium text-gray-700'
              >
                Phone
              </label>
              <input
                type='tel'
                name='phone'
                id='phone'
                value={editedUser?.phone || ''}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-customColorTertiarypop focus:border-customColorTertiarypop sm:text-sm'
              />
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.phone}
                </p>
              )}
            </div>
          </div>
          <div className='mt-6 flex justify-end space-x-3'>
            <button
              type='button'
              onClick={() => {
                setIsEditing(false)
                setEditedUser(userData)
              }}
              className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customColorTertiarypop'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-customtext-customColorTertiary border min-w-20 border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-customColorTertiaryLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customColorTertiarypop'
            >
              {loading ? (
                <CircularProgress color='inherit' size={20} />
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
          <div className='px-4 py-5 sm:px-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              User Information
            </h3>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>
              Personal details and application.
            </p>
          </div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
              <dl className='sm:divide-y sm:divide-gray-200'>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Full name
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                    {userData.name}
                  </dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Email address
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                    {userData.email}
                  </dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Phone number
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                    {userData.phone}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      )}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className='mt-4 bg-customColorTertiary border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white duration-300 hover:bg-customColorTertiaryLight/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customColorTertiarypop'
        >
          Edit Profile
        </button>
      )}
    </div>
  )
}

//

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = () => {
    const validationErrors = {}

    if (!formData.currentPassword) {
      validationErrors.currentPassword = 'Current password is required'
    }

    if (!formData.newPassword) {
      validationErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      validationErrors.newPassword = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = 'Please confirm your new password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match'
    }

    return validationErrors
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const validationErrors = validateForm()
    setErrors({})
    setSuccessMessage('')

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      const res = await apiClient.post('/api/users/update-password', formData)
      if (res.status === 200) {
        setSuccessMessage('Password updated successfully')
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      console.error(error)
      setErrors({
        form:
          error?.response?.data?.message ||
          'Error updating password. Please try again.'
      })
    }
  }

  const togglePasswordVisibility = field => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-6 bg-white p-6 rounded-xl shadow-sm'
    >
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-900'>
          Change Password
        </h2>
        <Link
          to='/login/forgot-password'
          className='text-sm font-medium text-customColorTertiarypop hover:text-customColorTertiary transition-colors duration-150 ease-in-out'
        >
          Forgot password?
        </Link>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {['currentPassword', 'newPassword', 'confirmPassword'].map(field => (
          <div key={field}>
            <label
              htmlFor={field}
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              {field === 'currentPassword'
                ? 'Current Password'
                : field === 'newPassword'
                  ? 'New Password'
                  : 'Confirm New Password'}
            </label>
            <div className='relative'>
              <input
                type={showPasswords[field] ? 'text' : 'password'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border ${
                  errors[field] ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-customColorTertiarypop focus:border-customColorTertiarypop sm:text-sm`}
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility(field)}
                className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500'
              >
                {showPasswords[field] ? (
                  <EyeOffIcon className='h-5 w-5' />
                ) : (
                  <EyeIcon className='h-5 w-5' />
                )}
              </button>
            </div>
            {errors[field] && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='mt-2 text-sm text-red-600'
              >
                {errors[field]}
              </motion.p>
            )}
          </div>
        ))}

        {errors.form && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='rounded-md bg-red-50 p-4'
          >
            <div className='flex'>
              <XCircleIcon
                className='h-5 w-5 text-red-400'
                aria-hidden='true'
              />
              <p className='ml-3 text-sm text-red-700'>{errors.form}</p>
            </div>
          </motion.div>
        )}

        <motion.button
          type='submit'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-customtext-customColorTertiary hover:bg-customColorTertiaryLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customColorTertiarypop transition-colors duration-150 ease-in-out'
        >
          Update Password
        </motion.button>
      </form>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='rounded-md bg-green-50 p-4'
        >
          <div className='flex'>
            <CheckCircleIcon
              className='h-5 w-5 text-green-400'
              aria-hidden='true'
            />
            <p className='ml-3 text-sm font-medium text-green-800'>
              {successMessage}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ChangePassword
//
//
///

const AddressCard = ({ address, onEdit, onDelete }) => (
  <div className='bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden'>
    {address.isDefault && (
      <div className='absolute top-0 right-0 '>
        <span className='bg-green-500 text-white text-xs  font-bold px-3 py-1 rounded-bl-lg'>
          Default
        </span>
      </div>
    )}
    <div className='flex flex-col space-y-2 mt-1'>
      <div className='flex justify-between items-start'>
        <h3 className='text-xl font-semibold text-gray-800'>{address.name}</h3>
        <span className='text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded'>
          {address.addressName}
        </span>
      </div>
      <p className='text-gray-600'>{address.address}</p>
      <p className='text-gray-600'>{`${address.city}, ${address.state} ${address.postalCode}`}</p>
      <p className='text-gray-600'>{address.phoneNumber}</p>
    </div>
    <div className='mt-4 flex justify-end space-x-2'>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onEdit(address)}
        className='flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-150'
      >
        <PencilIcon className='h-4 w-4 mr-1' />
        Edit
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onDelete(address._id)}
        className='flex items-center px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors duration-150'
      >
        <TrashIcon className='h-4 w-4 mr-1' />
        Delete
      </motion.button>
    </div>
  </div>
)

function ManageAddress() {
  const queryClient = useQueryClient()
  const [alertModal, setAlertModal] = useState(false)
  const [addressId, setAddressId] = useState('')
  const [address, setAddress] = useState({})
  const [addressModal, setAddressModal] = useState(false)
  const [mode, setMode] = useState(false) // false mode is normal true is edit mode
  //
  const {
    data: addresses,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await apiClient.get('/api/users/get-address')
      return response.data.address
    },
    staleTime: Infinity
  })

  const deleteAddressMutation = useMutation({
    mutationFn: addressId =>
      apiClient.delete(`/api/users/delete-address/${addressId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    }
  })

  const handleDeleteAddress = () => {
    deleteAddressMutation.mutate(addressId)
    setAlertModal(false)
  }
  const handleTriggerDelete = addressId => {
    setAlertModal(true)
    setAddressId(addressId)
  }

  const handleAddAddress = () => {
    setAddressModal(true)
    console.log('Add address triggered')
  }
  const handleClose = () => {
    setAddressModal(false)
    setMode(false)
    queryClient.invalidateQueries('addresses')
  }
  const handleEditAddress = address => {
    setMode(true)
    setAddress(address)
    setAddressModal(true)

    // Trigger your existing address editing model/modal here
    console.log('Edit address triggered', address)
  }

  if (isLoading) {
    return <div className='text-center'>Loading addresses...</div>
  }

  if (isError) {
    return (
      <div className='text-center text-red-600'>
        Error loading addresses. Please try again.
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-900'>
          Manage Addresses
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddAddress}
          className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-customtext-customColorTertiary hover:bg-customColorTertiaryLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customColorTertiarypop'
        >
          <PlusIcon className='h-5 w-5 mr-2' />
          Add New Address
        </motion.button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <AnimatePresence>
          {addresses.map(address => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={() => handleEditAddress(address)}
              onDelete={() => handleTriggerDelete(address._id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {addresses.length === 0 && (
        <div className='text-center text-gray-500 mt-8'>
          You haven't added any addresses yet. Click the "Add New Address"
          button to Add.
        </div>
      )}
      <AlertDialog
        onCancel={() => {
          setAlertModal(false)
        }}
        onConfirm={handleDeleteAddress}
        isOpen={alertModal}
      />
      <AddressModal
        editData={mode ? address : null}
        isOpen={addressModal}
        onClose={handleClose}
        onAddAddress={handleEditAddress}
      />
    </div>
  )
}
//

const OrderCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden'
    >
      <div
        className='p-4 cursor-pointer bg-gradient-to-r from-gray-50 to-white'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Order #{order._id.slice(-6).toUpperCase()}
          </h3>
          <div className='flex items-center space-x-2'>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                order.paymentStatus
              )}`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>
        <div className='mt-2 flex justify-between items-center text-sm text-gray-600'>
          <p>Placed on: {formatDate(order.createdAt)}</p>
          <p className='font-medium text-gray-900'>
            Total: ${order.totalAmount.toFixed(2)}
          </p>
        </div>
        <div className='mt-2 flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            {order.paymentMethod === 'Cash on Delivery' ? (
              <IoCash className='h-5 w-5 text-gray-400' />
            ) : (
              <CreditCardIcon className='h-5 w-5 text-gray-400' />
            )}
            <p className='text-sm text-gray-600'>{order.paymentMethod}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='text-customColorTertiary hover:text-customColorTertiaryLight flex items-center'
          >
            {isExpanded ? (
              <>
                <span className='mr-1'>Hide Details</span>
                <ChevronUpIcon className='h-4 w-4' />
              </>
            ) : (
              <>
                <span className='mr-1'>View Details</span>
                <ChevronDownIcon className='h-4 w-4' />
              </>
            )}
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='px-4 pb-4 border-t'
          >
            <div className='mt-4 space-y-4'>
              <div>
                <h4 className='font-medium text-gray-900'>Items</h4>
                <ul className='mt-2 space-y-2'>
                  {order.items.map((item, index) => (
                    <li
                      key={index}
                      className='flex justify-between items-center text-sm'
                    >
                      <div className='flex items-center space-x-2'>
                        {item.thumbnailImage &&
                          item.thumbnailImage.length > 0 && (
                            <img
                              src={item.thumbnailImage[0]}
                              alt={item.productName}
                              className='w-10 h-10 object-cover rounded'
                            />
                          )}
                        <span>
                          {item.productName} x{item.quantity}
                        </span>
                      </div>
                      <span>${item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>
                  Order Summary
                </h4>
                <div className='space-y-1 text-sm'>
                  <div className='flex justify-between'>
                    <span>Subtotal:</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Shipping:</span>
                    <span>${order.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Tax:</span>
                    <span>${order.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Discount:</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between font-medium text-gray-900 pt-2 border-t border-gray-200 mt-2'>
                    <span>Total:</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className='font-medium text-gray-900 mb-2'>
                  Shipping Address
                </h4>
                <address className='text-sm not-italic bg-gray-50 p-3 rounded-lg'>
                  <strong>{order.shippingAddress.name}</strong>
                  <br />
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                  <br />
                  <span className='text-gray-600'>Phone:</span>{' '}
                  {order.shippingAddress.phoneNumber}
                </address>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const OrderHistory = () => {
  const {
    data: orders,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await apiClient.get('/api/order/')
      console.log(response)
      return response.data.orders
    }
  })

  if (isLoading) {
    return <div className='text-center py-8'>Loading your order history...</div>
  }

  if (isError) {
    return (
      <div className='text-center py-8 text-red-600'>
        Error loading orders. Please try again later.
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-gray-900'>Order History</h2>
      {orders && orders.length > 0 ? (
        <div className='space-y-4'>
          {orders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <div className='text-center py-8 text-gray-500'>
          You haven't placed any orders yet.
        </div>
      )}
    </div>
  )
}

//
const AccountSettings = () => {
  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-gray-900'>Account Settings</h2>
      <div className='space-y-4'>
        {/* <div>
          <h3 className='text-lg font-medium text-gray-900'>Notifications</h3>
          <div className='mt-2 space-y-2'>
            <label className='inline-flex items-center'>
              <input
                type='checkbox'
                className='rounded border-gray-300 text-customColorTertiary shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
              <span className='ml-2'>Email notifications</span>
            </label>
            <label className='inline-flex items-center'>
              <input
                type='checkbox'
                className='rounded border-gray-300 text-customColorTertiary shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
              <span className='ml-2'>SMS notifications</span>
            </label>
          </div>
        </div> */}
        {/* <div>
          <h3 className='text-lg font-medium text-gray-900'>Language</h3>
          <select className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-customColorTertiarypop focus:border-customColorTertiarypop sm:text-sm rounded-md'>
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
        </select>
        </div> */}
        <div>
          <h3 className='text-lg font-medium text-gray-900'>Delete Account</h3>
          <p className='mt-1 text-sm text-gray-500'>
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button className='mt-2 bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
export {
  EditProfile,
  ChangePassword,
  ManageAddress,
  OrderHistory,
  AccountSettings
}
