import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { sideBarData } from '../../constants/sideBarData'

import { motion, AnimatePresence } from 'framer-motion'
import AdminNavbar from '../layout/AdminSide/AdminNavbar'
import { Tooltip } from 'react-tooltip'
import { FiSidebar } from 'react-icons/fi'
const Sidebar = ({ setData }) => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const [active, setActive] = useState(location.pathname)

  useEffect(() => {
    setActive(location.pathname)
  }, [location.pathname])

  const toggleSidebar = () => setIsOpen(!isOpen)

  const toggleSidebarMode = () => {
    setIsCompact(!isCompact)
    setData(!isCompact)
    if (window.innerWidth >= 768) setIsOpen(true)
  }

  const handleResize = () => {
    if (window.innerWidth >= 768) setIsOpen(true)
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const baseClasses = 'transition-all duration-500 ease-in-out'
  const sidebarClasses = `fixed top-0 left-0 h-full bg-customP2BackgroundW dark:bg-customP2BackgroundD z-40 md:translate-x-0 md:block ${baseClasses}`
  const listItemClasses = `mb-4 items-center font-primary text-lg font-bold duration-300 ${baseClasses}`

  return (
    <div className='relative'>
      <aside
        className={`${sidebarClasses} ${
          isCompact ? 'w-28' : 'w-72'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='sticky top-0 z-10 bg-customP2BackgroundW dark:bg-customP2BackgroundD p-4 border-b border-customP2ForeGroundw_200 dark:border-customP2ForegroundD_600'>
          <motion.div
            className='text-center overflow-hidden'
            animate={{ x: isCompact ? '100%' : 0 }}
            transition={{ type: 'spring', stiffness: 1000, damping: 45 }}
          >
            {isCompact ? (
              <img
                src='/path-to-your-logo.png'
                alt='Frame Up'
                className='w-10 h-10 mx-auto'
              />
            ) : (
              <motion.span className='font-bold justify-center font-secondary whitespace-nowrap dark:text-slate-50 text-3xl'>
                Frame Up
              </motion.span>
            )}
          </motion.div>
        </div>
        <nav className='overflow-y-auto h-[calc(100vh-80px)]'>
          <ul className='pt-4 px-2'>
            {sideBarData.map((item, index) => (
              <li
                key={index}
                className={`
                  ${listItemClasses}
                  ${isCompact ? 'flex justify-center rounded-xl mx-1 my-3' : 'rounded-3xl mx-6 hover:bg-customP2BackgroundW_500 border-customP2ForeGroundw_200'}
                  ${
                    active === item.pathname
                      ? 'text-customP2BackgroundD_100 bg-customP2BackgroundW_700 dark:bg-customP2ForegroundD_200 dark:text-customP2ForegroundD_100'
                      : 'bg-customP2BackgroundW_400 dark:bg-customP2ForegroundD_600 dark:text-slate-50'
                  }
                  hover:text-customP2BackgroundD_100 hover:bg-customP2BackgroundW_700 hover:dark:bg-customP2ForegroundD_200 hover:dark:text-customP2ForegroundD_100
                `}
              >
                <Link
                  to={item.link}
                  className={`flex items-center justify-center w-full h-full p-4`}
                  data-tooltip-id={`tooltip-${index}`}
                  data-tooltip-content={item.title}
                >
                  {isCompact ? (
                    <div className='flex flex-col justify-center items-center'>
                      <span className='material-icons-outlined text-lg'>
                        {item.icon}
                      </span>
                    </div>
                  ) : (
                    <div className='flex justify-start w-full items-center overflow-hidden whitespace-nowrap'>
                      <span className='ml-3'>{item.icon}</span>
                      <div className='pl-5'>{item.title}</div>
                    </div>
                  )}
                </Link>
                {isCompact && (
                  <Tooltip
                    id={`tooltip-${index}`}
                    place='right'
                    className='!gray-800 !text-white dark:!bg-white  dark:!text-gray-800 !px-3 !py-2 !rounded-md !shadow-lg !text-sm !font-medium !z-50'
                    arrowClassName='!border-white dark:!border-gray-800'
                  />
                )}
              </li>
            ))}
          </ul>
          <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
            <button
              onClick={toggleSidebarMode}
              className='w-full py-2 px-4 rounded-lg bg-customP2BackgroundW_500 dark:bg-customP2ForegroundD_600 text-gray-800 dark:text-gray-200 hover:text-customP2BackgroundD_100 hover:bg-customP2BackgroundW_700 hover:dark:bg-customP2ForegroundD_200 hover:dark:text-customP2ForegroundD_100  focus:outline-none'
            >
              {isCompact ? <FiSidebar className='ml-3' size={20} /> : 'Shrink'}
            </button>
          </div>
        </nav>
      </aside>

      <AdminNavbar
        isCompact={isCompact}
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      {isOpen && (
        <div
          onClick={toggleSidebar}
          className='fixed inset-0 bg-black opacity-60 transition-opacity duration-500 z-30 md:hidden'
        ></div>
      )}
    </div>
  )
}

export default Sidebar
