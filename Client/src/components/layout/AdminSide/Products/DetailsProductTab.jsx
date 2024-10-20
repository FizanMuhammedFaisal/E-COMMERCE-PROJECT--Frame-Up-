import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle } from 'lucide-react'

function DetailsProductTab({ product }) {
  return (
    <div className='bg-white dark:bg-customP2ForegroundD_300 shadow-md rounded-lg overflow-hidden'>
      <div className='p-6'>
        <h2 className='text-2xl font-bold mb-4'>Product Details</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img
              src={product.thumbnailImage[0]}
              alt={product.productName}
              className='w-full max-w-96 h-auto rounded-lg shadow-md'
            />
          </motion.div>
          <div>
            <h3 className='text-xl font-semibold mb-2'>
              {product.productName}
            </h3>
            <p className='mb-4'>Description: {product.productDescription}</p>
            <p className='text-lg font-bold mb-2'>
              Price: ${product.productPrice}
            </p>
            <h3 className='mb-2'>
              Categories:
              <ul>
                {product.productCategories.map((category, index) => (
                  <li key={category._id || index}>
                    {category.name} ({category.type})
                  </li>
                ))}
              </ul>
            </h3>
            <p className='mb-2'>
              Dimensions: {product.dimensions || 'Not specified'}
            </p>
            <p className='mb-2'>Weight: {product.weight || 'Not specified'}</p>
            <p className='mb-2'>
              Year: {product.productYear || 'Not specified'}
            </p>
            <div className='mt-4'>
              <h4 className='text-lg font-semibold mb-2'>Availability</h4>
              <div className='flex items-center'>
                {product.productStock ? (
                  <CheckCircle className='text-green-500 mr-2' />
                ) : (
                  <AlertCircle className='text-red-500 mr-2' />
                )}
                <span>
                  {product.productStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailsProductTab
