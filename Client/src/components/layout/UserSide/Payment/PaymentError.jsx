import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

const PaymentError = ({ errorMessage, onRetry, onGoToOrders }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className='flex flex-col items-center justify-center h-full p-8 bg-white rounded-lg shadow-lg'
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <AlertCircle className='w-24 h-24 text-red-500 mb-6' />
      </motion.div>
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>Payment Failed</h2>
      <p className='text-gray-600 text-center mb-8'>{errorMessage}</p>
      <div className='flex space-x-4'>
        <button
          onClick={onRetry}
          className='px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors'
        >
          Retry Payment
        </button>
        <button
          onClick={onGoToOrders}
          className='px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors'
        >
          Go to Orders
        </button>
      </div>
    </motion.div>
  )
}
export default PaymentError
