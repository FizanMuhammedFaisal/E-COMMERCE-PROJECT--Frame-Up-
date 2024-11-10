import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ArrowLeft, RefreshCcw } from 'lucide-react'
import { Link } from 'react-router-dom'

const FloatingShape = ({ color, size, delay }) => (
  <motion.div
    className='absolute rounded-full opacity-70'
    style={{
      backgroundColor: color,
      width: size,
      height: size
    }}
    initial={{ scale: 0, x: '-50%', y: '-50%' }}
    animate={{
      scale: [1, 1.2, 1],
      x: ['-50%', '-30%', '-70%', '-50%'],
      y: ['-50%', '-70%', '-30%', '-50%']
    }}
    transition={{
      delay,
      duration: 5,
      repeat: Infinity,
      repeatType: 'reverse'
    }}
  />
)

const ErrorComponent = ({ error }) => {
  const [showRefresh, setShowRefresh] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowRefresh(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 overflow-hidden'>
      <motion.div
        className='w-full max-w-4xl bg-white rounded-lg overflow-hidden relative'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FloatingShape color='#FF6B6B' size={100} delay={0} />
        <FloatingShape color='#4ECDC4' size={80} delay={0.5} />
        <FloatingShape color='#45B7D1' size={120} delay={1} />
        <FloatingShape color='#F7B801' size={90} delay={1.5} />
        <FloatingShape color='#9B5DE5' size={110} delay={2} />

        <div className='p-8 sm:p-12 relative z-10'>
          <motion.div
            className='flex justify-center items-center mb-8'
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AlertTriangle className='h-24 w-24 text-red-500' />
          </motion.div>
          <motion.h2
            className='text-3xl font-semibold text-gray-800 text-center mb-4'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Oops! An error occurred
          </motion.h2>
          <motion.p
            className='text-xl text-gray-600 mb-8 text-center max-w-md mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {error instanceof Error && error.message === 'Product not found'
              ? "We couldn't find the product you're looking for. It may have been removed or doesn't exist."
              : 'An unexpected error occurred while loading the product. Please try again later.'}
          </motion.p>

          <motion.div
            className='flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link to={'/all'}>
              <motion.button
                className='px-6 py-2 bg-customColorTertiary text-white rounded-md hover:bg-customColorTertiaryLight transition-colors duration-300 flex items-center justify-center'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className='mr-2' />
                Return to Home
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showRefresh && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className='mt-8'
          >
            <button
              onClick={() => window.location.reload()}
              className='text-customColorTertiary hover:text-customColorTertiaryLight transition-colors duration-300 flex items-center'
            >
              <RefreshCcw className='mr-2' />
              Refresh the page
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ErrorComponent
