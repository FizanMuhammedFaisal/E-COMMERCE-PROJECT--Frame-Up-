import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import MovingBanner from '../../components/common/Animations/MovingBanner'
import {
  MovingProductsSection,
  BannerSection,
  AnimatedCarousalSection,
  FeaturedArtSection
} from '../../components/layout/UserSide/Home/HomePageComponents'
import Sample from '../../components/common/Animations/Sample'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import ChatButton from '../../components/common/Animations/ChatButton'
import ChatComponent from '../../components/layout/UserSide/Products/ChatComponent'
function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }
  const navigate = useNavigate()

  // const handleLogout = () => {
  //   localStorage.removeItem('accessToken')
  //   dispatch(logoutUser())
  //   console.log('logged out')
  //   navigate('/login')
  // }

  const handleBrowse = () => {
    navigate('/all')
  }
  const artworks = [
    {
      id: 1,
      title: 'Ethereal Dreams',
      artist: 'Luna Starlight',
      price: 2200,
      image:
        'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0fGVufDB8fDB8fHww',
      description:
        'A mesmerizing blend of colors that evoke a dreamlike state, capturing the essence of the subconscious mind.'
    },
    {
      id: 2,
      title: 'Cosmic Harmony',
      artist: 'Zephyr Breeze',
      price: 1800,
      image:
        'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXJ0fGVufDB8fDB8fHww',
      description:
        "An abstract representation of the universe's intricate balance, showcasing the interconnectedness of celestial bodies."
    },
    {
      id: 3,
      title: 'Whispers of Nature',
      artist: 'Willow Rayne',
      price: 2500,
      image:
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFydHxlbnwwfHwwfHx8MA%3D%3D',
      description:
        'A serene landscape that captures the subtle beauty of nature, inviting viewers to listen to the quiet whispers of the earth.'
    },
    {
      id: 4,
      title: 'Urban Rhythms',
      artist: 'Jasper Stone',
      price: 1950,
      image:
        'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFydHxlbnwwfHwwfHx8MA%3D%3D',
      description:
        'A dynamic piece that pulses with the energy of city life, capturing the vibrant patterns and movements of urban environments.'
    },
    {
      id: 5,
      title: 'Celestial Dance',
      artist: 'Aurora Skye',
      price: 2800,
      image:
        'https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGFydHxlbnwwfHwwfHx8MA%3D%3D',
      description:
        'An ethereal portrayal of the northern lights, capturing the magical dance of colors across the night sky.'
    },
    {
      id: 6,
      title: 'Echoes of Serenity',
      artist: 'River Moss',
      price: 2100,
      image:
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFydHxlbnwwfHwwfHx8MA%3D%3D',
      description:
        'A tranquil scene that resonates with inner peace, inviting viewers to find their own moments of serenity within the artwork.'
    }
  ]
  const [hoveredId, setHoveredId] = useState(null)
  return (
    <>
      <div className='min-h-screen bg-white'>
        {/* Hero Section */}
        <section className='py-12 lg:py-24 pb-52 bg-customColorSecondary'>
          <div className='container mx-auto px-6'>
            <div className='flex flex-col lg:flex-row items-center'>
              <div className='lg:w-1/2 lg:pr-12 mb-8 lg:mb-0'>
                <h1 className='text-5xl lg:text-6xl text-textPrimary font-semibold mb-4 spacing tracking-tight font-secondary '>
                  Discover Original Art
                </h1>

                <p className='text-xl mb-8 font-primary'>
                  Shop one-of-a-kind pieces from artists around the world
                </p>

                <motion.button
                  onClick={handleBrowse}
                  whileHover={{ scale: 1.09 }}
                  className='bg-customColorTertiary text-white  border-transparent hover:border-customColorTertiary border-2 px-3 py-2 font-primary  hover:bg-customColorTertiaryLight font-bold  duration-300'
                >
                  Shop Now
                </motion.button>
              </div>
              <div className='relative lg:w-1/2 mt-4'>
                <img
                  src='/assets/images/Homepage Hero Aug 24.webp' // Update the path if needed
                  alt='Featured Artwork'
                  className='relative rounded-lg shadow-lg w-full h-auto'
                />
              </div>
            </div>
          </div>
        </section>
        <section>
          {/* <MovingBanner texts={' Exclusive Art Pieces'} /> */}
        </section>
        <section className=''>
          {/* <Sample text={'heymsadf sdfasdfa sadfasf asdsdf'} /> */}
        </section>

        <section> {/* <BannerSection />{' '} */}</section>

        <section>
          <FeaturedArtSection />
        </section>
        <section>
          <AnimatedCarousalSection />
        </section>
        <section>
          <ChatButton toggleChat={toggleChat} />
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
                className='fixed bottom-4 right-4 z-50'
              >
                <div className='relative'>
                  <ChatComponent toggleChat={toggleChat} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
