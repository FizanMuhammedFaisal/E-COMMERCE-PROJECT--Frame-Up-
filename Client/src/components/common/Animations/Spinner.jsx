import { motion } from 'framer-motion'

export default function Spinner() {
  return (
    <div className='flex justify-center items-center h-screen w-full'>
      <motion.div
        className='w-10 h-10 border-4 border-gray-300 rounded-full'
        style={{
          borderTopColor: '#151F45',
          borderRightColor: '#151F45'
        }}
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.2, 1, 0.8, 1],
          borderRadius: ['50%', '30%', '50%', '30%', '50%']
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatType: 'loop'
        }}
      />
    </div>
  )
}
