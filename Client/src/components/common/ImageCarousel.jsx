import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getImageFromDB } from '../../utils/indexedDB/adminImageDB'

const ImageCarousel = ({
  imageIds,
  onDelete,
  onEdit,
  type,
  DBError,
  cloudinaryMode
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      if (cloudinaryMode) {
        // If cloudinaryMode is true, assume imageIds are Cloudinary URLs
        const cloudinaryImages = imageIds.map((url, index) => ({
          id: index,
          url
        }))
        setImages(cloudinaryImages)
        setLoading(false)
      } else if (!DBError) {
        // If no DBError, imageIds contains IDs, fetch from IndexedDB
        try {
          const imagePromises = imageIds.map(async id => {
            const file = await getImageFromDB(id)
            const url = URL.createObjectURL(file)
            return { id, url }
          })

          const fetchedImages = await Promise.all(imagePromises)
          setImages(fetchedImages)
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      } else {
        // If DBError is true, imageIds contains the actual image files

        const fileUrls = imageIds.map((file, index) => {
          if (!file) {
            return null // Skip invalid files
          }
          const url = URL.createObjectURL(file)
          return { id: index, url }
        })
        setImages(fileUrls)
        setLoading(false)
      }
    }

    fetchImages()
  }, [imageIds, DBError])

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
      const timer = setInterval(handleNext, 7000)
      return () => clearInterval(timer)
    }
  }, [handleNext, images.length])

  if (loading) {
    return <div>Loading...</div>
  }

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
        className='absolute bottom-4 left-4 backdrop-blur-md duration-300 hover:opacity-80 text-red-400 rounded-md px-4 py-2 z-20'
        onClick={() => onDelete(images[currentIndex], type)}
      >
        Delete
      </button>
      <button
        type='button'
        className='absolute bottom-4 right-4 backdrop-blur-md hover:opacity-80 duration-300 text-blue-400 rounded-md px-4 py-2 z-20'
        onClick={() =>
          onEdit(images[currentIndex], type, currentIndex, DBError)
        }
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
