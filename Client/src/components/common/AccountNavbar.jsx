import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaRegUser, FaUserCircle } from 'react-icons/fa'

import { RiLogoutBoxRLine } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import apiClient from '../../services/api/apiClient'
import { logoutUser } from '../../redux/slices/authSlice'

export default function AccountNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef()
  const dispatch = useDispatch()
  const toggleMenu = () => setIsOpen(!isOpen)
  //
  const handleLogout = async () => {
    const res = await apiClient.get('api/users/logout', {
      withCredentials: true
    })
    console.log(res.data)
    if (res.status === 200) {
      dispatch(logoutUser())
    }
  }
  //
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 22
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <div className='relative' ref={menuRef}>
      <motion.button
        className='text-xl text-textPrimary p-2 rounded-full transition-colors duration-200 focus:outline-none '
        whileHover={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        aria-haspopup='true'
        aria-expanded={isOpen}
      >
        <motion.div whileHover={{ scale: 1.1 }}>
          <FaRegUser />
        </motion.div>
        <span className='sr-only'>Account menu</span>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200'
            variants={menuVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
          >
            {/* <motion.div
              className='px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg'
              variants={itemVariants}
            >
              <p className='text-sm font-bold text-primary truncate'>
                user@example.com
              </p>
            </motion.div> */}
            <motion.div className='py-1' variants={itemVariants}>
              <Link
                to='/account'
                className='flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-customColorTertiarypop/10 transition-colors duration-200'
                onClick={() => setIsOpen(false)}
              >
                <FaUserCircle className='mr-3 text-customColorTertiarypop' />
                <span className='font-medium'>Your Profile</span>
              </Link>
            </motion.div>
            <motion.div
              className='py-1 border-t border-gray-200'
              variants={itemVariants}
            >
              <button
                onClick={handleLogout}
                className='flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200'
              >
                <RiLogoutBoxRLine className='mr-3 text-red-500' />
                <span className='font-medium'>Sign out</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
