import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ImageZoomModal from '../../../modals/ImageZoomModal'
import ProductRatings from '../../../common/ProductRatings'
import ProductFeatures from './ProductFeatures'

function ProductDetails({
  selectedImageIndex,
  allImages,
  handleThumbnailClick,
  product
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  return (
    <div>
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col lg:flex-row items-start'>
            <div className='lg:w-1/2 relative overflow-hidden'>
              {/* Main Image Display with fixed dimensions and centered images */}
              <div
                className='w-full h-96 relative overflow-hidden'
                onClick={openModal}
              >
                <motion.div
                  className='flex h-full'
                  animate={{ x: `-${100 * selectedImageIndex}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  {allImages.map((image, index) => (
                    <div
                      key={index}
                      className='w-full h-full  flex-shrink-0 flex items-center justify-center'
                    >
                      <img
                        src={image || 'default_image_url'}
                        alt={`Product ${index + 1}`}
                        className='max-w-full max-h-full hover:scale-105 duration-500 cursor-pointer object-contain'
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
            {/* Product Details */}
            <div className='lg:w-1/2 lg:pl-12 mt-8 lg:mt-0'>
              <h1 className='text-4xl lg:text-5xl font-bold mb-4 text-gray-900'>
                {product.productName || 'Product Title'}
              </h1>
              <p className='text-xl mb-8 text-gray-600'>
                {product.productDescription || 'No description available.'}
              </p>
              <p className='text-3xl font-bold mb-4'>
                ${product.productPrice || '0.00'}
              </p>
              <div className='text-md text-gray-700 mb-4'>
                <strong>Dimensions:</strong> {product.dimensions || 'N/A'}
              </div>
              <div className='text-md text-gray-700 mb-8'>
                <strong>Weight:</strong> {product.weight || 'N/A'} kg
              </div>
              <button className='bg-customP2Primary text-slate-50 hover:bg-primary/90 py-2 px-4 rounded'>
                Add to Cart
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <h1 className='text-3xl'>Product Images</h1>
          <div className='mt-8 flex space-x-4 overflow-x-auto'>
            {allImages.map((image, index) => (
              <div key={index} className='relative flex-shrink-0'>
                <motion.div
                  className={` cursor-pointer mb-2 `}
                  onClick={() => handleThumbnailClick(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                  <div className='h-24 flex items-center justify-center'>
                    <img
                      src={image || 'default_image_url'}
                      alt={`Thumbnail ${index + 1}`}
                      className='w-auto h-full object-cover'
                      loading='lazy'
                    />
                  </div>
                </motion.div>
                {selectedImageIndex === index && (
                  <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-customP2Primary'></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for Image Zoom and Swiping */}
      <ImageZoomModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        allImages={allImages}
        selectedImageIndex={selectedImageIndex}
      />
      <ProductRatings />
      <ProductFeatures features={product} />
    </div>
  )
}

export default ProductDetails
