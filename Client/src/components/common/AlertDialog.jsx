import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import CircularProgress from '@mui/material/CircularProgress'
import { motion, AnimatePresence } from 'framer-motion'

Modal.setAppElement('#root')

const AlertDialog = ({
  placeHolder,
  heading,
  description,
  button1,
  button2,
  isOpen = null,
  onCancel,
  onConfirm,
  loading
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen !== null) {
      setModalIsOpen(isOpen)
    }
  }, [isOpen])

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => {
    setModalIsOpen(false)
    if (onCancel) onCancel()
  }

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
    if (isOpen === null) closeModal()
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  }

  return (
    <>
      {isOpen === null && (
        <button
          onClick={openModal}
          className='text-violet-600 hover:bg-violet-100 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black'
        >
          {placeHolder}
        </button>
      )}
      <AnimatePresence>
        {modalIsOpen && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel='Alert Dialog'
            className='modal-content'
            overlayClassName='modal-overlay'
          >
            <motion.div
              className='fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center'
              variants={overlayVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
            >
              <motion.div
                className='w-[90vw] sm:w-[80vw] md:w-[70vw] max-w-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl'
                variants={contentVariants}
                initial='hidden'
                animate='visible'
                exit='hidden'
              >
                <div className='p-6 sm:p-8'>
                  <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>
                    {heading || 'Are you sure?'}
                  </h2>
                  <p className='text-base mb-6 text-gray-700 dark:text-gray-300'>
                    {description || 'This action cannot be undone.'}
                  </p>
                  <div className='flex justify-end gap-4'>
                    <button
                      onClick={closeModal}
                      className='px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                    >
                      {button1 || 'Cancel'}
                    </button>
                    <button
                      onClick={handleConfirm}
                      className='px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 min-w-[80px]'
                    >
                      {loading ? (
                        <CircularProgress
                          sx={{
                            color: 'currentColor'
                          }}
                          size={20}
                          thickness={5}
                        />
                      ) : button2 ? (
                        button2 === 'Active' ? (
                          'Activate'
                        ) : button2 === 'Block' ? (
                          'Block'
                        ) : (
                          button2
                        )
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}

export default AlertDialog
