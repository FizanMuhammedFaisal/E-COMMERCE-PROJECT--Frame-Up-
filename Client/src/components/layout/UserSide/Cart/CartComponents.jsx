import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { IoMdLock } from 'react-icons/io'
import { useNavigate } from 'react-router-dom/dist'
import EmptyCartAnimation from '../../../common/Animations/EmptyCartAnimation'
import { Badge, Button, Card, CardContent } from '@mui/material'
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { MinusIcon, PlusIcon } from 'lucide-react'
const MotionButton = motion.create(Button)
function NotLoggedIn() {
  const navigate = useNavigate()
  const redirectToLogin = () => {
    navigate('/login', { state: { from: '/cart' } })
  }
  useEffect(() => {
    const randomColor = () => {
      const number = Math.floor(Math.random() * 10) + 1
      setRandom(number)
    }
    randomColor()
  }, [])
  const [random, setRandom] = useState(null)

  return (
    <motion.div
      className={`min-h-screen custom-background${random} py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center relative overflow-hidden`}
      initial={{ backgroundColor: '#ffffff' }}
      animate={{
        backgroundColor: ['#f0f4ff', '#f0e9d8', '#f0f4ff'],
        transition: {
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
    >
      <motion.div
        className='max-w-md text-center bg-white bg-opacity-35 p-8 rounded-lg shadow-xl backdrop-filter backdrop-blur-md'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      >
        <motion.div
          className='mb-6'
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 3,
            ease: 'easeInOut',
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1
          }}
          whileHover={{
            scale: [1, 1.2, 1],
            transition: {
              duration: 0.2,
              repeat: 4,
              ease: 'easeInOut'
            }
          }}
        >
          <IoMdLock className='h-16 w-16 text-text mx-auto' />
        </motion.div>

        <h2 className='text-2xl font-semibold text-gray-900 text-center mb-4'>
          You need to log in to access the cart
        </h2>
        <motion.button
          onClick={redirectToLogin}
          className='bg-customColorTertiary focus:outline-none  text-white py-3 px-6 rounded-md font-medium hover:bg-opacity-85 transition duration-300 ease-in-out'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Log in to Continue
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

const EmptyCart = () => {
  const navigate = useNavigate()
  return (
    <div className='p-8 text-center'>
      <EmptyCartAnimation />
      <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
        Your cart is empty
      </h2>
      <p className='text-gray-600 mb-8'>
        Looks like you haven't added any items to your cart yet.
      </p>
      <motion.button
        onClick={() => navigate('/all')}
        className='bg-customColorTertiary text-white py-3 px-6 rounded-md font-medium hover:bg-customColorTertiaryLight transition duration-150 ease-in-out'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Shopping
      </motion.button>
    </div>
  )
}
const CartItems = ({ items, handleUpdateQuantity, handleRemoveItem }) => {
  return (
    <div className='space-y-4'>
      {items.map(item => (
        <Card
          key={item.productId}
          elevation={0}
          className='border border-gray-200'
        >
          <CardContent className='p-4'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between'>
              <div className='flex items-center mb-4 sm:mb-0 w-full sm:w-auto'>
                <img
                  src={item.thumbnailImage}
                  alt={item.productName}
                  className='w-24 h-24 object-cover rounded-md mr-4'
                  loading='lazy'
                />
                <div>
                  <h2 className='text-lg font-semibold text-gray-900 mb-1'>
                    {item.productName}
                  </h2>
                  <p className='text-xl text-customColorTertiaryDark font-bold'>
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className='flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0'>
                {item.quantity === 0 ? (
                  <Badge
                    variant='destructive'
                    className='text-sm px-2 bg-red-100 text-red-600 py-1 rounded-full'
                  >
                    <ExclamationCircleIcon className='w-4 h-4 mr-1 inline' />
                    Out of Stock
                  </Badge>
                ) : (
                  <div className='flex items-center space-x-2'>
                    <MotionButton
                      variant='outlined'
                      size='small'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleUpdateQuantity(item.productId, -1)}
                      disabled={item.quantity === 1}
                    >
                      <MinusIcon className='h-4 w-4' />
                    </MotionButton>
                    <span className='w-8 text-center font-semibold'>
                      {item.quantity}
                    </span>
                    <MotionButton
                      variant='outlined'
                      size='small'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleUpdateQuantity(item.productId, 1)}
                    >
                      <PlusIcon className='h-4 w-4' />
                    </MotionButton>
                  </div>
                )}
                <MotionButton
                  variant='text'
                  size='small'
                  className='ml-4 text-gray-500'
                  whileHover={{ scale: 1.1, color: '#EF4444' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  <XMarkIcon className='h-5 w-5' />
                </MotionButton>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
export { NotLoggedIn, EmptyCart, CartItems }
