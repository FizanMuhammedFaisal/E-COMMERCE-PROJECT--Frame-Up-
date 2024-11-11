import { motion, AnimatePresence } from 'framer-motion'
import { User, Gift, Sparkles, ArrowLeft, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { uploadImagesToCloudinary } from '../../../services/Cloudinary/UploadImages'
import Spinner from '../../../components/common/Animations/Spinner'
import apiClient from '../../../services/api/apiClient'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSignUpStatus } from '../../../redux/slices/authSlice'
export default function SetUpPage() {
  const [step, setStep] = useState(1)
  const [referralCode, setReferralCode] = useState('')
  const [profilePicture, setProfilePicture] = useState()
  const [profileFile, setProfileFile] = useState()
  const [error, setError] = useState({ referral: null, profile: null })
  const [success, setSuccess] = useState({ referral: null, profile: null })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const { signUpStatus } = useSelector(state => state.auth)
  useEffect(() => {
    if (!signUpStatus) {
      navigate('/')
    }
  }, [pathname, navigate])

  const handleNextStep = async () => {
    if (step === 2 && profileFile) {
      await uploadProfilePicture()
    } else {
      setStep(prevStep => prevStep + 1)
    }
  }

  const handlePreviousStep = () => {
    setStep(prevStep => prevStep - 1)
  }

  const uploadProfilePicture = async () => {
    setLoading(true)
    try {
      const url = await uploadImagesToCloudinary(profileFile)

      const res = await apiClient.post('/api/users/upload-profile', { url })
      if (res.status === 200) {
        setError(prev => ({ ...prev, profile: null }))
        setSuccess(prev => ({ ...prev, profile: 'Profile Picture added' }))
        setProfileFile(null)
        setTimeout(() => setStep(prevStep => prevStep + 1), 300)
      }
    } catch (error) {
      setError(prev => ({ ...prev, profile: 'Failed to process. Try again' }))
    } finally {
      setLoading(false)
    }
  }

  const applyCoupon = async code => {
    setLoading(true)
    try {
      const res = await apiClient.post('/api/users/referral', { code })
      if (res.status === 200) {
        setReferralCode('')
        setError(prev => ({ ...prev, referral: null }))
        setSuccess(prev => ({
          ...prev,
          referral: res.data.message || 'Referral code applied successfully'
        }))
        setTimeout(() => handleNextStep(), 3000)
      }
    } catch (error) {
      setError(prev => ({
        ...prev,
        referral: error.response?.data?.message || 'Error occurred. Try again'
      }))
    } finally {
      setLoading(false)
    }
  }

  const handleReferralCodeSubmit = e => {
    e.preventDefault()
    if (referralCode.trim()) {
      applyCoupon(referralCode)
    }
  }

  const handleProfilePictureUpload = e => {
    const { files } = e.target
    const image = Array.from(files)
    const file = e.target.files?.[0]
    if (file) {
      setProfileFile(image)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFinish = () => {
    dispatch(setSignUpStatus(false))
    navigate('/')
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-customColorSecondary to-customColorPrimary/50 flex items-center justify-center p-4'>
      <motion.div
        className='bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative overflow-hidden'
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>
          Let's Get You Set Up!
        </h1>

        <AnimatePresence mode='wait'>
          {step === 1 && (
            <motion.div
              key='step1'
              variants={stepVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              className='space-y-6'
            >
              <motion.div
                className='flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mx-auto overflow-hidden'
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <Gift className='w-12 h-12 text-customColorTertiaryLight' />
              </motion.div>
              <h2 className='text-xl font-medium text-center text-gray-700'>
                {success.referral ? 'Great!' : 'Got a Referral Code?'}
              </h2>
              {success.referral ? (
                <p className='text-green-500 text-center'>{success.referral}</p>
              ) : (
                <form onSubmit={handleReferralCodeSubmit} className='space-y-4'>
                  {error.referral && (
                    <p className='text-red-500 text-center'>{error.referral}</p>
                  )}
                  <input
                    type='text'
                    value={referralCode}
                    onChange={e => setReferralCode(e.target.value)}
                    placeholder='Enter your referral code'
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customColorTertiary'
                  />
                  <motion.button
                    type='submit'
                    className='w-full bg-customColorTertiary text-white py-2 px-4 rounded-md hover:bg-customColorTertiaryLight transition-colors duration-300 flex items-center justify-center'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    {loading ? <Spinner size={-1} speed={1} /> : 'Apply Code'}
                  </motion.button>
                </form>
              )}
              <motion.button
                onClick={handleNextStep}
                className='w-full text-customColorTertiary py-2 hover:underline flex items-center justify-center'
                whileHover={{ scale: 1.05 }}
              >
                Skip this step <Sparkles className='ml-2 w-4 h-4' />
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key='step2'
              variants={stepVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              className='space-y-6'
            >
              <div className='flex flex-col items-center space-y-4'>
                {profilePicture ? (
                  <motion.div
                    className='relative'
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    <img
                      src={profilePicture}
                      alt='Profile'
                      className='w-32 h-32 rounded-full object-cover border-2 border-customColorTertiary'
                    />
                    <button
                      onClick={() => {
                        setProfilePicture(null)
                        setProfileFile(null)
                      }}
                      className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    className='w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center'
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <User className='w-16 h-16 text-gray-400' />
                  </motion.div>
                )}
                {error.profile && (
                  <p className='text-red-500 text-center'>{error.profile}</p>
                )}
                {success.profile && (
                  <p className='text-green-500 text-center'>
                    {success.profile}
                  </p>
                )}
                <motion.label
                  className='cursor-pointer bg-customColorTertiary text-white py-2 px-4 rounded-md hover:bg-customColorTertiaryLight transition-colors duration-300'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleProfilePictureUpload}
                    className='hidden'
                  />
                  Choose Your Profile Picture
                </motion.label>
              </div>
              <motion.button
                onClick={handleNextStep}
                className='w-full bg-customColorTertiary text-white py-2 px-4 rounded-md hover:bg-customColorTertiaryLight transition-colors duration-300 flex items-center justify-center'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? <Spinner size={-1} speed={1} /> : 'Next Step'}
              </motion.button>
              <motion.button
                onClick={handleNextStep}
                className='w-full text-customColorTertiary py-2 hover:underline flex items-center justify-center'
                whileHover={{ scale: 1.05 }}
              >
                Skip for now <Sparkles className='ml-2 w-4 h-4' />
              </motion.button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key='step3'
              variants={stepVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              className='space-y-6'
            >
              <motion.div
                className='flex items-center justify-center w-24 h-24 bg-customColorTertiarypop rounded-full mx-auto overflow-hidden'
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <Sparkles className='w-12 h-12 text-customColorTertiaryDark' />
              </motion.div>
              <h2 className='text-xl font-medium text-center text-gray-700'>
                You're All Set!
              </h2>
              <p className='text-center text-gray-600'>
                Thanks for completing your profile. Get ready for an amazing
                experience!
              </p>
              <motion.button
                onClick={handleFinish}
                className='w-full bg-customColorTertiarypop font-bold text-customColorTertiaryDark hover:text-white py-2 px-4 rounded-md hover:bg-customColorTertiaryDark transition-colors duration-300'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let's Go!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='mt-8 flex justify-between items-center'>
          {step > 1 && (
            <motion.button
              onClick={handlePreviousStep}
              className='flex items-center text-gray-500 hover:text-gray-600 transition-colors duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back
            </motion.button>
          )}
          <div className='flex-1' />
          <div className='flex space-x-2'>
            {[1, 2, 3].map(dot => (
              <motion.div
                key={dot}
                className={`w-3 h-3 rounded-full ${
                  step === dot ? 'bg-customColorTertiary' : 'bg-gray-300'
                }`}
                animate={{ scale: step === dot ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
