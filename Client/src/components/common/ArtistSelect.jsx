import { useDispatch, useSelector } from 'react-redux'
import AsyncSelect from 'react-select/async'
import { setFormData } from '../../redux/slices/Admin/AdminProducts/productSlice'
import { useInfiniteQuery } from '@tanstack/react-query'
import apiClient from '../../services/api/apiClient'
import { useEffect, useState } from 'react'

function ArtistSelect({ handleInputChange, value }) {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [options, setOptions] = useState([])
  useEffect(() => {
    if (value) {
      dispatch(setFormData({ id: 'artistName', value }))
    }
  }, [value, dispatch])
  const fetchArtists = async ({ page = 1, search = '' }) => {
    const res = await apiClient.get('/api/artists/get-artists', {
      params: { page, search }
    })
    return {
      artists: res.data.artists,
      hasNextPage: res.data.hasNextPage,
      currentPage: res.data.currentPage,
      totalPages: res.data.totalPages
    }
  }

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['artistName', { search: searchTerm }],
      queryFn: ({ pageParam = 1 }) =>
        fetchArtists({ page: pageParam, search: searchTerm }),
      getNextPageParam: lastPage => {
        if (lastPage.hasNextPage) return lastPage.currentPage + 1
        return undefined
      }
    })

  useEffect(() => {
    if (data?.pages) {
      const allArtists = data.pages.flatMap(page => page.artists)
      const options = allArtists.map(artist => ({
        label: artist.name,
        value: artist._id
      }))
      setOptions(options)
    }
  }, [data])

  const { artistName } = useSelector(state => state.product)

  const loadOptions = async (inputValue, callback) => {
    setSearchTerm(inputValue)
    const res = await fetchArtists({ search: inputValue, page: 1 })
    const options = res.artists.map(artist => ({
      label: artist.name,
      value: artist._id
    }))
    callback(options)
  }

  const onChange = selectedOptions => {
    console.log(selectedOptions)
    if (handleInputChange) {
      handleInputChange({
        target: {
          name: 'artist',
          value: { name: selectedOptions.label, _id: selectedOptions.value }
        }
      })
    }
    dispatch(setFormData({ id: 'artistName', value: selectedOptions }))
  }

  return (
    <AsyncSelect
      defaultOptions={options}
      loadOptions={loadOptions}
      value={artistName}
      onChange={onChange}
      cacheOptions
      placeholder='Select Artist...'
      className='w-full'
      classNamePrefix='react-select'
      isLoading={isLoading || isFetchingNextPage}
      onMenuScrollToBottom={() => {
        if (hasNextPage) fetchNextPage()
      }}
      classNames={{
        control: () =>
          'border-gray-600 dark:text-white bg-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary',
        menu: () => 'bg-white dark:bg-gray-900',
        option: ({ isFocused, isSelected }) =>
          `cursor-pointer ${
            isFocused
              ? 'bg-customP2Primary dark:bg-customP2Primary text-white'
              : 'text-gray-900 dark:text-white'
          } ${isSelected ? 'bg-customP2Primary text-white' : ''}`,
        multiValue: () =>
          'bg-blue-500 dark:bg-customP2ForegroundD_500 text-blue-900 dark:text-white',
        multiValueLabel: () => 'text-blue-900 dark:text-white',
        multiValueRemove: () =>
          'text-blue-900 dark:text-white hover:bg-blue-500 dark:hover:bg-blue-900 hover:text-white'
      }}
    />
  )
}

export default ArtistSelect
