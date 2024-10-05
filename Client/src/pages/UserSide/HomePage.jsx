import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  MovingProductsSection,
  BannerSection
} from '../../components/layout/UserSide/Home/HomePageComponents'

function HomePage() {
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
  return (
    <>
      <div className='min-h-screen bg-white'>
        {/* Hero Section */}
        <section className='py-12 lg:py-24 pb-52 bg-customColorSecondary'>
          <div className='container mx-auto px-6'>
            <div className='flex flex-col lg:flex-row items-center'>
              <div className='lg:w-1/2 lg:pr-12 mb-8 lg:mb-0'>
                <h1 className='text-5xl lg:text-6xl text-textPrimary font-bold mb-4 spacing tracking-tight font-secondary '>
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
        {/* <section>
          <MovingBanner
            texts={[
              'Exclusive Art Pieces',
              'Discover Original Paintings',
              'Curated Collections'
            ]}
          />
        </section> */}
        <section className=''>
          <div className='bg-gradient-to-b from-customColorSecondary to-customColorTertiarypop'></div>
          {/* <MovingProductsSection />  */}
          {/* <div className='bg-gradient-to-b h-20 from-[#C9BDF4] to-customColorSecondary'></div> */}
        </section>
        {/* Featured Artworks */}
        <section>
          <BannerSection />
        </section>
        <section className='py-16 bg-customColorSecondary'>
          {/* <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold mb-8 text-center text-gray-900'>
              Featured Artworks
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
              {[1, 2, 3, 4, 5, 6].map(item => (
                <div key={item} className='group'>
                  <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8'>
                    <img
                      src={`/placeholder.svg?height=500&width=500&text=Artwork ${item}`}
                      alt={`Artwork ${item}`}
                      className='h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300'
                    />
                  </div>
                  <h3 className='mt-4 text-sm text-gray-700'>
                    Artwork Title {item}
                  </h3>
                  <p className='mt-1 text-lg font-medium text-gray-900'>
                    $149.99
                  </p>
                </div>
              ))}
            </div>
          </div> */}
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
