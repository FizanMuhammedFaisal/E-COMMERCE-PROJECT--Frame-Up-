import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'

function ProductCard({ product, viewMode }) {
  return (
    <Link
      to={`/products/${product._id}`}
      className={`block ${viewMode === 'list' ? 'w-full' : 'flex-grow'} `}
    >
      <motion.div
        className={`bg-white border  overflow-hidden ${
          viewMode === 'list' ? 'flex w-full' : 'flex flex-col h-full'
        }`}
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
          />
          <motion.button
            className='absolute top-2 right-2 p-2 z-10 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiHeart size={20} />
          </motion.button>
        </div>

        <div
          className={`p-4 ${
            viewMode === 'list' ? 'w-2/3' : 'w-full flex-grow'
          }`}
        >
          <h3 className='font-semibold text-xl text-gray-800 mb-2'>
            {product.productName}
          </h3>

          <p className='text-gray-600 mb-2'>{product.artist}</p>
          <p className='text-gray-800 font-bold text-lg mb-2'>
            ${product.productPrice.toFixed(2)}
          </p>
          <div className='mb-4 flex flex-wrap gap-2'>
            {product.productCategories.map((category, index) => (
              <span
                key={index}
                className='bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700'
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default ProductCard
