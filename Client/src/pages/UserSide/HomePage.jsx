import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import MovingBanner from '../../components/common/Animations/MovingBanner'
import {
  AnimatedCarousalSection,
  FeaturedArtSection,
  ArtistsComponent,
  SomeArtPieces
} from '../../components/layout/UserSide/Home/HomePageComponents'
import Sample from '../../components/common/Animations/Sample'
import { useState } from 'react'

function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }
  const navigate = useNavigate()

  const [hoveredId, setHoveredId] = useState(null)
  return (
    <>
      <div className='min-h-screen bg-white'>
        {/* Hero Section */}
        <section className='py-12 lg:py-24 pb-52 bg-customColorSecondary'>
          <SomeArtPieces />
        </section>
        <section className=''>
          {/* <Sample text={'Fizan Muhammed Faisal , how is that'} /> */}
        </section>

        <section>
          <FeaturedArtSection />
        </section>
        <section>
          <ArtistsComponent />
        </section>
        <section>
          <AnimatedCarousalSection />
        </section>

        {/* Call to Action */}
        <section className='py-16 bg-primary text-primary-foreground'>
          <div className='container mx-auto px-4 text-center'>
            <h2 className='text-3xl font-bold mb-4'>
              Ready to Transform Your Space?
            </h2>
            <p className='mb-8 text-lg'>
              Explore our curated collection and find the perfect piece for your
              home or office.
            </p>
            <button
              className='bg-customColorTertiary px-3 py-2 text-white hover:opacity-90 duration-300 rounded-md  '
              onClick={() => {
                navigate('/all')
              }}
            >
              View All Artworks
            </button>
          </div>
        </section>
      </div>
    </>
  )
}

export default HomePage
