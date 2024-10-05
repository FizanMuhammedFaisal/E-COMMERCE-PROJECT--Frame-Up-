// import React, { useState, useMemo, useRef, useCallback } from 'react'
// import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
// import { useNavigate } from 'react-router-dom'

// const Card = React.memo(({ image, title, id }) => {
//   const navigate = useNavigate()
//   const [isLoaded, setIsLoaded] = useState(false)

//   const handleClick = useCallback(() => {
//     navigate(`/products/${id}`)
//   }, [navigate, id])

//   const handleImageLoad = useCallback(() => {
//     setIsLoaded(true)
//   }, [])

//   return (
//     <div
//       onClick={handleClick}
//       className='relative h-80 w-80 rounded-lg overflow-hidden bg-neutral-200 shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer'
//     >
//       {!isLoaded && (
//         <div className='absolute inset-0 bg-gray-300 animate-pulse' />
//       )}
//       <img
//         src={image}
//         alt={title}
//         className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ${
//           isLoaded ? 'opacity-100' : 'opacity-0'
//         }`}
//         onLoad={handleImageLoad}
//         loading='lazy'
//       />
//       <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
//         <p className='text-white text-lg font-semibold truncate'>{title}</p>
//       </div>
//     </div>
//   )
// })

// Card.displayName = 'Card'

// function ImageCarouselSection({ cards1, cards2 }) {
//   const targetRef = useRef()
//   const { scrollYProgress } = useScroll({
//     target: targetRef,
//     offset: ['start end', 'end start']
//   })

//   // Apply spring to scrollYProgress for smoother motion
//   const smoothScrollYProgress = useSpring(scrollYProgress, {
//     stiffness: 60, // Adjust stiffness and damping for control
//     damping: 20
//   })

//   // Use the smoother progress value for the transform
//   const x = useTransform(smoothScrollYProgress, [0, 1], ['55%', '-66%'], {
//     clamp: false
//   })

//   const renderCard = useCallback(
//     ({ id, image, title }) => (
//       <Card key={id} id={id} image={image} title={title} />
//     ),
//     []
//   )

//   const memoizedCards1 = useMemo(
//     () => cards1?.map(renderCard),
//     [cards1, renderCard]
//   )
//   const memoizedCards2 = useMemo(
//     () => cards2?.map(renderCard),
//     [cards2, renderCard]
//   )

//   return (
//     <section ref={targetRef} className='relative h-[1000vh] bg-black'>
//       <div className='sticky flex flex-col gap-5 pt-9 justify-center items-center overflow-hidden top-0 h-screen bg-[#C9BDF4]'>
//         <motion.h1
//           whileInView={{ scale: [1.2, 1], opacity: [0, 1] }}
//           transition={{ duration: 0.5, ease: 'easeInOut' }}
//           className=' text-5xl pt-7 text-center font-extrabold text-textPrimary font-primary '
//         >
//           BROWSE PRODUCTS
//         </motion.h1>
//         <motion.div style={{ x }} className='flex mt-10 gap-3'>
//           {memoizedCards1}
//         </motion.div>
//         <motion.div style={{ x }} className='flex gap-3'>
//           {memoizedCards2}
//         </motion.div>
//       </div>
//     </section>
//   )
// }

// export default ImageCarouselSection

// se cond one
///

import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const Card = React.memo(({ image, title, id, onClick }) => (
  <div
    onClick={onClick}
    className='relative h-80 w-80 rounded-lg overflow-hidden bg-neutral-200 shadow-md cursor-pointer '
  >
    <img
      alt={title}
      className='absolute inset-0 w-full h-full object-cover'
      loading='lazy'
    />
    <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
      <p className='text-white text-lg font-semibold truncate'>{title}</p>
    </div>
  </div>
))

Card.displayName = 'Card'
const useGSAP = ({ isLoading, sectionRef, row1Ref, row2Ref }) => {
  useEffect(() => {
    if (isLoading) return // Don't run animations until loading completes

    const section = sectionRef.current
    const row1 = row1Ref.current
    const row2 = row2Ref.current

    // GSAP timeline for ScrollTrigger animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=6000',
        scrub: true,
        pin: true
      }
    })

    // Animation for first row
    tl.to(row1, {
      xPercent: -110, // Move row1 110% to the left
      ease: 'none'
    })

    // Animation for second row
    tl.to(
      row2,
      {
        xPercent: -100, // Move row2 100% to the left
        ease: 'none'
      },
      0 // Start the second row animation at the same time as the first
    )

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [isLoading]) // Re-run the effect when `isLoading` changes
}

export default function ImageCarouselSection({ cards1, cards2, isLoading }) {
  const sectionRef = useRef(null)
  const row1Ref = useRef(null)
  const row2Ref = useRef(null)
  const navigate = useNavigate()
  useGSAP({ isLoading, sectionRef, row1Ref, row2Ref })

  const handleClick = id => {
    navigate(`/products/${id}`)
  }
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900'></div>
      </div>
    )
  }

  return (
    <section
      ref={sectionRef}
      className='relative bg-gradient-to-b from-[#C9BDF4] to-white overflow-hidden'
    >
      <div className='sticky top-0 h-screen overflow-hidden'>
        <motion.h1
          whileInView={{
            scale: [1.1, 1],
            opacity: [0, 1],
            transition: {
              duration: 0.5
            }
          }}
          className='text-6xl pt-32 font-extrabold text-textPrimary font-primary text-center py-10'
        >
          BROWSE PRODUCTS
        </motion.h1>

        <div
          ref={row1Ref}
          className='flex gap-6 mb-10'
          style={{ width: 'max-content', paddingLeft: '100%' }}
        >
          {cards1.map(card => (
            <Card
              key={card.id}
              {...card}
              onClick={() => {
                handleClick(card.id)
              }}
            />
          ))}
        </div>

        <div
          ref={row2Ref}
          className='flex gap-6 mb-10'
          style={{ width: 'max-content', paddingLeft: '100%' }}
        >
          {cards2.map(card => (
            <Card
              key={card.id}
              {...card}
              onClick={() => {
                handleClick(card.id)
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
