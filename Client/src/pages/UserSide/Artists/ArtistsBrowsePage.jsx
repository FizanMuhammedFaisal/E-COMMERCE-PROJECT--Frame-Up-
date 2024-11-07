import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@mui/material'
import api from '../../../services/api/api'
import Pagination from '../../../components/common/Pagination'
import { Link } from 'react-router-dom'
const LINK = motion.create(Link)
function ArtistCard({ artist }) {
  return (
    <LINK
      to={`/artists/${artist._id}`}
      className='bg-white border border-gray-200 rounded-md overflow-hidden transition-shadow duration-300 hover:shadow-md'
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className='aspect-w-1 aspect-h-1 bg-gray-200'>
        <img
          src={artist.image}
          alt={artist.name}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-4 text-center'>
        <h2 className='text-lg font-medium text-gray-900 mb-1'>
          {artist.name}
        </h2>
        {artist.description && (
          <p className='text-sm text-gray-600'>
            {artist.description.split(',')[0]}
          </p>
        )}
      </div>
    </LINK>
  )
}

function ArtistCardSkeleton() {
  return (
    <div className='bg-white border border-gray-200 rounded-md overflow-hidden'>
      <Skeleton
        variant='rectangular'
        width='100%'
        height={0}
        style={{ paddingTop: '100%' }}
      />
      <div className='p-4 text-center'>
        <Skeleton
          variant='text'
          width='80%'
          height={24}
          style={{ margin: '0 auto 4px' }}
        />
        <Skeleton
          variant='text'
          width='60%'
          height={20}
          style={{ margin: '0 auto' }}
        />
      </div>
    </div>
  )
}

export default function ArtistsBrowsePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [artists, setArtists] = useState([])
  const [totalPages, setTotalPages] = useState(null)
  const [page, setPage] = useState(1)

  const fetchData = async () => {
    const res = await api.get('/artists/')
    if (res?.data?.totalPages) {
      setTotalPages(res.data.totalPages)
    }
    return res.data
  }

  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchData,
    queryKey: ['artists', { page }]
  })

  useEffect(() => {
    if (data?.artists) {
      setArtists(data.artists)
    }
  }, [data])

  const handlePageChange = newPage => {
    if (newPage > 0) {
      setPage(newPage)
    }
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='container mx-auto px-14 md:px-4 py-12'>
        <h1 className='text-3xl font-semibold mb-8 text-center text-gray-900'>
          Our Artists
        </h1>

        <div className='max-w-md mx-auto mb-12'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search artists...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white'
            />
            <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          </div>
        </div>

        {isLoading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[...Array(8)].map((_, index) => (
              <ArtistCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className='text-center text-red-500 mt-8'>
            <p>Error loading artists: {error.message}</p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {artists.map(artist => (
                <ArtistCard key={artist._id} artist={artist} />
              ))}
            </div>

            {artists.length === 0 && (
              <p className='text-center text-gray-500 mt-8'>
                No artists found matching your search.
              </p>
            )}

            <div className='mt-12'>
              <Pagination
                onPageChange={handlePageChange}
                currentPage={page}
                totalPages={totalPages}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
