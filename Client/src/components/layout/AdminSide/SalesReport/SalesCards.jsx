'use client'

import { motion } from 'framer-motion'
import {
  ShoppingCart,
  XCircle,
  DollarSign,
  Tag,
  Gift,
  Truck,
  TrendingUp
} from 'lucide-react'
const SummaryCard = ({ title, value, icon: Icon, iconColor }) => (
  <motion.div
    className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
  >
    <div className='p-4 flex items-center min-h-28'>
      <div className={`rounded-full p-2 ${iconColor} mr-4`}>
        <Icon className='h-6 w-6 text-white' aria-hidden='true' />
      </div>
      <div className='flex-grow'>
        <h2 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
          {title}
        </h2>
        <p className='text-2xl font-bold text-gray-900 dark:text-white'>
          {value}
        </p>
      </div>
    </div>
  </motion.div>
)

export default function SalesCards({ salesData = {} }) {
  const summaryItems = [
    {
      title: 'Total Orders Delivered',
      value: salesData.summary?.totalDelivered,
      icon: ShoppingCart,
      iconColor: 'bg-blue-500',
      trend: 12
    },
    {
      title: 'Total Orders Cancelled',
      value: salesData.summary?.totalCancelled,
      icon: XCircle,
      iconColor: 'bg-red-500',
      trend: -2
    },
    {
      title: 'Total Sales Amount',
      value: salesData.summary?.totalOrderAmount,
      icon: DollarSign,
      iconColor: 'bg-green-500',
      trend: 8
    },
    {
      title: 'Offer Discount Given',
      value: salesData.summary?.totalDiscount,
      icon: Tag,
      iconColor: 'bg-yellow-500',
      trend: 5
    },
    {
      title: 'Coupon Discount Given',
      value: salesData.summary?.totalCouponDiscount,
      icon: Gift,
      iconColor: 'bg-purple-500',
      trend: -3
    },
    {
      title: 'Shipping Charges',
      value: salesData.summary?.totalShippingCharges,
      icon: Truck,
      iconColor: 'bg-indigo-500',
      trend: 1
    }
    // {
    //   title: 'Net Total Revenue',
    //   value: salesData.summary?.netTotalRevenue,
    //   icon: TrendingUp,
    //   iconColor: 'bg-pink-500',
    //   trend: 15
    // }
  ]

  return (
    <div className='py-5'>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {summaryItems.map((item, index) => (
          <SummaryCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            iconColor={item.iconColor}
            trend={item.trend}
          />
        ))}
      </div>
    </div>
  )
}
