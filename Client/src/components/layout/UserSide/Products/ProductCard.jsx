import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'

function ProductCard({ product, viewMode, addToWishlist }) {
  const handleWishlistClick = e => {
    e.preventDefault()
    e.stopPropagation()
    addToWishlist(product._id)
  }

  return (
    <Link
      to={`/products/${product._id}`}
      className={`block ${viewMode === 'list' ? 'w-full' : 'flex-grow'}`}
    >
      <motion.div
        className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${
          viewMode === 'list' ? 'flex' : 'flex flex-col'
        } h-full transition-shadow duration-300 hover:shadow-lg`}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`relative h-64 bg-gray-200 ${
            viewMode === 'list' ? 'w-1/3' : 'w-full'
          } flex items-center justify-center`}
        >
          <img
            src={product.thumbnailImage}
            alt={product.productName}
            className='max-w-full max-h-full object-contain  transition-transform duration-300 hover:scale-105'
            loading='lazy'
          />
          <motion.button
            onClick={handleWishlistClick}
            className='absolute top-2 right-2 p-2 z-10 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiHeart size={20} />
          </motion.button>
          {product.discountPrice && (
            <span className='absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded'>
              Sale
            </span>
          )}
        </div>

        <div
          className={`p-4 ${viewMode === 'list' ? 'w-2/3' : 'w-full'} flex flex-col justify-between`}
        >
          <div>
            <h3 className='font-semibold text-lg text-gray-800 mb-1 truncate'>
              {product.productName}
            </h3>
            <p className='text-gray-600 mb-2 text-sm truncate'>
              {product.artist}
            </p>
          </div>

          <div>
            <div className='mb-2'>
              {product.discountPrice ? (
                <div className='flex items-center'>
                  <p className='text-red-600 font-bold text-lg mr-2'>
                    ${product.discountPrice.toFixed(2)}
                  </p>
                  <p className='text-gray-500 line-through text-sm'>
                    ${product.productPrice.toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className='text-gray-800 font-bold text-lg'>
                  ${product.productPrice.toFixed(2)}
                </p>
              )}
            </div>

            <div className='flex flex-wrap gap-1'>
              {product.productCategories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className='bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600'
                >
                  {category.name}
                </span>
              ))}
              {product.productCategories.length > 2 && (
                <span className='text-xs text-gray-500'>
                  +{product.productCategories.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default React.memo(ProductCard)
