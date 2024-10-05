import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Logo = () => {
  const SelectedLogo = [style1, style2, style3, style4][
    Math.floor(Math.random() * 3)
  ]

  return <SelectedLogo />
}

export default Logo

const style1 = () => {
  const letters = 'Frame Up'.split('')
  return (
    <motion.div
      className='relative inline-block '
      whileHover='hover'
      whileTap={{ scale: 0.85 }}
    >
      <Link to={'/'}>
        <span className='sr-only'>Frame Up</span>
        <div className='relative'>
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              className={`font-secondary font-semibold text-3xl ${letter === ' ' ? 'mr-2' : ''}`}
              style={{
                display: 'inline-block',
                position: 'relative',
                zIndex: 10
              }}
              variants={{
                hover: {
                  y: [0, -10, 0],
                  color: [
                    '#C3A54F',
                    '#4B4995',
                    '#FF7D22',
                    '#192205',
                    '#3366ff',
                    '#151F45'
                  ],
                  scale: [1, 1.1, 1.2, 1.1, 0.9],
                  transition: {
                    y: {
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 0.5,
                      delay: index * 0.05
                    },
                    color: {
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 2,
                      delay: index * 0.1
                    },
                    scale: {
                      duration: 1,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }
                  }
                }
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <motion.div
          className='absolute inset-0 bg-gradient-to-r from-orange-300 via-purple-500 to-blue-400 opacity-0 rounded-lg filter blur-md'
          variants={{
            hover: {
              opacity: 0.3,
              scale: 1.05,
              rotate: [0, 5, -5, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }
            }
          }}
        />
      </Link>
    </motion.div>
  )
}
const style2 = () => {
  const letters = 'Frame Up'.split('')
  const DURATION = 0.25
  const STAGGER = 0.025

  return (
    <motion.div
      initial='initial'
      whileHover='hovered'
      exit='exit'
      whileTap={{ scale: 0.95 }}
      className='relative block overflow-hidden whitespace-nowrap'
    >
      <Link to={'/'}>
        <div>
          {letters.map((letter, index) => (
            <motion.span
              className={`font-secondary font-semibold text-3xl ${letter === ' ' ? 'mr-2' : ''}`}
              style={{
                display: 'inline-block'
              }}
              variants={{
                initial: {
                  y: 0,
                  opacity: [0.7, 0.5, 0.8, 1]
                },
                hovered: {
                  y: '-100%',
                  transition: {
                    type: 'spring',
                    stiffness: 200,
                    damping: 25,
                    duration: DURATION,
                    ease: 'easeInOut',
                    delay: STAGGER * index
                  }
                },
                opacity: {
                  duration: 0.5,
                  ease: 'easeInOut',
                  delay: STAGGER * index
                },
                exit: {
                  y: '0%',
                  transition: {
                    type: 'spring',
                    stiffness: 60,
                    damping: 12,
                    duration: DURATION * 2,
                    delay: STAGGER * index
                  }
                }
              }}
              key={index}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <div className='absolute  '>
          {letters.map((letter, index) => (
            <motion.span
              className={`font-secondary font-semibold  text-3xl ${letter === ' ' ? 'mr-2' : ''}`}
              style={{
                display: 'inline-block'
              }}
              variants={{
                initial: {
                  y: 0,
                  opacity: [0.7, 0.5, 0.8, 1]
                },
                hovered: {
                  y: '-100%',
                  transition: {
                    type: 'spring',
                    stiffness: 100,
                    damping: 8,
                    duration: DURATION,
                    ease: 'easeInOut',
                    delay: STAGGER * index
                  },
                  opacity: {
                    duration: 0.5,
                    ease: 'easeInOut',
                    delay: STAGGER * index
                  },
                  exit: {
                    y: '0%',
                    transition: {
                      type: 'spring',
                      stiffness: 200,
                      damping: 25,
                      duration: DURATION * 2,
                      delay: STAGGER * index
                    }
                  }
                }
              }}
              key={index}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </Link>
    </motion.div>
  )
}

const style3 = () => {
  const letters = 'Frame Up'.split('')
  // const DURATION = 0.25
  const STAGGER = 0.1
  return (
    <motion.div
      initial='initial'
      whileHover='hovered'
      className='overflow-hidden relative px-1'
    >
      <Link to={'/'} className='felx overflow-hidden'>
        <motion.div
          variants={{
            initial: {
              x: 0,
              y: 0
            },
            hovered: {
              initial: {
                x: '0%',
                y: 0
              },
              x: ['0%', '110%'],
              opacity: [1, 1],
              transition: {
                delay: 0.2
              }
            }
          }}
        >
          {letters.map((letter, i) => (
            <motion.span
              className={`font-secondary font-semibold text-3xl inline-block ${letter === ' ' ? 'mr-2' : ''}`}
              key={i}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
        <motion.div
          className='absolute top-0 left-0'
          variants={{
            initial: {
              x: '-100%',
              y: 0
            },
            hovered: {
              x: ['-100%', '-100%', '0%', '20%', '0%'],
              transition: {
                delay: 0.2,
                duration: 0.6
              }
            }
          }}
        >
          {letters.map((letter, i) => (
            <motion.span
              className={`font-secondary font-semibold text-3xl inline-block ${letter === ' ' ? 'mr-2' : ''}`}
              key={i}
              variants={{
                hovered: {
                  y: [0, -10, 0],
                  transition: {
                    duration: 0.5,
                    ease: 'easeInOut',
                    delay: STAGGER * i
                  }
                }
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </Link>
    </motion.div>
  )
}
const style4 = () => {
  const text = 'Frame Up'
  const words = Array(3).fill(text)

  const containerVariants = {
    animate: {
      x: ['-100%', 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 6,
          ease: 'linear'
        }
      }
    }
  }

  const wordVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 2,
          ease: 'easeInOut'
        }
      }
    }
  }

  return (
    <Link to='/' className='block overflow-hidden w-full'>
      <div className='relative w-full h-12 overflow-hidden'>
        <motion.div
          className='flex whitespace-nowrap'
          variants={containerVariants}
          animate='animate'
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              className='inline-block w-full text-center'
              variants={wordVariants}
              animate='animate'
            >
              <span className='font-secondary font-semibold text-3xl'>
                {word}
              </span>
            </motion.span>
          ))}
        </motion.div>
      </div>
    </Link>
  )
}
