'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet as WalletIcon,
  Filter,
  ChevronDown
} from 'lucide-react'
import apiClient from '../../../../services/api/apiClient'

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const fetchWallet = async () => {
    const res = await apiClient.get('api/wallet/')
    return res.data.wallet
  }

  const { data, isLoading, refetch } = useQuery({
    queryFn: fetchWallet,
    queryKey: ['wallet']
  })

  useEffect(() => {
    if (data) {
      setBalance(data.balance)
      setTransactions(data.transactions)
    }
  }, [data])

  const getTransactionIcon = type => {
    switch (type) {
      case 'credit':
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
      case 'credit':
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

  const recentActivity = transactions.slice(0, 3)

  return (
    <div className='bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8'>
      <div className=' mx-auto'>
        <div className='bg-white rounded-xl min-h-screen overflow-hidden'>
          <div className='p-6 sm:p-8 bg-gradient-to-b from-customColorTertiary to bg-customColorTertiarypop'>
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

          <div className='p-6 sm:p-8'>
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
                      {['all', 'credit', 'debit', 'refund'].map(option => (
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
                    {filteredTransactions.map((transaction, index) => (
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
    </div>
  )
}
