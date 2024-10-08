import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

export default function InfiniteScrollText({
  text,
  direction = 'left',
  speed = 50
}) {
  const containerRef = useRef()
  const textRef = useRef()
  const [contentWidth, setContentWidth] = useState(0)

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return

    const container = containerRef.current
    const textElement = textRef.current

    // Set initial content width
    setContentWidth(textElement.offsetWidth)

    // Create enough copies to fill the container width
    const copiesNeeded =
      Math.ceil(container.offsetWidth / textElement.offsetWidth) + 1
    for (let i = 0; i < copiesNeeded; i++) {
      container.appendChild(textElement.cloneNode(true))
    }

    // Set up GSAP animation
    gsap.to(container, {
      x: direction === 'left' ? -contentWidth : contentWidth,
      ease: 'none',
      repeat: -1,
      duration: contentWidth / speed,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % contentWidth)
      }
    })

    // Resize handler
    const handleResize = () => {
      gsap.killTweensOf(container)
      container.innerHTML = ''
      container.appendChild(textElement)
      setContentWidth(textElement.offsetWidth)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup function
    return () => {
      gsap.killTweensOf(container)
      window.removeEventListener('resize', handleResize)
    }
  }, [text, direction, speed, contentWidth])

  return (
    <div
      className='w-full overflow-hidden'
      aria-live='polite'
      aria-atomic='true'
    >
      <div
        ref={containerRef}
        className='inline-block whitespace-nowrap bg-textPrimary font-tertiary font-extrabold text-3xl width: max-content text-white'
      >
        <div ref={textRef} className='inline-block px-4  '>
          {text}
        </div>
      </div>
    </div>
  )
}
// className =
//   'flex gap-4 py-4 absolute bg-textPrimary font-tertiary font-extrabold text-3xl width: max-content text-white'
