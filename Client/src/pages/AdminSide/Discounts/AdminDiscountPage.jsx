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
    { value: 'productDiscount', label: 'Product Discount' },
    { value: 'categoryDiscount', label: 'Category Discount' }
  ]

  return (
    <div className='py-6 font-primary bg-gray-100 dark:bg-customP2BackgroundD_darkest text-black dark:text-slate-50 min-h-screen  mt-3 rounded-sm'>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
        <h1 className=' text-3xl sm:text-4xl font-bold mb-2 sm:mb-0 '>
          Discounts Management
        </h1>
      </div>

      <div className='bg-white dark:bg-customP2BackgroundD_darkest mt-4 pt-7 px-4'>
        <div className='relative'>
          <ul className='flex list-none rounded-md  bg-customP2BackgroundW_400  dark:bg-customP2ForegroundD_600 dark:border-customP2ForegroundD_600 border border-customP2BackgroundW_400 relative p-1'>
            {tabs.map((tab, index) => (
              <li key={tab.value} className='flex-1 relative'>
                <a
                  onClick={() => setSelectedTab(tab.value)}
                  className={`relative flex whitespace-nowrap items-center justify-center w-full px-4 py-2 text-sm transition-colors duration-500 ease-in-out cursor-pointer rounded-md z-10 ${
                    selectedTab === tab.value
                      ? 'text-black font-semibold  dark:text-black shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 font-medium dark:text-customP2BackgroundW'
                  }`}
                  ref={el => (tabRefs.current[index] = el)}
                  role='tab'
                  aria-selected={selectedTab === tab.value}
                >
                  {tab.label}
                </a>
                {selectedTab === tab.value && (
                  <motion.div
                    className='absolute inset-0 bg-customP2BackgroundW_700 dark:bg-customP2ForegroundD_200 rounded-md z-0 overflow-hidden'
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
        <div className='py-7 '>
          {selectedTab === 'productDiscount' && <ProductDiscount />}
          {selectedTab === 'categoryDiscount' && <CategoryDiscount />}
        </div>
      </div>
    </div>
  )
}

export default AdminDiscountPage
