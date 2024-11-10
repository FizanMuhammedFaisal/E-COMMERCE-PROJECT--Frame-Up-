import { useState, useEffect } from 'react'
import { Share2, Copy, CheckCircle, Mail } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../../services/api/apiClient'
import { FiTwitter } from 'react-icons/fi'
import { SiWhatsapp } from 'react-icons/si'

export default function Referral() {
  const [copied, setCopied] = useState(false)
  const [progress, setProgress] = useState(0)
  const sharingLimit = 10

  const {
    data: coupon,
    isLoading,
    error
  } = useQuery({
    queryKey: ['referral'],
    queryFn: async () => {
      const res = await apiClient.get('/api/users/referral')
      return res.data.referral
    }
  })

  useEffect(() => {
    if (coupon) {
      const timer = setTimeout(() => {
        setProgress((coupon.usedCount / sharingLimit) * 100)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [coupon])

  const shareableText = `Hey! Use my referral code ${coupon?.code} to sign up and get a reward!`
  const shareUrl = `${import.meta.env.VITE_FRONTEND_URL}`

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareableText + ' ' + shareUrl)}`
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareableText + ' ' + shareUrl)}`
  const emailShareUrl = `mailto:?subject=Join%20My%20Referral%20Program!&body=${encodeURIComponent(shareableText + ' ' + shareUrl)}`

  const copyToClipboard = () => {
    if (coupon?.code) {
      navigator.clipboard.writeText(coupon.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Join My Referral Program!',
          text: shareableText,
          url: shareUrl
        })
        .then(() => console.log('Successful share'))
        .catch(error => {
          console.error('Error sharing:', error)
          copyToClipboard()
        })
    } else {
      copyToClipboard()
      alert('Referral link copied! You can share it manually.')
    }
  }

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-screen text-lg'>
        Loading...
      </div>
    )
  if (error)
    return (
      <div className='flex items-center justify-center h-screen text-lg text-red-500'>
        Error loading referral data
      </div>
    )

  return (
    <div className=' flex items-center justify-center p-2'>
      <div className='bg-white rounded-lg p-4 w-full '>
        <h1 className='text-2xl font-bold text-center mb-6 text-gray-800'>
          Your Referral Program
        </h1>

        <div className='space-y-6'>
          <div className='bg-gray-100 rounded-lg p-4'>
            <p className='text-sm text-gray-600 mb-2'>Your Referral Code</p>
            <div className='flex items-center justify-between'>
              <span className='text-xl font-mono font-semibold text-gray-800'>
                {coupon?.code}
              </span>
              <button
                onClick={copyToClipboard}
                className='text-customColorTertiary hover:text-customColorTertiarypop 0 transition-colors duration-200 focus:outline-none'
                aria-label={copied ? 'Copied' : 'Copy to clipboard'}
              >
                {copied ? (
                  <CheckCircle className='h-5 w-5' />
                ) : (
                  <Copy className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm text-gray-600'>Invites Sent</span>
              <span className='text-sm font-semibold text-gray-800'>
                {coupon?.usedCount} / {sharingLimit}
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-customColorTertiary h-2 rounded-full transition-all duration-1000 ease-out'
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className='bg-green-50 rounded-lg p-4'>
            <p className='text-sm font-semibold text-green-800 mb-2'>
              Referral Rewards
            </p>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>You Get</span>
              <span className='text-lg font-semibold text-green-600'>
                ₹{coupon?.rewardAmount}
              </span>
            </div>
            <div className='flex justify-between items-center mt-2'>
              <span className='text-sm text-gray-600'>Your Friend Gets</span>
              <span className='text-lg font-semibold text-green-600'>
                ₹{coupon?.referrerRewardAmount}
              </span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className='w-full bg-customColorTertiary hover:bg-customColorTertiaryLight text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center'
          >
            <Share2 className='mr-2 h-5 w-5' /> Share Your Code
          </button>

          <div className='flex justify-center space-x-4'>
            <a
              href={whatsappShareUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-green-500 hover:text-green-600'
            >
              <SiWhatsapp className='h-6 w-6' />
            </a>
            <a
              href={twitterShareUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-customColorTertiary'
            >
              <FiTwitter className='h-6 w-6' />
            </a>
            <a
              href={emailShareUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-500 hover:text-gray-600'
            >
              <Mail className='h-6 w-6' />
            </a>
          </div>
        </div>

        <p className='text-xs text-gray-500 text-center mt-6'>
          Share with friends and earn rewards together!
        </p>
      </div>
    </div>
  )
}
