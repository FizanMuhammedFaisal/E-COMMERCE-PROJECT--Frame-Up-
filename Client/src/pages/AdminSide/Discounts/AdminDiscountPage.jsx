import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import CategoryDiscount from './CategoryDiscount'
import ProductDiscount from './ProductDiscount'

import { useDispatch } from 'react-redux'
import {
  fetchProductDiscounts,
  fetchCategoryDiscounts
} from '../../../redux/slices/Admin/AdminDiscount/adminDiscountSlice'
const AdminDiscountPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCategoryDiscounts())

    dispatch(fetchProductDiscounts())
  }, [dispatch])

  const [selectedTab, setSelectedTab] = useState('productDiscount')
  const tabRefs = useRef([])

  const tabs = [
    { value: 'categoryDiscount', label: 'Category Discount' },
    { value: 'productDiscount', label: 'Product Discount' }
  ]

  return (
    <div className='p-6 font-primary bg-gray-100 dark:bg-customP2BackgroundD_darkest text-black dark:text-slate-50 min-h-screen  mt-3 rounded-sm'>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
        <h1 className='text-4xl font-bold mb-2 sm:mb-0 '>
          Discounts Management
        </h1>
      </div>

      <div className='bg-white dark:bg-gray-900  mt-4 pt-7 px-4'>
        <div className='relative'>
          <ul className='flex list-none rounded-md  bg-customP2ForeGroundW_300  dark:bg-customP2ForegroundD_600 dark:border-customP2ForegroundD_200 border border-customP2ForeGroundW_400 relative p-1'>
            {tabs.map((tab, index) => (
              <li key={tab.value} className='flex-1 relative'>
                <a
                  onClick={() => setSelectedTab(tab.value)}
                  className={`relative flex items-center justify-center w-full px-4 py-2 text-sm transition-colors duration-500 ease-in-out cursor-pointer rounded-md z-10 ${
                    selectedTab === tab.value
                      ? 'text-customP2ForegroundD_300 font-semibold  dark:text-customP2Button shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 dark:text-customP2BackgroundW'
                  }`}
                  ref={el => (tabRefs.current[index] = el)}
                  role='tab'
                  aria-selected={selectedTab === tab.value}
                >
                  {tab.label}
                </a>
                {selectedTab === tab.value && (
                  <motion.div
                    className='absolute inset-0 bg-customP2BackgroundW_500 dark:bg-customP2BackgroundD_200 rounded-md z-0 overflow-hidden'
                    layoutId='  highlight'
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 32
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Tab Content */}
        <div className='p-4 '>
          {selectedTab === 'productDiscount' && (
            <div className='bg-white dark:bg-gray-900 p-4 rounded-lg'>
              <ProductDiscount />
            </div>
          )}
          {selectedTab === 'categoryDiscount' && (
            <div className='bg-white dark:bg-gray-900 p-4 rounded-lg'>
              <CategoryDiscount />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDiscountPage
