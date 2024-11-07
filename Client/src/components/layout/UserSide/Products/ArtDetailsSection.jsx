import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function ArtDetailsSection({ product }) {
  const navigate = useNavigate()
  return (
    <div className=''>
      {product.productInformation && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full bg-customColorPrimaryLight  py-20'
        >
          <div className='max-w-7xl mx-auto px-7 sm:px-6 lg:px-8'>
            <div className='flex flex-col items-center  md:flex-row md:items-start gap-10'>
              <div className='text-3xl flex sm:justify-end  lg:text-4xl text-gray-900 font-bold font-secondary md:w-1/3'>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className='text-textPrimary'
                >
                  About this Art
                </motion.h2>
              </div>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className='text-gray-700 text-center md:text-start font-tertiary text-lg md:w-2/3'
              >
                {product.productInformation}
              </motion.p>
            </div>
          </div>
        </motion.section>
      )}

      {product.artist && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full bg-customColorSecondary py-20'
        >
          <div className='max-w-7xl  mx-auto px-7 sm:px-6 lg:px-8'>
            <div className='flex flex-col md:flex-row items-center md:items-start gap-10'>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className='md:w-1/3 flex justify-center'
              >
                <img
                  onClick={() => {
                    navigate(`/artists/${product.artist._id}`)
                  }}
                  className='w-48 h-48 hover:cursor-pointer rounded-full object-cover shadow-lg'
                  src={product.artist.image}
                  alt={product.artist.name}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className='md:w-2/3'
              >
                <h3
                  onClick={() => {
                    navigate(`/artists/${product.artist._id}`)
                  }}
                  className='text-2xl hover:cursor-pointer hover:underline font-bold text-gray-900 mb-4 text-center md:text-left'
                >
                  {product.artist.name}
                </h3>
                <p className='text-gray-700 font-tertiary text-lg text-center md:text-left'>
                  {product.artist.description}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  )
}

export default ArtDetailsSection
