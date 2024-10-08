import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductsTable from '../../../components/common/ReusableTable' // Assuming a reusable table component for products
import { FaEdit } from 'react-icons/fa'
import AlertDialog from '../../../components/common/AlertDialog'
import {
  fetchProducts,
  setPage,
  updateProductStatus
} from '../../../redux/slices/Admin/AdminProducts/adminProductsSlice'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Select } from '@headlessui/react'
import CircularProgress from '@mui/material/CircularProgress'

const AdminProducts = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const products = useSelector(state => state.adminProducts.data)
  const loading = useSelector(state => state.adminProducts.loading)
  const error = useSelector(state => state.adminProducts.error)
  const page = useSelector(state => state.adminProducts.page)
  const hasMore = useSelector(state => state.adminProducts.hasMore)
  const lastProductRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusLoading, setStatusLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState('')
  useEffect(() => {
    dispatch(fetchProducts(page))
  }, [page, dispatch])

  useEffect(() => {
    if (loading || !hasMore) return
    console.log('asdfasf')
    const observer = new IntersectionObserver(
      entries => {
        console.log('here')
        if (entries[0].isIntersecting) console.log('thene hre')
        {
          console.log('sdadsf')
          dispatch(setPage(page + 1))
        }
      },
      { rootMargin: '0px', threshold: 1.0 }
    )

    const currentLastProductRef = lastProductRef.current
    if (currentLastProductRef) observer.observe(currentLastProductRef)
    console.log('created')

    return () => {
      if (currentLastProductRef) observer.unobserve(currentLastProductRef)
    }
  }, [loading, hasMore, page, dispatch])
  const handleStatusChange = useCallback(
    (id, newStatus) => {
      setIsOpen(true)
      setNewStatus(newStatus)
      setCurrentUserId(id)
    },
    [setIsOpen, setNewStatus, setCurrentUserId]
  )

  const handleProductEdit = id => {
    navigate(`/dashboard/products/${id}`)
  }
  const onConfirm = async () => {
    setStatusLoading(true)
    try {
      await dispatch(
        updateProductStatus({ id: currentUserId, status: newStatus })
      ).unwrap()
      toast.success('status updated successfully!', {
        className:
          'bg-white dark:bg-customP2ForegroundD_400 font-primary dark:text-white '
      })
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to update user status')
      console.error('Failed to update user status:', error)
    } finally {
      setStatusLoading(false)
    }
  }
  const columns = [
    { label: 'Serial No.', field: 'serialNo' },
    { label: 'Thumbnail', field: 'thumbnail' },
    { label: 'Name', field: 'productName' },
    { label: 'Price', field: 'price' },
    // { label: 'Category', field: 'category' },
    { label: 'Action', field: 'action' },
    { label: 'Edit', field: 'edit' }
  ]

  const data = useMemo(
    () =>
      products.map((product, index) => ({
        serialNo: <p className='ms-5'>{index + 1}</p>,
        thumbnail: (
          <img
            className='rounded-sm sm:max-w-12 h-auto md:max-w-14 lg:max-w-16'
            src={product.thumbnailImage}
            loading='lazy'
            alt={product.productName}
          />
        ),
        productName: <div className='p-1 text-lg'>{product.productName}</div>,
        price: <div className='p-1 text-lg'>{product.productPrice}</div>,
        // category: (
        //   <div className='p-1 text-lg'>
        //     <li> {'name'}</li>
        //     {/* {product.productCategories &&
        //     product.productCategories.length > 0 ? (
        //       <ul>
        //         {product.productCategories.map((category, index) => (
        //           <li key={category._id || index}>{category.name}</li>
        //         ))}
        //       </ul>
        //     ) : (
        //       <div>No categories available</div>
        //     )} */}
        //   </div>
        // ),
        action: (
          <Select
            name='status'
            value={product.status}
            onChange={e => {
              handleStatusChange(product._id, e.target.value)
            }}
            className={`sm:w-24 lg:w-32 py-1 px-2border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-customP2Primary focus:border-customP2Primary sm:text-sm 
      ${
        product.status === 'Blocked'
          ? 'bg-red-400  text-slate-900   dark:text-red-200 dark:bg-red-900 dark:border-red-900 '
          : 'bg-green-400 dark:bg-green-900 dark:text-green-200 dark:border-green-900'
      }
    `}
          >
            <option value='Active'>Active</option>
            <option value='Blocked'>Blocked</option>
          </Select>
        ),
        edit: (
          <button
            onClick={() => handleProductEdit(product._id)}
            className=' text-white p-4 duration-300 hover:duration-300 rounded-full hover:bg-gray-200 hover:dark:bg-customP2BackgroundD_300'
          >
            <FaEdit className='sm:text-xl md:text-2xl dark:text-white text-black' />
          </button>
        )
      })),
    [products]
  )
  return (
    <div className='p-4'>
      <button
        onClick={() => {
          dispatch(setPage(2))
        }}
      >
        sdfaf
      </button>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
        <h1 className='text-4xl font-bold mb-2 sm:mb-0 '>Product Management</h1>
      </div>
      <div className='flex justify-end'>
        <motion.button
          onClick={() => {
            navigate('/dashboard/add-products')
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className='p-2 rounded-sm px-4 me-2 bg-customP2Primary text-white font-semibold  hover:bg-opacity-75  text-sm   transition-colors duration-300'
        >
          Add New Product
        </motion.button>
      </div>
      <div className='mt-4'>
        <ProductsTable columns={columns} data={data} />
      </div>
      <div className='text-center mt-4'>
        {loading && <CircularProgress size={30} color='inherit' />}
      </div>
      {hasMore && !loading && (
        <div ref={lastProductRef} className='text-center'>
          Scroll to load more...
        </div>
      )}
      {!hasMore && !loading && (
        <div className='text-center'>No more Products to load.</div>
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

export default AdminProducts
