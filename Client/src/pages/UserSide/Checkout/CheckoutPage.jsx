import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  CheckIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/solid'
import {
  ExclamationCircleIcon,
  ShoppingCartIcon,
  TruckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import AddressModal from '../../../components/modals/AddressModal'
import apiClient from '../../../services/api/apiClient'
import { useQuery } from '@tanstack/react-query'
import { setCart } from '../../../redux/slices/Users/Cart/cartSlice'
import { Alert, Badge, Button, Snackbar } from '@mui/material'
import { useCart } from '../../../hooks/useCart'
import { setSelectedAddressRedux } from '../../../redux/slices/Users/Address/addressSlice'
import { validatePayment } from '../../../redux/slices/Users/Checkout/checkoutSlice'

function CheckoutPage() {
  const { items, subtotal, totalPrice, discount } = useSelector(
    state => state.cart
  )
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addressData, setAddressData] = useState(null)
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const dispatch = useDispatch()
  const { removeFromCart } = useCart()
  const MotionButton = motion.create(Button)

  const fetchData = async () => {
    const { data } = await apiClient.get('/api/users/get-address')
    return data
  }
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['address'],
    queryFn: fetchData
  })

  useEffect(() => {
    if (data?.address) {
      setAddresses(data.address)
      if (data.address.length > 0 && !selectedAddress) {
        const selected = data.address.filter(
          (curr, i) => curr.isDefault === true
        )
        handleAddressSelect(selected[0])
      }
    }
  }, [data, selectedAddress])

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [items, navigate])

  const handleContinue = async () => {
    const outOfStockItems = items.filter(item => item.quantity === 0)
    if (outOfStockItems.length > 0) {
      setSnackbarData({
        open: true,
        message: 'Please remove out of stock items before checkout',
        severity: 'error'
      })
    } else {
      try {
        const res = await apiClient.get('/api/cart')
        dispatch(setCart(res.data.cart))

        if (res.data.outofstock) {
          return
        }
        dispatch(validatePayment())
        navigate('/checkout/payment')
      } catch (error) {
        setSnackbarData({
          open: true,
          message: 'Failed to Operate',
          severity: 'error'
        })
      }
    }
    sessionStorage.setItem('address', selectedAddress._id)
  }

  const handleAddressSelect = address => {
    setSelectedAddress(address)
    dispatch(setSelectedAddressRedux(address))
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return
    setSnackbarData(prev => ({ ...prev, open: false }))
  }

  const handleAddNewAddress = newAddress => {
    console.log(newAddress)
    const newAddressWithId = { ...newAddress, _id: Date.now().toString() }
    setAddresses([...addresses, newAddressWithId])
    setSelectedAddress(newAddressWithId)
    refetch()
  }
  useEffect(() => {
    console.log(addresses)
  }, [addresses])

  const handleEditAddress = address => {
    setIsModalOpen(true)
    setAddressData(address)
  }

  const handleRemoveItem = id => {
    removeFromCart(id)
    setSnackbarData({
      open: true,
      message: 'Item removed from cart',
      severity: 'success'
    })
  }
  console.log(items)
  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-extrabold text-gray-900 mb-8'>Checkout</h1>
        <div className='lg:grid lg:grid-cols-3 lg:gap-8'>
          <div className='lg:col-span-2'>
            <div className='bg-white shadow-lg rounded-lg overflow-hidden mb-8'>
              <div className='px-4 py-5 sm:px-6 bg-gray-50'>
                <h2 className='text-xl leading-6 font-semibold text-gray-900 flex items-center'>
                  <ShoppingCartIcon className='h-6 w-6 mr-2 text-customColorTertiary' />
                  Order Summary
                </h2>
              </div>
              <div className='border-t border-gray-200'>
                <ul className='divide-y divide-gray-200'>
                  {items.map((item, index) => (
                    <li key={item.productId} className='px-4 py-4 sm:px-6'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                          <img
                            src={item.thumbnailImage}
                            alt={item.productName}
                            className='w-16 h-16 object-cover rounded-md mr-4'
                          />
                          <div>
                            <h3 className='text-sm font-medium text-gray-900'>
                              {item.productName}
                            </h3>
                            <p className='text-sm text-gray-500'>
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        {item.discountPrice ? (
                          <div>
                            {' '}
                            <p className='text-sm font-medium text-gray-900'>
                              ₹{(item.discountPrice * item.quantity).toFixed(2)}
                            </p>
                            {item?.discountPrice &&
                              item.discountPrice !== item.productPrice && (
                                <p className='text-sm font-medium line-through text-gray-900'>
                                  ₹
                                  {(item.productPrice * item.quantity).toFixed(
                                    2
                                  )}
                                </p>
                              )}
                          </div>
                        ) : (
                          <p className='text-sm font-medium text-gray-900'>
                            ₹{(item.productPrice * item.quantity).toFixed(2)}
                          </p>
                        )}
                        {item.quantity === 0 && (
                          <div>
                            <Badge
                              variant='destructive'
                              className='text-base px-3 bg-red-100 text-red-600 me-2 py-2 rounded-full'
                            >
                              <ExclamationCircleIcon className='w-5 h-5 mr-1' />
                              Out of Stock
                            </Badge>
                            <MotionButton
                              variant='ghost'
                              size='icon'
                              className='ml-4'
                              whileHover={{ scale: 1.1, color: '#EF4444' }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveItem(item.productId)}
                            >
                              <XMarkIcon className='h-6 w-6' />
                            </MotionButton>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='bg-gray-50 px-4 py-5 sm:px-6'>
                <div className='flex justify-between text-sm font-medium text-gray-900'>
                  <p>Subtotal</p>
                  <p>₹{subtotal.toFixed(2)}</p>
                </div>
                <div className='flex justify-between text-sm font-medium text-gray-900'>
                  <p>Total Discount</p>
                  <p>-₹{discount.toFixed(2)}</p>
                </div>

                <div className='mt-2 flex justify-between text-base font-semibold text-gray-900'>
                  <p>Total</p>
                  <p>₹{totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleContinue()}
              className='w-full bg-customColorTertiary text-white py-3 px-4 rounded-md font-medium hover:bg-customColorTertiaryLight transition duration-300 ease-in-out text-lg shadow-md'
            >
              Continue
            </button>
            <button
              onClick={() => navigate('/products')}
              className='w-full mt-4 bg-white text-customColorTertiary py-3 px-4 rounded-md font-medium border border-customColorTertiary hover:bg-indigo-50 transition duration-300 ease-in-out text-lg shadow-sm'
            >
              Continue Shopping
            </button>
          </div>
          <div className='mt-8 lg:mt-0'>
            <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
              <div className='px-4 py-5 sm:px-6 bg-gray-50'>
                <h2 className='text-xl leading-6 font-semibold text-gray-900 flex items-center'>
                  <TruckIcon className='h-6 w-6 mr-2 text-customColorTertiary' />
                  Shipping Address
                </h2>
              </div>
              <div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
                {isLoading ? (
                  <div className='text-center py-4'>Loading addresses...</div>
                ) : isError ? (
                  <div className='text-center py-4 text-red-600'>
                    Error: {error.message}
                  </div>
                ) : addresses?.length > 0 ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-4'>
                    {addresses.map(address => (
                      <div key={address._id} className='border rounded-lg p-4'>
                        <div className='flex justify-between items-start mb-2'>
                          <h3 className='text-lg font-medium text-gray-900'>
                            {address.addressName}
                          </h3>
                          <button
                            onClick={() => handleEditAddress(address)}
                            className='text-sm text-customColorTertiary  hover:text-customColorTertiaryLight'
                          >
                            Edit
                          </button>
                        </div>
                        <p className='text-sm text-gray-500 flex items-center mb-1'>
                          <MapPinIcon className='h-4 w-4 mr-1 text-gray-400' />
                          {address.address}, {address.city}, {address.state}{' '}
                          {address.postalCode}
                        </p>
                        <p className='text-sm text-gray-500 flex items-center mb-2'>
                          <PhoneIcon className='h-4 w-4 mr-1 text-gray-400' />
                          {address.phoneNumber}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddressSelect(address)}
                          className={`w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                            selectedAddress?._id === address._id
                              ? 'bg-customColorTertiary text-white'
                              : 'text-customColorTertiary bg-customColorTertiaryLight/15'
                          } hover:bg-customColorTertiaryLight hover:text-white focus:outline-none transition duration-150 ease-in-out`}
                        >
                          {selectedAddress?._id === address._id ? (
                            <>
                              <CheckIcon className='h-4 w-4 mr-1' />
                              Selected
                            </>
                          ) : (
                            'Select'
                          )}
                        </motion.button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-4'>
                    No addresses found. Add a new address below.
                  </div>
                )}
              </div>
              <div className='px-4 py-5 sm:px-6 bg-gray-50'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(true)}
                  className='w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-customColorTertiary hover:bg-customColorTertiaryLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out'
                >
                  <PlusIcon className='h-5 w-5 mr-2' />
                  Add New Address
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddressModal
        editData={addressData ? addressData : null}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false), setAddressData(null)
        }}
        onAddAddress={handleAddNewAddress}
      />
      <Snackbar
        open={snackbarData.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarData.severity}
          className='w-full'
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default CheckoutPage
