import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import ThemeCategory from './ThemeCategory'
import StyleCategory from './StyleCategory'
import TechniquesCategory from './TechniquesCategory'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchStyles,
  fetchTechniques,
  fetchThemes,
  updateStatus
} from '../../../redux/slices/Admin/AdminCategory/categoriesFetchSlice'
const AdminCategory = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchThemes())

    dispatch(fetchStyles())
    dispatch(fetchTechniques())
  }, [dispatch])
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState('themes')
  const tabRefs = useRef([])

  const tabs = [
    { value: 'themes', label: 'Themes' },
    { value: 'styles', label: 'Styles' },
    { value: 'techniques', label: 'Techniques' }
  ]
  const AddButton = () => {
    return (
      <motion.button
        onClick={() => {
          navigate('/dashboard/category/add-categories')
        }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className='flex items-center px-4 py-2  bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500 text-white rounded-md shadow '
      >
        Add New Category
      </motion.button>
    )
  }

  return (
    <div className='p-6 font-primary  dark:bg-customP2BackgroundD_darkest text-black dark:text-slate-50 min-h-screen  mt-3 rounded-sm'>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
        <h1 className='text-4xl font-bold mb-2 sm:mb-0 '>
          Category Management
        </h1>
      </div>

      <div className='  mt-4 pt-7 px-4'>
        <div className='relative'>
          <ul className='flex list-none rounded-md  bg-customP2BackgroundW_400  dark:bg-customP2ForegroundD_600 dark:border-customP2ForegroundD_600 border border-customP2BackgroundW_400 relative p-1'>
            {tabs.map((tab, index) => (
              <li key={tab.value} className='flex-1 relative'>
                <a
                  onClick={() => setSelectedTab(tab.value)}
                  className={`relative flex items-center justify-center w-full px-4 py-2 text-sm transition-colors duration-500 ease-in-out cursor-pointer rounded-md z-10 ${
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
        <div className='p-4 '>
          {selectedTab === 'themes' && <ThemeCategory AddButton={AddButton} />}
          {selectedTab === 'styles' && <StyleCategory AddButton={AddButton} />}
          {selectedTab === 'techniques' && (
            <TechniquesCategory AddButton={AddButton} />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminCategory
