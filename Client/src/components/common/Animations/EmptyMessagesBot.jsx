import { motion } from 'framer-motion'
import { Bot, MessageCircle } from 'lucide-react'
import { SiGooglegemini } from 'react-icons/si'

export default function AnimatedIconsEmptyMessagesBot() {
  const botVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
        rotate: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
      }
    }
  }

  const particleVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 10,
        ease: 'linear'
      }
    }
  }

  const floatingParticles = [
    {
      className: 'absolute top-0 left-1/4',
      size: 'w-4 h-4',
      color: 'text-blue-500',
      animate: {
        y: [0, -20, 0],
        x: [0, 10, 0],
        scale: [1, 1.3, 1],
        opacity: [0.7, 1, 0.7]
      },
      transition: { duration: 3, delay: 0.5 }
    },
    {
      className: 'absolute bottom-0 right-0',
      size: 'w-6 h-6',
      color: 'text-purple-500',
      animate: {
        y: [0, -15, 0],
        x: [0, -10, 0],
        scale: [1, 1.4, 1],
        opacity: [0.5, 1, 0.5]
      },
      transition: { duration: 3.5, delay: 0.2 }
    },
    {
      className: 'absolute top-1/4 right-0',
      size: 'w-3 h-3',
      color: 'text-pink-500',
      animate: {
        y: [0, 20, 0],
        x: [0, -15, 0],
        scale: [1, 1.5, 1],
        opacity: [0.6, 1, 0.6]
      },
      transition: { duration: 4, delay: 0.7 }
    }
  ]

  return (
    <div className='flex flex-col items-center justify-center h-full w-full'>
      <div className='relative w-48 h-48'>
        <motion.div
          className='absolute inset-0 flex items-center justify-center'
          variants={botVariants}
          animate='animate'
        >
          <Bot size={110} className='text-customColorTertiary' />
        </motion.div>

        {floatingParticles.map((particle, index) => (
          <motion.div
            key={index}
            className={particle.className}
            animate={particle.animate}
            transition={{
              ...particle.transition,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
          >
            <motion.div variants={particleVariants} animate='animate'>
              <SiGooglegemini
                className={`${particle.size} ${particle.color}`}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className='mt-8 flex items-center space-x-2 text-gray-700'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <MessageCircle size={24} />
        <p className='text-lg font-semibold'>
          No messages yet. Start chatting!
        </p>
      </motion.div>
    </div>
  )
}
