import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
function MovingBanner({ texts }) {
  const xTranslate = useMotionValue(0)
  const [totalWidth, setTotalWidth] = useState(0)
  const containerRef = useRef(null)
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.scrollWidth / 2
      console.log(containerWidth)
      setTotalWidth(containerWidth)
      let controls
      controls = animate(xTranslate, [-containerWidth, 0], {
        ease: 'linear',
        duration: containerWidth / 100,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0
      })
      return controls.stop
    }
  }, [xTranslate])

  return (
    <motion.div
      className='flex gap-4 py-4 absolute bg-textPrimary font-tertiary font-extrabold text-3xl width: max-content text-white'
      ref={containerRef}
      style={{ x: xTranslate }}
    >
      {[...texts, ...texts].map((item, i) => (
        <p key={i} className='whitespace-nowrap'>
          {item}
        </p>
      ))}
    </motion.div>
  )
}

export default MovingBanner
