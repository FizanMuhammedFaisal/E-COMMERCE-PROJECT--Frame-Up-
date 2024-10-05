import { motion } from 'framer-motion'
import { ShoppingCartIcon } from 'lucide-react'

const EmptyCartAnimation = () => {
  return (
    <div className='relative w-48 h-48 mx-auto mb-8'>
      <motion.div
        className='absolute inset-0 flex items-center justify-center'
        animate={{
          y: [0, -10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <ShoppingCartIcon className='w-32 h-32 text-customP2Primary' />
      </motion.div>
      <motion.div
        className='absolute top-0 left-1/2 w-4 h-4 bg-yellow-400 rounded-full'
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5
        }}
      />
      <motion.div
        className='absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full'
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2
        }}
      />
      <motion.div
        className='absolute top-1/4 right-0 w-3 h-3 bg-red-400 rounded-full'
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.7
        }}
      />
    </div>
  )
}
export default EmptyCartAnimation
