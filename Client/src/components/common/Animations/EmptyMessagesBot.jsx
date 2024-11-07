'use client'

import { motion } from 'framer-motion'
import { Bot, MessageCircle } from 'lucide-react'
import { SiGooglegemini } from 'react-icons/si'

export default function AnimatedIconsEmptyMessagesBot() {
  const containerVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    }
  }

  const eyeVariants = {
    animate: {
      x: [-1, 1, -1],
      y: [-1, 1, -1],
      transition: {
        x: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
        y: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
      }
    }
  }

  const antennaVariants = {
    animate: {
      rotateZ: [-5, 5, -5],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut'
      }
    }
  }

  const iconVariants = {
    rotate: {
      rotate: [0, 360],
      transition: {
        repeat: Infinity,
        duration: 10,
        ease: 'linear'
      }
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <div className='relative w-48 h-48'>
        <motion.div
          className='absolute inset-0 flex items-center justify-center'
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Bot size={110} className='text-primary text-customColorTertiary' />
        </motion.div>
        {/* Floating elements */}
        <motion.div
          className='absolute top-0 left-1/4'
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
        >
          <motion.div variants={iconVariants} animate='rotate'>
            <SiGooglegemini className='w-4 h-4 text-blue-500' />
          </motion.div>
        </motion.div>
        <motion.div
          className='absolute bottom-0 right-0'
          animate={{
            y: [0, -15, 0],
            x: [0, -10, 0],
            scale: [1, 1.4, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2
          }}
        >
          <motion.div variants={iconVariants} animate='rotate'>
            <SiGooglegemini className='w-6 h-6 text-purple-500' />
          </motion.div>
        </motion.div>
        <motion.div
          className='absolute top-1/4 right-0'
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.7
          }}
        >
          <motion.div variants={iconVariants} animate='rotate'>
            <SiGooglegemini className='w-3 h-3 text-pink-500' />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className='mt-8 flex items-center space-x-2 text-gray-700'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <MessageCircle size={24} />
        <p className='text-xl font-semibold'>
          No messages yet. Start chatting!
        </p>
      </motion.div>
    </div>
  )
}
