import { motion } from 'framer-motion'

export default function Spinner({ size, center, speed }) {
  const getSizeClass = () => {
    switch (size) {
      case 1:
        return 'w-7 h-7'
      case -1:
        return 'w-4 h-4'
      case 2:
        return 'w-10 h-10'
      default:
        return 'w-10 h-10'
    }
  }
  const sizeClass = getSizeClass()
  const SPEED = speed === 1 ? 1.2 : speed === 2 ? 1 : 1.8
  const Center = center
    ? 'flex justify-center items-center  h-screen w-full'
    : ''
  return (
    <div className={Center}>
      <motion.div
        className={`${sizeClass} border-4  dark:border-r-customP2BackgroundD_500 dark:border-t-customP2BackgroundD_500 border-gray-200 border-t-customColorTertiary border-r-customColorTertiary  rounded-full`}
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.2, 1, 0.8, 1],
          borderRadius: ['50%', '30%', '10%', '30%', '50%']
        }}
        transition={{
          duration: SPEED,
          ease: 'easeInOut',
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatType: 'loop'
        }}
      />
    </div>
  )
}
