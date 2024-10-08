import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import { CircularProgress } from '@mui/material'

gsap.registerPlugin(ScrollTrigger, Draggable)

const ArtworkCard = ({ product, isActive }) => (
  <div
    className={`flex-shrink-0 mt-9 w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[35vw] mx-10 flex flex-col items-center transition-all duration-300 ${isActive ? 'scale-105 z-10' : 'scale-95 text-opacity-90'}`}
  >
    <div className='relative overflow-hidden rounded-sm w-full h-[50vh] sm:h-[60vh] md:h-[60vh] lg:h-[50vh]'>
      <img
        src={product.image}
        alt={product.title}
        className='w-full h-full object-cover object-center transform transition-transform duration-300 hover:scale-110'
      />
    </div>
    <div className='mt-6 bg-gray-800 bg-opacity-75 p-6 rounded-lg w-full max-w-2xl'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h2 className='text-2xl font-bold'>{product.title}</h2>
          <p className='text-lg text-gray-300'>by {product.artist}</p>
        </div>
        <p className='text-xl font-bold'>${product.price}</p>
      </div>
      <p className='text-gray-300 mb-4'>{product.description}</p>
      <button className='w-full bg-white text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-colors duration-300'>
        View Artwork
      </button>
    </div>
  </div>
)

const ExploreGalleryCard = ({ isActive }) => (
  <div
    className={`flex-shrink-0 w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] mx-4 flex items-center justify-center transition-all duration-300 ${isActive ? 'scale-105 z-10' : 'scale-95 opacity-50'}`}
  >
    <div className='bg-gray-800 bg-opacity-75 p-8 rounded-lg text-center w-full max-w-2xl'>
      <h2 className='text-3xl font-bold mb-4'>Explore Full Gallery</h2>
      <p className='text-xl mb-6'>
        Discover more mesmerizing artworks in our complete collection.
      </p>
      <button className='w-full bg-white text-gray-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-opacity-90 transition-colors duration-300'>
        View All Artworks
      </button>
    </div>
  </div>
)

export default function ArtisticCarousel({ products, loading, isError }) {
  const carouselRef = useRef(null)
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!carouselRef.current || !carouselRef.current.children.length) return
    const carousel = carouselRef.current
    const container = containerRef.current
    const cards = carousel.children
    const cardWidth = cards[0].offsetWidth
    const totalWidth = cardWidth * cards.length

    gsap.to(carousel, {
      x: () => -(totalWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: self => {
          const newIndex = Math.round(self.progress * products.length)
          setActiveIndex(newIndex)
        }
      }
    })

    const draggable = Draggable.create(carousel, {
      type: 'x',
      edgeResistance: 0.65,
      bounds: container,
      inertia: true,
      onDrag: function () {
        ScrollTrigger.update()
      }
    })[0]

    const updateOnResize = () => {
      ScrollTrigger.refresh()
      draggable.update()
    }

    window.addEventListener('resize', updateOnResize)

    return () => {
      window.removeEventListener('resize', updateOnResize)
      ScrollTrigger.getAll().forEach(t => t.kill())
      draggable.kill()
    }
  }, [products, loading, isError])

  return (
    <div className='min-h-screen bg-gradient-to-r from-customColorTertiary to-customColorTertiaryDark text-white overflow-hidden'>
      {loading && (
        <div className='flex justify-center items-center h-screen'>
          <CircularProgress size={25} color='inherit' />
        </div>
      )}

      {!loading && (!products || products.length === 0) && (
        <div className='flex justify-center items-center h-screen'>
          <p className='text-xl'>No products available.</p>
        </div>
      )}

      {!loading && products && products.length > 0 && (
        <div>
          <header className='pt-16 px-8 text-center'>
            <h1 className='text-5xl font-bold mb-4'>Artistic Odyssey</h1>
            <p className='text-xl max-w-2xl mx-auto opacity-75'>
              Embark on a visual journey through our curated collection of
              mesmerizing artworks. Scroll horizontally to explore the boundless
              realms of creativity.
            </p>
          </header>

          <div ref={containerRef} className='h-screen relative overflow-hidden'>
            <div
              ref={carouselRef}
              className='flex absolute left-0 top-1/2 -translate-y-1/2 touch-pan-x'
            >
              {products.map((product, index) => (
                <ArtworkCard
                  key={product.id}
                  product={product}
                  isActive={index === activeIndex}
                />
              ))}
              <ExploreGalleryCard isActive={activeIndex === products.length} />
            </div>
          </div>
        </div>
      )}

      {isError && (
        <div className='flex justify-center items-center h-screen'>
          <p className='text-red-500 text-2xl font-semibold'>
            Failed to load products.
          </p>
        </div>
      )}
    </div>
  )
}
