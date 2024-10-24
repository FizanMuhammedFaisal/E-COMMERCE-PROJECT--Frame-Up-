import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function OrderModal({ isOpen, onClose, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState('')
  const [otherReason, setOtherReason] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  const returnRequests = [
    "I didn't like the product",
    'The product was damaged',
    'I found a better price elsewhere',
    'I changed my mind',
    'The delivery is taking too long',
    'Other'
  ]

  const handleReasonSelect = reason => {
    setSelectedReason(reason)
    if (reason !== 'Other') {
      setShowConfirmation(true)
    }
  }

  const handleConfirm = () => {
    onConfirm(selectedReason === 'Other' ? otherReason : selectedReason)
    onClose()
  }

  const handleBack = () => {
    setShowConfirmation(false)
    setSelectedReason('')
    setOtherReason('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm'
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className='bg-white rounded-lg shadow-xl max-w-md w-full'
          >
            <div className='flex justify-between items-center p-6 border-b border-gray-200'>
              <h2 className='text-2xl font-semibold text-gray-900'>
                {showConfirmation ? 'Confirm Cancellation' : 'Cancel Order'}
              </h2>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-500 transition-colors duration-200'
              >
                <X className='h-6 w-6' />
              </button>
            </div>
            <div className='p-6 space-y-4'>
              {!showConfirmation ? (
                <>
                  <p className='text-gray-600'>
                    Please select a reason for cancellation:
                  </p>
                  <div className='space-y-2'>
                    {returnRequests.map(reason => (
                      <button
                        key={reason}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                          selectedReason === reason
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                        onClick={() => handleReasonSelect(reason)}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  {selectedReason === 'Other' && (
                    <textarea
                      value={otherReason}
                      onChange={e => setOtherReason(e.target.value)}
                      placeholder='Please specify your reason'
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      rows={3}
                    />
                  )}
                  {selectedReason && (
                    <div className='flex justify-end space-x-4'>
                      <button
                        onClick={handleBack}
                        className='px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200'
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setShowConfirmation(true)}
                        disabled={
                          selectedReason === 'Other' && !otherReason.trim()
                        }
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                          selectedReason === 'Other' && !otherReason.trim()
                            ? 'bg-blue-300 text-white cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className='space-y-4'>
                  <p className='text-gray-600'>
                    Are you sure you want to cancel your order?
                  </p>
                  <p className='font-semibold'>
                    Reason:{' '}
                    {selectedReason === 'Other' ? otherReason : selectedReason}
                  </p>
                  <div className='flex justify-end space-x-4'>
                    <button
                      onClick={handleBack}
                      className='px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200'
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirm}
                      className='px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200'
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
