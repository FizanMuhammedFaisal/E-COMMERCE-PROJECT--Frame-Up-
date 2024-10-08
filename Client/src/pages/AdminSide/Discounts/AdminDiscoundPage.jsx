import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import CategoryDiscound from './CategoryDiscound'
import ProductDiscound from './ProductDiscound'

import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchStyles,
  fetchTechniques,
  fetchThemes,
  updateStatus
} from '../../../redux/slices/Admin/AdminCategory/categoriesFetchSlice'
const AdminDiscoundPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Fetch themes only if not already fetched
    dispatch(fetchThemes())
    // Fetch other categories concurrently, but conditionally if needed
    dispatch(fetchStyles())
    dispatch(fetchTechniques())
  }, [dispatch])
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState('themes')
  const tabRefs = useRef([])

  const tabs = [
    { value: 'productDiscound', label: 'Product Discound' },
    { value: 'categoryDiscound', label: 'Category Discound' }
  ]

  return (
    <div className='p-6 font-primary bg-gray-100 dark:bg-customP2BackgroundD_darkest text-black dark:text-slate-50 min-h-screen  mt-3 rounded-sm'>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
        <h1 className='text-4xl font-bold mb-2 sm:mb-0 '>
          Discounds Management
        </h1>
      </div>
      <div className='flex justify-end'>
        <motion.button
          onClick={() => {
            navigate('/dashboard/category/add-categories')
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className='p-2 rounded-sm px-4 me-2 bg-customP2Primary text-white font-semibold  hover:bg-opacity-75  text-sm   transition-colors duration-300'
        >
          Add New Category
        </motion.button>
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
          {selectedTab === 'productDiscound' && (
            <div className='bg-white dark:bg-gray-900 p-4 rounded-lg'>
              <CategoryDiscound />
            </div>
          )}
          {selectedTab === 'categoryDiscound' && (
            <div className='bg-white dark:bg-gray-900 p-4 rounded-lg'>
              <ProductDiscound />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDiscoundPage
