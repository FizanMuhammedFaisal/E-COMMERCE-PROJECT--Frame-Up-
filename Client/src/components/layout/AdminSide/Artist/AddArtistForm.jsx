import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import 'react-toastify/dist/ReactToastify.css'
import api from '../../../../services/api/api'
import { uploadImagesToCloudinary } from '../../../../services/Cloudinary/UploadImages'
import { useNavigate } from 'react-router-dom'

function AddArtistForm() {
  const [artistName, setArtistName] = useState('')
  const [description, setDescription] = useState('')
  const [picture, setPicture] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onDrop = acceptedFiles => {
    setPicture(acceptedFiles[0])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    multiple: false
  })
  const uploadAndAdd = async () => {
    try {
      setLoading(true)
      console.log(picture)
      const url = await uploadImagesToCloudinary([picture])
      const data = { name: artistName, description, image: url[0] }
      await api.post('/artists/add', { data })

      toast.success('Artist Created Successfully')
      navigate('/dashboard/artists')
      // Clear the form and error
      setArtistName('')
      setDescription('')
      setPicture(null)
      setError('')
    } catch (err) {
      console.error('Failed to add artist:', err)
      setError(err.message)
    }
    setLoading(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    if (!artistName || !description || !picture) {
      setError('All fields are required')
      setLoading(false)
      return
    }
    try {
      const result = await api.post('/artists/check-name', { name: artistName })
      if (!result.status === 200) {
        setError('This Name Already Exist')
      } else {
        setError('')
        uploadAndAdd()
      }
    } catch (err) {
      console.error('Failed to add artist:', err)
      if (err.response.data.message === 'This Name Already Exist')
        setError('This Name Already Exist')
      setLoading(false)
    }
  }

  return (
    <div className='p-8 rounded-lg w-full lg:max-w-full font-primary mx-auto md:px-20 mt-10'>
      <h1 className='text-4xl font-primary font-bold mb-6 text-start'>
        Add New Artist
      </h1>

      {error && (
        <div className='dark:bg-customP2ForegroundD_400 border-customP2ForegroundD_600 border bg-customP2ForeGroundW_500 py-2 mb-4 rounded-lg'>
          <p className='text-red-900 dark:text-red-500 ms-4 text-start'>
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='form-group'>
          <label
            htmlFor='artistName'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Artist Name
          </label>
          <input
            type='text'
            id='artistName'
            value={artistName}
            onChange={e => setArtistName(e.target.value)}
            placeholder='Enter artist name'
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          />
        </div>

        {/* Description Input */}
        <div className='form-group'>
          <label
            htmlFor='description'
            className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'
          >
            Description
          </label>
          <textarea
            id='description'
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder='Enter artist description'
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
          ></textarea>
        </div>

        {/* file input */}
        <div className='form-group'>
          <label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200'>
            Artist Picture
          </label>
          <div
            {...getRootProps()}
            className={`mt-1 flex justify-center items-center px-6 py-4 border-2 border-dashed rounded-md transition-all ${
              isDragActive
                ? 'border-customP2Primary bg-customP2ForegroundD_50'
                : 'border-gray-300 dark:bg-customP2BackgroundD_darkest'
            }`}
          >
            <input {...getInputProps()} />
            <div className='text-center'>
              {picture ? (
                <p>{picture.name}</p>
              ) : (
                <p className='text-gray-500'>
                  Drag & drop an image, or click to select
                </p>
              )}
            </div>
          </div>
        </div>

        <div className='text-center'>
          <button
            type='submit'
            disabled={loading}
            className={` bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500 ${
              loading ? 'bg-opacity-60' : ''
            } text-white px-4 py-2 rounded-md  transition`}
          >
            {loading ? 'Submitting...' : ' Add Artist'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddArtistForm
