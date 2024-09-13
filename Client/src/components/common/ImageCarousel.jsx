import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getImageFromDB } from '../../utils/indexedDB/adminImageDB'

const ImageCarousel = ({ imageIds, onDelete, onEdit, type }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true) // Optional: to handle loading state
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagePromises = imageIds.map(async id => {
          const file = await getImageFromDB(id)
          const url = URL.createObjectURL(file)
          return { id, url }
        })
        console.log(imagePromises)
        const images = await Promise.all(imagePromises)
        setImages(images)
      } catch (error) {
        console.error('Error fetching images:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [imageIds])
  const handleNext = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length)
  }, [images.length])

  const handlePrev = useCallback(() => {
    setCurrentIndex(
      prevIndex => (prevIndex - 1 + images.length) % images.length
    )
  }, [images.length])

  const handleSelect = useCallback(index => {
    setCurrentIndex(index)
  }, [])

  useEffect(() => {
    if (images.length > 0) {
      const timer = setInterval(handleNext, 7000) // Auto-advance every 6 seconds
      return () => clearInterval(timer)
    }
  }, [handleNext, images.length])

  return (
    <div className='relative w-full max-w-4xl mx-auto overflow-hidden'>
      <motion.div
        className='flex'
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
      >
        {images.map((image, index) => (
          <div key={index} className='flex-shrink-0 w-full'>
            <img
              src={image.url}
              alt={`Product ${index}`}
              className='w-full h-64 object-cover'
            />
          </div>
        ))}
      </motion.div>

      {/* Delete and Edit Buttons positioned at the bottom ends */}
      <button
        type='button'
        className='absolute bottom-4 left-4  backdrop-blur-md hover:opacity-80  text-red-400 rounded-md px-4 py-2 z-20'
        onClick={() => onDelete(images[currentIndex], type)}
      >
        Delete
      </button>
      <button
        type='button'
        className='absolute bottom-4 right-4 backdrop-blur-md hover:opacity-80 text-blue-400 rounded-md px-4 py-2 z-20'
        onClick={() => onEdit(images[currentIndex], type)}
      >
        Edit
      </button>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        type='button'
        className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 z-10'
      >
        &#8249;
      </button>
      <button
        type='button'
        onClick={handleNext}
        className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 z-10'
      >
        &#8250;
      </button>

      {/* Navigation Bar */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2'>
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-blue-500' : 'backdrop-blur-xl'
            }`}
            onClick={() => handleSelect(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
