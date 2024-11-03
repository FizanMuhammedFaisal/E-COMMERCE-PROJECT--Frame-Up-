'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet as WalletIcon,
  Filter,
  ChevronDown,
  Plus,
  AlertCircle,
  X
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import apiClient from '../../../../services/api/apiClient'
import { handleRazorPaySuccess } from '../../../../services/RazorPay/razorPay'

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState('all')
  const [errorMessage, setErrorMessage] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false)
  const [amountToAdd, setAmountToAdd] = useState('')

  const { mutate: addMoney } = useMutation({
    mutationFn: async amount => {
      console.log('adding monehy' + amount)
      const res = await apiClient.post('/api/wallet/add-money', { amount })
      console.log(res.data)
      if (!res || res.status !== 200) {
        throw new Error('Adding Money Failed')
      }
      return res.data.data
    },
    onSuccess: async data => {
      try {
        const result = await handleRazorPaySuccess(data, 'addMoney')
        console.log(result)
        if (result.success) {
          console.log(result)

          handleSuccess(result.amount)
        }
      } catch (error) {
        console.error('Error during payment:', error.message)

        setErrorMessage(
          error.message.includes('interrupted')
            ? 'Payment was interrupted. Please try again.'
            : 'Payment failed. Please retry.'
        )
      }
    },
    onError: async () => {
      setErrorMessage('Payment failed. Please try again.')
    }
  })

  const fetchWallet = async () => {
    const res = await apiClient.get('api/wallet/')
    return res.data.wallet
  }

  const handleAddMoney = () => {
    setIsAddMoneyModalOpen(true)
  }

  const handleAddMoneySubmit = () => {
    const amount = parseFloat(amountToAdd)
    if (amount > 0) {
      addMoney(amount)
      setIsAddMoneyModalOpen(false)
      setAmountToAdd('')
    }
  }

  const handleSuccess = amount => {
    setBalance(prev => prev + amount)
    refetch()
  }

  const { data, isLoading, refetch } = useQuery({
    queryFn: fetchWallet,
    queryKey: ['wallet']
  })
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])
  useEffect(() => {
    if (data) {
      setBalance(data.balance)
      setTransactions(data.transactions)
    }
  }, [data])

  const getTransactionIcon = type => {
    switch (type) {
      case 'refund':
        return <ArrowDownLeft className='w-6 h-6 text-green-500' />
      case 'debit':
        return <ArrowUpRight className='w-6 h-6 text-red-500' />
      default:
        return <WalletIcon className='w-6 h-6 text-blue-500' />
    }
  }

  const getTransactionColor = type => {
    switch (type) {
      case 'refund':
        return 'text-green-600'
      case 'debit':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    return transaction.type === filter
  })

  const recentActivity = [...transactions].reverse().slice(0, 3)

  return (
    <div className=' min-h-screen p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto'>
        <div className='bg-white border rounded-xl min-h-screen overflow-hidden'>
          <div className='p-6 sm:p-8 flex justify-between bg-gradient-to-b from-customColorTertiary to bg-customColorTertiarypop'>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>
                My Wallet
              </h1>
              <div className='flex items-baseline'>
                <span className='text-4xl sm:text-5xl font-bold text-white'>
                  ₹{balance.toLocaleString()}
                </span>
                <span className='ml-2 text-blue-100'>Available Balance</span>
              </div>
            </div>
            <motion.button
              onClick={handleAddMoney}
              className='bg-customColorTertiarypop max-h-10 px-4 py-2 font-semibold text-white rounded-lg flex items-center space-x-2'
              whileHover={{
                scale: 1.05,
                backgroundColor: '#ffffff',
                color: '#000000'
              }}
              transition={{ duration: 0.2 }}
            >
              <Plus className='w-5 h-5' />
              <span className='whitespace-nowrap'>Add Money</span>
            </motion.button>
          </div>

          <div className='p-6 sm:p-8'>
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded'
                  role='alert'
                >
                  <div className='flex items-center'>
                    <AlertCircle className='w-5 h-5 mr-2' />
                    <p className='font-bold'>Error</p>
                  </div>
                  <p className='mt-2'>{errorMessage}</p>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className='absolute top-2 right-2 text-red-700 hover:text-red-900'
                  >
                    <X className='w-5 h-5' />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className='mb-6'>
              <h2 className='text-xl font-semibold mb-4'>Recent Activity</h2>
              <div className='grid gap-4 sm:grid-cols-3'>
                {recentActivity.map((transaction, index) => (
                  <div
                    key={index}
                    className='bg-gray-50 rounded-lg p-4 flex items-center justify-between'
                  >
                    {getTransactionIcon(transaction.type)}
                    <div className='ml-3'>
                      <p className='font-medium'>
                        {transaction.type.charAt(0).toUpperCase() +
                          transaction.type.slice(1)}
                      </p>
                      <p
                        className={`text-sm ${getTransactionColor(transaction.type)}`}
                      >
                        ₹{transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold'>Transaction History</h2>
                <div className='relative'>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className='flex items-center space-x-1 text-gray-600 hover:text-gray-800 focus:outline-none'
                  >
                    <Filter className='w-4 h-4' />
                    <span>Filter</span>
                    <ChevronDown className='w-4 h-4' />
                  </button>
                  {isFilterOpen && (
                    <div className='absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20'>
                      {['all', 'credit', 'refund'].map(option => (
                        <button
                          key={option}
                          className={`block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-100 w-full text-left ${filter === option ? 'bg-gray-100' : ''}`}
                          onClick={() => {
                            setFilter(option)
                            setIsFilterOpen(false)
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='text-left text-gray-500 border-b'>
                      <th className='pb-3 font-medium'>Type</th>
                      <th className='pb-3 font-medium'>Amount</th>
                      <th className='pb-3 font-medium'>Date</th>
                      <th className='pb-3 font-medium'>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...filteredTransactions]
                      .reverse()
                      .slice(0, 10)
                      .map((transaction, index) => (
                        <tr key={index} className='border-b last:border-b-0'>
                          <td className='py-4 pr-4 flex items-center'>
                            {getTransactionIcon(transaction.type)}
                            <span className='ml-2 capitalize'>
                              {transaction.type}
                            </span>
                          </td>
                          <td
                            className={`py-4 ${getTransactionColor(transaction.type)}`}
                          >
                            ₹{transaction.amount.toLocaleString()}
                          </td>
                          <td className='py-4 text-gray-500'>
                            {formatDate(transaction.date)}
                          </td>
                          <td className='py-4 text-gray-500'>
                            {transaction.description}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {isAddMoneyModalOpen && (
        <div className='fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg min-w-96 shadow-xl'>
            <h2 className='text-xl font-semibold mb-4'>Add Money to Wallet</h2>
            <input
              type='number'
              value={amountToAdd}
              onChange={e => setAmountToAdd(e.target.value)}
              placeholder='Enter amount'
              className='w-full p-2 mb-4 border border-customBorder  text-gray-900  focus:outline-none focus:ring-2 focus:ring-customColorTertiarypop focus:border-customColorSecondary transition ease-in-out duration-300  placeholder-opacity-75'
            />
            <div className='flex justify-end space-x-2'>
              <button
                onClick={() => setIsAddMoneyModalOpen(false)}
                className='px-4 py-2 bg-gray-200 hover:bg-gray-300 duration-200 rounded'
              >
                Cancel
              </button>
              <button
                onClick={handleAddMoneySubmit}
                className='px-4 py-2 bg-customColorTertiary duration-300 hover:bg-customColorTertiaryLight text-white rounded'
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
