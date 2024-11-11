import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ArtistsTable from '../../../components/common/ReusableTable'
import { Select } from '@headlessui/react'
import AlertDialog from '../../../components/common/AlertDialog'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchArtists,
  setPage,
  updateArtistStatus
} from '../../../redux/slices/Admin/AdminArtists/adminArtists'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../../components/common/Animations/Spinner'
import { toast } from 'sonner'

const AdminArtists = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const artists = useSelector(state => state.adminArtists.data)
  const loading = useSelector(state => state.adminArtists.loading)
  const page = useSelector(state => state.adminArtists.page)
  const hasMore = useSelector(state => state.adminArtists.hasMore)

  const [isOpen, setIsOpen] = useState(false)
  const [currentArtistId, setCurrentArtistId] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  const handleStatusChange = useCallback(
    (id, newStatus) => {
      setIsOpen(true)
      setNewStatus(newStatus)
      setCurrentArtistId(id)
    },
    [setIsOpen, setNewStatus, setCurrentArtistId]
  )

  const onConfirm = async () => {
    setStatusLoading(true)
    try {
      await dispatch(
        updateArtistStatus({ id: currentArtistId, status: newStatus })
      ).unwrap()
      toast.success('Artist status updated successfully!', {
        className:
          'bg-white dark:bg-customP2ForegroundD_400 font-primary dark:text-white '
      })
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to update artist status')
      console.error('Failed to update artist status:', error)
    } finally {
      setStatusLoading(false)
    }
  }

  const lastArtistRef = useRef()
  useEffect(() => {
    dispatch(fetchArtists(page))
  }, [page])

  // Setup IntersectionObserver to load more artists when the last artist is in view
  useEffect(() => {
    if (loading || !hasMore) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          console.log('Last artist in view, loading more artists')
          dispatch(setPage(page + 1))
        }
      },
      { rootMargin: '0px', threshold: 1.0 }
    )

    const currentLastArtistRef = lastArtistRef.current
    if (currentLastArtistRef) observer.observe(currentLastArtistRef)

    return () => {
      if (currentLastArtistRef) observer.unobserve(currentLastArtistRef)
    }
  }, [loading, hasMore, page])

  const columns = [
    { label: 'Serial No.', field: 'serialNo' },

    { label: 'Profile', field: 'profile' },
    { label: 'Name', field: 'name' },

    { label: 'Action', field: 'action' }
  ]

  const data = useMemo(
    () =>
      artists.map((artist, index) => ({
        serialNo: <p className='ms-5'>{index + 1}</p>,
        profile: (
          <div className='p-1 text-lg font-tertiary'>
            <img
              className='rounded-full sm:max-w-12 h-auto md:max-w-14 lg:max-w-16'
              src={artist.image}
              alt={artist.name || 'no profile'}
            />
          </div>
        ),
        name: (
          <div className='p-1 text-lg font-tertiary'>
            {artist.name || 'Name not available'}
          </div>
        ),

        action: (
          <Select
            name='status'
            value={artist.status}
            onChange={e => {
              handleStatusChange(artist._id, e.target.value)
            }}
            className={` sm:w-24 lg:w-28 py-1 px-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm 
         dark:bg-gray-800  text-gray-900 ${
           artist.status === 'Blocked'
             ? 'bg-red-400  text-slate-900   dark:text-red-200 dark:bg-red-900 dark:border-red-900 '
             : 'bg-green-400 dark:bg-green-900 dark:text-green-200 dark:border-green-900'
         }
        `}
          >
            <option value='Active'>Active</option>
            <option value='Blocked'>Blocked</option>
          </Select>
        )
      })),
    [artists, handleStatusChange]
  )

  return (
    <div className='p-4 dark:bg-customP2BackgroundD_darkest  dark:text-slate-50'>
      <div className='flex flex-col sm:flex-row justify-between items-center my-5 mb-6'>
        <h1 className='text-4xl font-bold mb-4 sm:mb-0 '>Artist Management</h1>

        <div className='flex justify-end'>
          <motion.button
            onClick={() => {
              navigate('/dashboard/artists/add-artists')
            }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className='flex items-center px-4 py-2  text-white rounded-md shadow  bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500'
          >
            Add New Artist
          </motion.button>
        </div>
      </div>
      <div className='mt-4'>
        <ArtistsTable columns={columns} data={data} />
      </div>
      <div className='mt-10 justify-center flex'>
        {loading && <Spinner size={1} />}
      </div>

      {hasMore && !loading && (
        <div ref={lastArtistRef} className='text-center'>
          Scroll to load more...
        </div>
      )}
      {!hasMore && !loading && (
        <div className='text-center'>No more artists to load.</div>
      )}
      <AlertDialog
        isOpen={isOpen}
        onCancel={() => {
          setIsOpen(false)
        }}
        button2={newStatus}
        onConfirm={onConfirm}
        loading={statusLoading}
      />
    </div>
  )
}

export default AdminArtists
