'use client'

import { useState, useRef, useEffect } from 'react'
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform
} from 'framer-motion'
import { SiGooglegemini } from 'react-icons/si'

export default function ChatButton({ toggleChat }) {
  const buttonRef = useRef()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const glowX = useTransform(mouseX, [-100, 100], [-30, 30])
  const glowY = useTransform(mouseY, [-100, 100], [-30, 30])

  const handleMouseMove = event => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      mouseX.set(x - rect.width / 2)
      mouseY.set(y - rect.height / 2)
    }
  }

  const pulseAnimation = useAnimation()

  useEffect(() => {
    pulseAnimation.start({
      scale: [1, 1.05, 1],
      opacity: [0.7, 0.8, 0.7],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
    })
  }, [pulseAnimation])

  return (
    <div className='relative md:w-flex w-full h-12'>
      <motion.div
        className='absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-80 blur-xl'
        animate={pulseAnimation}
      />
      <motion.button
        ref={buttonRef}
        onClick={toggleChat}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setIsPressed(false)
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className='relative w-full h-full bg-opacity-40 px-3 overflow-hidden rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center'
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        animate={isPressed ? { scale: 0.98 } : {}}
      >
        <motion.div
          className='absolute inset-0 bg-white opacity-0 blur-md transition-opacity duration-300 rounded-full'
          style={{ x: glowX, y: glowY }}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
        />
        <motion.div
          className='absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 transition-opacity duration-300'
          animate={{ opacity: isHovered ? 0.3 : 0 }}
        />
        <motion.div
          className='relative z-10 mr-2'
          animate={{
            rotate: isHovered ? [0, 360] : 0
          }}
          transition={{
            duration: 3,
            repeat: isHovered ? Infinity : 0,
            ease: 'linear'
          }}
        >
          <motion.div
            className='w-10 h-10 flex items-center justify-center'
            animate={{
              scale: isHovered ? [1, 1.2, 1] : 1
            }}
            transition={{
              duration: 0.9,
              repeat: isHovered ? Infinity : 0,
              ease: 'easeInOut'
            }}
          >
            <SiGooglegemini className='w-7 h-7' />
          </motion.div>
        </motion.div>
        <span className='relative z-10 whitespace-nowrap '>
          Chat About Painting
        </span>
        {/* <motion.div
          className='absolute bottom-0 left-0 right-0 h-1 bg-white'
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        /> */}
      </motion.button>
    </div>
  )
}
