import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggler from '../common/ThemeToggler'
import { sideBarData } from '../../constants/sideBarData'
import { FaCaretSquareRight } from 'react-icons/fa'
const Sidebar = ({ setData }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false) // State for compact mode

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const toggleSidebarMode = () => {
    setIsCompact(!isCompact)
    setData(!isCompact)
    // Keep the sidebar open on larger screens when switching modes
    if (window.innerWidth >= 768) {
      setIsOpen(true)
    }
  }

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsOpen(true)
    }
  }

  useEffect(() => {
    // Set isOpen to true on mount if the screen is md or larger
    handleResize()

    // Add an event listener for window resize
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className='relative'>
      {/* Sidebar all inside  */}
      <aside
        className={`fixed top-0 left-0 ${
          isCompact ? 'w-24' : 'w-80'
        } h-full bg-customP2BackgroundW dark:bg-customP2BackgroundD p-2 transform transition-all duration-500 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:block`}
      >
        <nav>
          <ul className='pt-16'>
            {sideBarData.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`mb-4 ${
                    isCompact ? 'flex justify-center' : ''
                  } items-center ${
                    isCompact
                      ? 'bg-customP2BackgroundW_500 px-7 rounded-xl mx-1 my-3 m-0 '
                      : 'bg-customP2BackgroundW_600 rounded-3xl mx-5 hover:bg-customP2BackgroundW_500 border-customP2ForeGroundw_200'
                  } duration-300 font-primary text-lg font-bold`}
                >
                  <Link
                    to={item.link}
                    className={`flex items-center justify-center w-full h-full p-4${
                      isCompact ? '' : ''
                    }`}
                  >
                    {isCompact ? (
                      <div className='flex flex-col justify-center items-center '>
                        <span className='material-icons-outlined text-2xl'>
                          {item.icon}
                        </span>
                        <span className='text-xs text-center pt-1 '>
                          {item.title}
                        </span>
                      </div>
                    ) : (
                      <div className='flex justify-start w-full items-center overflow-hidden'>
                        <span className='ml-3'>{item.icon}</span>

                        <div className=' pl-5  transition-all duration-500'>
                          {item.title}
                        </div>
                      </div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        {/* Button to switch sidebar modes */}
        <button
          onClick={toggleSidebarMode}
          className={`absolute bottom-6 left-6  bg-gray-300 dark:bg-gray-700  rounded-full ${
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
            <span className='mx-3 my-3 w-full'>Shrink</span>
          )}
        </button>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 p-4 bg-customP2BackgroundW_500 dark:bg-customP2BackgroundD_500 dark:text-slate-50 text-slate-900 justify-between items-center transition-all duration-500 ease-in-out ${
          isCompact ? (isOpen ? 'md:ml-24' : 'ml-0') : 'md:ml-80'
        } flex`}
      >
        {/* Navbar content */}
        <div className='flex justify-between items-center flex-1'>
          <span className='text-lg font-bold justify-center'>Logo</span>
          <div>hey man</div>
          <div>hey man</div>
          <ThemeToggler />
        </div>
        <button
          onClick={toggleSidebar}
          className='focus:outline-none md:hidden'
        >
          <span className='material-icons-outlined text-2xl'>menu</span>
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className='fixed inset-0 bg-black opacity-60 transition-opacity duration-1000 z-30 md:hidden'
        ></div>
      )}
    </div>
  )
}

export default Sidebar
