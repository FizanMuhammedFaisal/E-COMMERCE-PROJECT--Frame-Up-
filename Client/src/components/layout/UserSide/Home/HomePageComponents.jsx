import { useQuery } from '@tanstack/react-query'
import ImageCarouselSection from '../../../common/Animations/ImageCarouselSection'
import api from '../../../../services/api/api'
import { useEffect, useState } from 'react'

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

import React from 'react'

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
export { MovingProductsSection, BannerSection }
