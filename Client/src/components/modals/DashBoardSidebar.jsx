import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { sideBarData } from '../../constants/sideBarData'
import { FaCaretSquareRight } from 'react-icons/fa'
import { motion } from 'framer-motion'
import AdminNavbar from '../layout/AdminSide/AdminNavbar'

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
  const sidebarClasses = `fixed top-0 left-0 h-full bg-customP2BackgroundW dark:bg-customP2BackgroundD p-2 z-40 md:translate-x-0 md:block ${baseClasses}`
  const listItemClasses = `mb-4 items-center font-primary text-lg font-bold duration-300 ${baseClasses}`

  return (
    <div className='relative'>
      <aside
        className={`${sidebarClasses} ${
          isCompact ? 'w-24' : 'w-72'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <nav>
          <motion.div
            className='text-center mt-2 overflow-hidden'
            animate={{ x: isCompact ? '100%' : 0 }}
            transition={{ type: 'spring', stiffness: 1000, damping: 45 }}
          >
            <motion.span className='font-bold justify-center font-secondary whitespace-nowrap dark:text-slate-50 text-3xl'>
              {isCompact ? '' : 'Frame Up'}
            </motion.span>
          </motion.div>
          <ul className='pt-11'>
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
                >
                  {isCompact ? (
                    <div className='flex flex-col justify-center items-center'>
                      <span className='material-icons-outlined text-lg'>
                        {item.icon}
                      </span>
                      <span className='text-xs text-center pt-1'>
                        {item.title}
                      </span>
                    </div>
                  ) : (
                    <div className='flex justify-start w-full items-center overflow-hidden whitespace-nowrap'>
                      <span className='ml-3'>{item.icon}</span>
                      <div className='pl-5'>{item.title}</div>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={toggleSidebarMode}
          className={`absolute bottom-6 left-6 bg-gray-300 dark:bg-gray-700 rounded-full ${
            isCompact
              ? 'text-gray-800 dark:text-gray-200'
              : 'text-gray-600 dark:text-gray-400'
          } focus:outline-none`}
        >
          {isCompact ? (
            <span>
              <FaCaretSquareRight className='mx-3 my-3' />
            </span>
          ) : (
            <div className='flex flex-1'>
              <span className='mx-3 my-3 w-full'>Shrink</span>
            </div>
          )}
        </button>
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
