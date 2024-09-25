import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Modal from 'react-modal'
import { IoClose } from 'react-icons/io5'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { ZoomIn, ZoomOut } from 'lucide-react'

function ImageZoomModal({
  isOpen,
  onRequestClose,
  allImages,
  selectedImageIndex
}) {
  const [currentIndex, setCurrentIndex] = useState(selectedImageIndex)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  useEffect(() => {
    setCurrentIndex(selectedImageIndex)
  }, [selectedImageIndex])

  const handlePrevImage = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1))
  }, [allImages.length])

  const handleNextImage = useCallback(() => {
    setCurrentIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1))
  }, [allImages.length])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel='Image Modal'
      className='fixed inset-0 flex items-center  justify-center backdrop-blur-sm bg-black bg-opacity-50'
      overlayClassName='fixed z-50 inset-0'
    >
      <div className='relative w-full h-full flex items-center justify-center'>
        <button
          className='absolute top-4 right-4 text-white z-20 bg-black p-2 rounded-full hover:bg-gray-800'
          onClick={onRequestClose}
        >
          <IoClose size={30} />
        </button>

        <button
          className='absolute left-4 text-white text-2xl z-20 bg-black p-2 rounded-full hover:bg-gray-800'
          onClick={handlePrevImage}
        >
          &#8592;
        </button>

        <button
          className='absolute right-4 text-white text-2xl z-20 bg-black p-2 rounded-full hover:bg-gray-800'
          onClick={handleNextImage}
        >
          &#8594;
        </button>

        <motion.div
          className='w-full h-full'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={3}
            doubleClick={{ mode: 'toggle' }}
          >
            {({ zoomIn, resetTransform }) => (
              <>
                <TransformComponent
                  wrapperClass='w-full h-full'
                  contentClass='w-full h-full flex items-center justify-center'
                >
                  <img
                    src={allImages[currentIndex] || '/api/placeholder/400/320'}
                    alt={`Product ${currentIndex + 1}`}
                    className='max-w-none max-h-none object-contain'
                    style={{ maxHeight: '90vh', maxWidth: '90vw' }}
                  />
                </TransformComponent>
                <button
                  className='absolute bottom-4 right-4 text-white z-20 bg-black p-2 rounded-full hover:bg-gray-800'
                  onClick={() => {
                    if (isZoomed) {
                      resetTransform()
                      setIsZoomed(false)
                    } else {
                      zoomIn(1.5)
                      setIsZoomed(true)
                    }
                  }}
                >
                  {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
                </button>
              </>
            )}
          </TransformWrapper>
        </motion.div>
      </div>
    </Modal>
  )
}

export default ImageZoomModal
