import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Alert, Button, Snackbar } from '@mui/material'
import ImageZoomModal from '../../../modals/ImageZoomModal'
import ProductRatings from '../../../common/ProductRatings'
import ProductFeatures from './ProductFeatures'
import RelatedProducts from './RelatedProducts'
import { useCart } from '../../../../hooks/useCart'
import apiClient from '../../../../services/api/apiClient'
import Breadcrumb from '../../../common/Breadcrumb'
import ProductDetailsSection from './ProductDetailsSection'
import ArtDetailsSection from './ArtDetailsSection'
import { motion } from 'framer-motion'

function ProductDetails({ product, discount }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const [added, setAdded] = useState(false)
  const { isAuthenticated } = useSelector(state => state.auth)
  const { addToCart, loading } = useCart()
  const navigate = useNavigate()
  const allImages = [...product.productImages, ...product.thumbnailImage]

  const handleThumbnailClick = index => setSelectedImageIndex(index)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      return setSnackbarData({
        open: true,
        message: 'Login to add items to your cart',
        severity: 'error'
      })
    }
    const result = await addToCart(product._id, 1)
    if (result.success) {
      setAdded(true)
      setSnackbarData({
        open: true,
        message: 'Product added to cart!',
        severity: 'success'
      })
    } else {
      setSnackbarData({
        open: true,
        message: result.error,
        severity: 'error'
      })
    }
  }

  const handleAddToWishlist = async productId => {
    if (!isAuthenticated) {
      return setSnackbarData({
        open: true,
        message: 'Login to add items to your Wishlist',
        severity: 'error'
      })
    }
    try {
      const res = await apiClient.post('/api/wishlist/add', { productId })
      console.log(res.data)
      setAdded(true)
      setSnackbarData({
        open: true,
        message: 'Product added to Wishlist!',
        severity: 'success'
      })
    } catch (error) {
      console.log(error)
      setSnackbarData({
        open: true,
        message: error?.response?.data?.message,
        severity: 'error'
      })
    }
  }

  const handleCloseSnackbar = () =>
    setSnackbarData({ ...snackbarData, open: false })

  // const formatDate = dateString => {
  //   const options = { year: 'numeric', month: 'long', day: 'numeric' }
  //   return new Date(dateString).toLocaleDateString(undefined, options)
  // }

  return (
    <div className='bg-slate-50 min-h-screen'>
      <div className='mt-10'>
        <Breadcrumb productName={product.productName} />
      </div>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <ProductDetailsSection
          handleAddToWishlist={handleAddToWishlist}
          handleThumbnailClick={handleThumbnailClick}
          product={product}
          allImages={allImages}
          openModal={openModal}
          selectedImageIndex={selectedImageIndex}
          loading={loading}
          handleAddToCart={handleAddToCart}
          added={added}
        />
      </div>
      <ArtDetailsSection product={product} />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <section>
          <RelatedProducts productId={product._id} />
        </section>
        <section className='mt-16'>
          <ProductRatings />
        </section>

        <section className='mt-16'>
          <ProductFeatures features={product} />
        </section>
      </div>

      <ImageZoomModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        allImages={allImages}
        selectedImageIndex={selectedImageIndex}
      />

      <Snackbar
        open={snackbarData.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarData.severity}
          sx={{ width: '100%' }}
          action={
            !isAuthenticated ? (
              <Button
                color='inherit'
                size='small'
                onClick={() =>
                  navigate('/login', {
                    state: { from: `/products/${product._id}` }
                  })
                }
              >
                Login
              </Button>
            ) : null
          }
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default ProductDetails
