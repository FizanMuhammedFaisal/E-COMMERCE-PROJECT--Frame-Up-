import { useQuery } from '@tanstack/react-query'
import ImageCarouselSection from '../../../common/Animations/ImageCarouselSection'
import api from '../../../../services/api/api'
import { useEffect, useState } from 'react'
import AnimatedCarousal from '../../../common/Animations/AnimatedCarousal'
const MovingProductsSection = () => {
  const [products, setProducts] = useState({ cards1: [], cards2: [] })

  const fetchProducts = async () => {
    const res = await api.get('/products/get-cards')
    console.log(res)
    return res.data
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['productCards'],
    queryFn: fetchProducts
  })

  useEffect(() => {
    if (data?.Products) {
      const [cards1, cards2] = data.Products.reduce(
        (acc, curr, index) => {
          acc[index % 2].push(curr)
          return acc
        },
        [[], []]
      )
      setProducts({ cards1, cards2 })
    }
  }, [data])

  if (isError) {
    return <p className='text-red-500'>Failed to load products.</p>
  }

  return (
    <>
      <ImageCarouselSection
        cards1={products.cards1}
        isLoading={isLoading}
        cards2={products.cards2}
      />
    </>
  )
}

import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

const Banner = ({ title, description, image }) => (
  <div className='relative overflow-hidden rounded-lg shadow-md group'>
    <img
      src={image}
      alt={title}
      className='w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110'
    />
    <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 text-white'>
      <h3 className='text-xl font-bold mb-1'>{title}</h3>
      <p className='text-sm'>{description}</p>
    </div>
  </div>
)

function BannerSection() {
  return (
    <section className='py-16 bg-gradient-to-b from-[e6e3d8] to-customColorSecondary'>
      <div className='container mx-auto px-4'>
        <div className='relative mb-12'>
          <div
            className='absolute inset-0 flex items-center'
            aria-hidden='true'
          >
            <div className='w-full border-t border-gray-300'></div>
          </div>
          <div className='relative flex justify-center'>
            <span className='bg-gray-100 px-3 text-lg font-semibold text-gray-900'>
              Typography Showcase
            </span>
          </div>
        </div>

        <h2 className='text-5xl font-extrabold text-center mb-8 text-gray-900 leading-tight'>
          Crafting Visual <span className='text-indigo-600'>Harmony</span>{' '}
          Through Type
        </h2>

        <p className='text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed'>
          Typography is the art and technique of arranging type to make written
          language legible, readable, and appealing when displayed. Good
          typography enhances the character of the website and reinforces the
          site's hierarchical structure.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
          <Banner
            title='Serif Elegance'
            description='Timeless and sophisticated type designs'
            image='/placeholder.svg?height=300&width=400'
          />
          <Banner
            title='Sans-Serif Simplicity'
            description='Clean and modern typographic approaches'
            image='/placeholder.svg?height=300&width=400'
          />
          <Banner
            title='Custom Letterforms'
            description='Unique type designs for brand identity'
            image='/placeholder.svg?height=300&width=400'
          />
        </div>

        <div className='relative'>
          <div
            className='absolute inset-0 flex items-center'
            aria-hidden='true'
          >
            <div className='w-full border-t border-gray-300'></div>
          </div>
          <div className='relative flex justify-center'>
            <span className='bg-gray-100 px-3 text-lg font-semibold text-gray-900'>
              Type Specimens
            </span>
          </div>
        </div>

        <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-2xl font-bold mb-4 text-gray-900'>
              Heading Styles
            </h3>
            <h1 className='text-4xl font-bold mb-2'>H1: Main Heading</h1>
            <h2 className='text-3xl font-semibold mb-2'>H2: Subheading</h2>
            <h3 className='text-2xl font-medium mb-2'>H3: Section Title</h3>
            <h4 className='text-xl font-medium mb-2'>H4: Subsection Title</h4>
            <h5 className='text-lg font-medium mb-2'>H5: Minor Heading</h5>
            <h6 className='text-base font-medium'>H6: Small Heading</h6>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-2xl font-bold mb-4 text-gray-900'>Body Text</h3>
            <p className='mb-4 leading-relaxed'>
              This is a paragraph of body text. It demonstrates the default font
              size, line height, and spacing for content. Good typography in
              body text ensures readability and comfort for the user, especially
              during extended reading sessions.
            </p>
            <p className='mb-4 leading-relaxed'>
              Another paragraph to show consistency. Notice how the spacing
              between paragraphs creates a pleasant rhythm and helps to separate
              distinct thoughts or sections within the content.
            </p>
            <ul className='list-disc list-inside mb-4'>
              <li>First item in an unordered list</li>
              <li>Second item showing list styling</li>
              <li>Third item to demonstrate spacing</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
const AnimatedCarousalSection = () => {
  const [products, setProducts] = useState()

  const fetchProducts = async () => {
    const res = await api.get('/products/get-cards')
    console.log(res)
    return res.data
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['productCards'],
    queryFn: fetchProducts,
    staleTime: 10 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  useEffect(() => {
    if (data?.Products && Array.isArray(data.Products)) {
      setProducts(data.Products)
    } else {
      setProducts([])
    }
  }, [data])

  if (isError) {
    return <p className='text-red-500'>Failed to load products.</p>
  }
  console.log(products)

  return (
    <AnimatedCarousal
      products={products}
      loading={isLoading}
      isError={isError}
    />
  )
}

const FeaturedArtSection = () => {
  const navigate = useNavigate()
  const artworks = [
    {
      id: 1,
      title: 'Ethereal Dreams',
      artist: 'Luna Starlight',
      price: '$2,200',
      image:
        'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0fGVufDB8fDB8fHww'
    },
    {
      id: 2,
      title: 'Cosmic Harmony',
      artist: 'Zephyr Breeze',
      price: '$1,800',
      image:
        'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXJ0fGVufDB8fDB8fHww'
    },
    {
      id: 3,
      title: 'Whispers of Nature',
      artist: 'Willow Rayne',
      price: '$2,500',
      image:
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFydHxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      id: 4,
      title: 'Urban Rhythms',
      artist: 'Jasper Stone',
      price: '$1,950',
      image:
        'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFydHxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      id: 5,
      title: 'Celestial Dance',
      artist: 'Aurora Skye',
      price: '$2,800',
      image:
        'https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGFydHxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      id: 6,
      title: 'Echoes of Serenity',
      artist: 'River Moss',
      price: '$2,100',
      image:
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFydHxlbnwwfHwwfHx8MA%3D%3D'
    }
  ]

  const [hoveredId, setHoveredId] = useState(null)
  const handleClick = id => {
    navigate(`/products/${id}`)
  }
  return (
    <section className=' bg-slate'>
      <div className='bg-gradient-to-b from-customColorSecondary via-slate-50 to-white h-28'></div>
      <div className='container mx-auto px-4 pb-12'>
        <div className='mb-16 text-center'>
          <h2 className=' md:text-4.5xl  text-4xl font-primary tracking-tighter leading-5 font-semibold text-center text-customColorTertiaryDark'>
            Featured Artworks
          </h2>
          <div className='w-24 h-1 bg-primary mx-auto mb-8'></div>
          <p className='text-xl text-gray-600 font-primary max-w-2xl mx-auto'>
            Discover our curated selection of masterpieces that captivate the
            imagination and inspire the soul.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16'>
          {artworks.map(artwork => (
            <motion.div
              onClick={() => {
                handleClick(artwork.id)
              }}
              key={artwork.id}
              className='group hover:cursor-pointer'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: artwork.id * 0.1 }}
              onHoverStart={() => setHoveredId(artwork.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <div className='relative mb-6 overflow-hidden'>
                <img
                  src={artwork.image}
                  alt={`Artwork ${artwork.title}`}
                  className='w-full h-64 object-cover object-center rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              </div>
              <div className='relative'>
                <h3 className='text-xl font-semibold text-gray-900 font-primary group-hover:text-primary transition-colors duration-300'>
                  {artwork.title}
                </h3>
                <p className='mt-1 text-md text-gray-600 font-primary'>
                  {artwork.artist}
                </p>
                <p className='mt-2 text-lg font-bold text-primary font-primary'>
                  {artwork.price}
                </p>
                <motion.div
                  className='absolute -right-4 top-1/2 transform -translate-y-1/2'
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: hoveredId === artwork.id ? 1 : 0,
                    x: hoveredId === artwork.id ? 0 : -10
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className='w-6 h-6 text-primary' />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className='mt-20 text-center'>
          <Link
            to={'/all'}
            className='inline-flex items-center text-primary font-semibold text-lg font-primary hover:underline'
          >
            Explore All Artworks
            <ArrowRight className='ml-2 w-5 h-5' />
          </Link>
        </div>
      </div>
    </section>
  )
}

export {
  MovingProductsSection,
  BannerSection,
  AnimatedCarousalSection,
  FeaturedArtSection
}
