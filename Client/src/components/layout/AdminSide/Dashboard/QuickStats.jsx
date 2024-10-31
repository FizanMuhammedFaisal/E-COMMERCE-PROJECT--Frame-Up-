import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  TrendingUp
} from 'lucide-react'
import apiClient from '../../../../services/api/apiClient'

const QuickStat = ({ title, value, icon, trend, trendValue }) => (
  <motion.div
    className='bg-white dark:bg-customP2BackgroundD p-6 rounded-xl shadow-lg'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className='flex items-center justify-between mb-4'>
      <div
        className={`p-3 rounded-full ${trend >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}
      >
        {icon}
      </div>
    </div>
    <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-1'>
      {value.toFixed(2)}
    </h3>
    <p className='text-sm text-gray-500 dark:text-gray-400'>{title}</p>
    <div
      className={`text-sm font-medium ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
    >
      {trend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
      <span className='ml-1'>{trendValue}% vs last month</span>
    </div>
  </motion.div>
)

function QuickStats() {
  const fetchData = async () => {
    const res = await apiClient.get('/api/sales-report/overview')
    return res.data.data
  }

  const { data } = useQuery({
    queryFn: fetchData,
    queryKey: ['quickStats']
  })

  if (!data) return null

  const stats = [
    {
      title: 'Total Revenue',
      value: data.totalRevenue,
      icon: (
        <DollarSign size={24} className='text-green-500 dark:text-green-400' />
      ),
      trend: data.totalRevenueGrowth,
      trendValue: data.totalRevenueGrowth
    },
    {
      title: 'Total Orders',
      value: data.totalOrders,
      icon: (
        <ShoppingCart size={24} className='text-blue-500 dark:text-blue-400' />
      ),
      trend: data.totalOrdersGrowth,
      trendValue: data.totalOrdersGrowth
    },
    {
      title: 'Avg. Order Value',
      value: data.avgOrderValue,
      icon: (
        <TrendingUp
          size={24}
          className='text-yellow-500 dark:text-yellow-400'
        />
      ),
      trend: data.avgOrderValueGrowth,
      trendValue: data.avgOrderValueGrowth
    },
    {
      title: 'Avg. Order Value',
      value: data.avgOrderValue,
      icon: (
        <TrendingUp
          size={24}
          className='text-yellow-500 dark:text-yellow-400'
        />
      ),
      trend: data.avgOrderValueGrowth,
      trendValue: data.avgOrderValueGrowth
    }
  ]

  return (
    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      {stats.map((stat, index) => (
        <QuickStat key={index} {...stat} />
      ))}
    </div>
  )
}

export default QuickStats
