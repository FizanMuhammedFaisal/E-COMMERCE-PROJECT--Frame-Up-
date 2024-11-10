import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Image as ImageIcon, User, Palette } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../../services/api/api'

const LINK = motion.create(Link)

const StarRating = ({ rating, onRate }) => {
  return (
    <div className='flex items-center space-x-1'>
      {[1, 2, 3, 4, 5].map(star => (
        <motion.button
          key={star}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRate(star)}
          className={`focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          aria-label={`Rate ${star} stars`}
        >
          <Star className='w-6 h-6 fill-current' />
        </motion.button>
      ))}
    </div>
  )
}

const ArtworkCard = ({ artwork }) => (
  <LINK
    to={`/all/${artwork._id}`}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className='bg-white  rounded-lg  overflow-hidden hover:shadow-xl transition-all duration-300 group'>
      <div className='relative overflow-hidden'>
        <img
          src={artwork.thumbnailImage}
          alt={artwork.productName}
          className='max-w-full object-contain h-64  transition-transform duration-300 hover:scale-105'
          loading='lazy'
        />
      </div>
      <div className='p-4 border-t'>
        <h3 className='text-lg font-semibold text-customColorTertiaryDark group-hover:text-customColorTertiarypop transition-colors duration-300'>
          {artwork.productName}
        </h3>
        <p className='text-sm text-gray-600 mt-1'>{artwork.productYear}</p>
      </div>
    </div>
  </LINK>
)

export default function ArtistProfile() {
  const [userRating, setUserRating] = useState(0)
  const { id } = useParams()

  const fetchArtist = async () => {
    const res = await api.get(`/artists/${id}`)
    return res.data.artist
  }

  const fetchArtworks = async () => {
    const res = await api.post('/artists/artworks/all', { artistId: id })
    return res.data.products
  }

  const {
    data: artist,
    isLoading: isLoadingArtist,
    isError: isErrorArtist
  } = useQuery({
    queryFn: fetchArtist,
    queryKey: ['artistDetails', id]
  })

  const {
    data: artworks,
    isLoading: isLoadingArtworks,
    isError: isErrorArtworks
  } = useQuery({
    queryFn: fetchArtworks,
    queryKey: ['artworks', id]
  })

  const handleRate = rating => {
    setUserRating(rating)
    // Here you would typically send this rating to your backend
    console.log(`User rated the artist ${rating} stars`)
  }

  if (isLoadingArtist || isLoadingArtworks) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='animate-pulse space-y-8'>
          <div className='bg-gray-200 h-64 rounded-lg'></div>
          <div className='bg-gray-200 h-8 w-1/2 rounded'></div>
          <div className='bg-gray-200 h-4 w-full rounded'></div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {[...Array(4)].map((_, index) => (
              <div key={index} className='bg-gray-200 h-48 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isErrorArtist || isErrorArtworks) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
          role='alert'
        >
          <strong className='font-bold'>Error!</strong>
          <span className='block sm:inline'>
            {' '}
            Unable to load artist details or artworks. Please try again later.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-customColorSecondary to-customColorPrimaryLight/70'>
      <div className='container mx-auto px-4 py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-white rounded-lg overflow-hidden mb-12 shadow-lg'
        >
          <div className='md:flex flex-col md:flex-row'>
            <div className='md:w-1/3 flex justify-center items-center bg-customColorPrimaryLight/80 p-4'>
              <img
                className='h-64 w-64 object-cover rounded-full border-4 border-white shadow-lg'
                src={artist.image}
                alt={artist.name}
              />
            </div>
            <div className='md:w-2/3 p-8 relative z-10'>
              <div className='flex items-center mb-4'>
                <User className='text-customColorTertiarypop mr-2' />
                <div className='uppercase tracking-wide text-sm text-customColorTertiary font-semibold'>
                  Artist Profile
                </div>
              </div>
              <h1 className='text-4xl font-bold text-customColorTertiaryDark mb-4'>
                {artist.name}
              </h1>
              <p className='text-gray-600 mb-6'>{artist.description}</p>
              <div className='flex items-center mb-4'>
                <div className='flex items-center'>
                  <Star className='h-5 w-5 text-yellow-400' />
                  <span className='ml-1 text-gray-600 font-semibold'>
                    {artist.averageRating?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                {artist.totalRatings && (
                  <>
                    <span className='mx-2 text-gray-500'>•</span>
                    <span className='text-gray-600'>
                      {artist.totalRatings} ratings
                    </span>
                  </>
                )}
              </div>
              <div className='mb-6'>
                <span className='text-gray-700 mr-2 font-semibold'>
                  Rate this artist:
                </span>
                <StarRating rating={userRating} onRate={handleRate} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center'>
              <Palette className='text-customColorTertiary mr-2' />
              <h2 className='text-3xl font-bold text-customColorTertiaryDark'>
                Artist's Gallery
              </h2>
            </div>
          </div>
          {artworks && artworks.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {artworks.slice(0, 8).map((art, index) => (
                <motion.div
                  key={art._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <ArtworkCard artwork={art} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='text-center py-12 bg-white rounded-lg shadow-md'>
              <ImageIcon className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-xl font-medium text-customColorTertiaryDark'>
                No artwork yet
              </h3>
              <p className='mt-1 text-gray-500'>
                This artist hasn't uploaded any artwork yet. Check back soon!
              </p>
            </div>
          )}
          {artworks && artworks.length > 8 && (
            <div className='text-center mt-8'>
              <Link
                to={`/artists/${id}/gallery`}
                className='inline-block bg-customColorTertiary text-white px-6 py-3 rounded-full hover:bg-customColorTertiarypop transition-colors duration-300'
              >
                View More Artworks
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
