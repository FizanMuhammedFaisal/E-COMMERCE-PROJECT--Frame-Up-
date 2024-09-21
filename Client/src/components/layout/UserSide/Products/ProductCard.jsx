import React from 'react'
import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  console.log('inside product card')
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
      {product.map((product, id) => (
        <Link key={id} to={`/products/${product._id}`}>
          <div className='group'>
            <div className='relative overflow-hidden  h-64 rounded-lg'>
              <img
                src={product.thumbnailImage}
                alt={product.productName}
                className='w-auto h-full mx-auto transform transition-transform duration-300 group-hover:scale-110'
              />
              {/* <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
          <button className='bg-white text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200'>
            View Details
          </button>
        </div> */}
            </div>
            <div className='mt-4'>
              <h3 className='font-semibold text-xl text-gray-800'>
                {product.productName}
              </h3>
              <p className='text-gray-600 mb-2'>{product.artist}</p>
              <p className='text-gray-800 font-bold text-lg'>
                ${product.productPrice}
              </p>
              <div className='mt-2 flex flex-wrap gap-2'>
                {product.productCategories.map((curr, i) => (
                  <span
                    key={i}
                    className='bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700'
                  >
                    {curr.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ProductCard
