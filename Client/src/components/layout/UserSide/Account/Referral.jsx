'use client'

import { useState, useEffect } from 'react'
import { Share2, Copy, CheckCircle, Users, Gift } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../../services/api/apiClient'

export default function TailwindReferralPage() {
  const [copied, setCopied] = useState(false)
  const [progress, setProgress] = useState(0)
  const referralCode = 'FRIEND2023'
  const sharingLimit = 10
  const currentShares = 5
  const yourCreditAmount = 50
  const friendCreditAmount = 100

  const fetchData = async () => {
    const res = await apiClient.get()
  }
  const { data } = useQuery({
    queryFn: fetchData
  })
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((currentShares / sharingLimit) * 100)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='flex items-center justify-center p-4 sm:p-8'>
      <div className='bg-white rounded-lg p-6 w-full max-w-4xl transition-all duration-300 ease-in-out transform '>
        <h1 className='text-3xl font-bold text-center mb-8 text-customColorTertiaryDark'>
          Your Referral Program
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <div className='bg-customColorTertiarypop/20 rounded-lg p-6 transition-all duration-300 ease-in-out transform hover:shadow-md'>
              <p className='text-lg text-customColorTertiary mb-2 font-semibold'>
                Your Referral Code
              </p>
              <div className='flex items-center justify-between bg-white rounded border-2 border-indigo-200 p-3'>
                <span className='text-2xl font-mono font-bold text-customColorTertiary'>
                  {referralCode}
                </span>
                <button
                  onClick={copyToClipboard}
                  className='text-indigo-500 hover:text-indigo-700 transition-colors duration-200 focus:outline-none'
                >
                  {copied ? (
                    <CheckCircle className='h-6 w-6 animate-pulse' />
                  ) : (
                    <Copy className='h-6 w-6 hover:scale-110 transition-transform duration-200' />
                  )}
                </button>
              </div>
            </div>

            <div className='space-y-4'>
              <p className='text-lg font-semibold text-gray-700'>
                Sharing Progress
              </p>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Invites Sent</span>
                <span className='font-semibold text-customColorTertiary'>
                  {currentShares} / {sharingLimit}
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5'>
                <div
                  className='bg-customColorTertiary h-2.5 rounded-full transition-all duration-1000 ease-out'
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='bg-green-50 rounded-lg p-6 transition-all duration-300 ease-in-out transform hover:shadow-md'>
              <p className='text-lg font-semibold text-green-700 mb-4'>
                Referral Rewards
              </p>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-green-600'>You Get</span>
                  <span className='text-xl font-bold text-green-700'>
                    ${yourCreditAmount}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-green-600'>
                    Your Friend Gets
                  </span>
                  <span className='text-xl font-bold text-green-700'>
                    ${friendCreditAmount}
                  </span>
                </div>
              </div>
            </div>

            <div className='bg-yellow-50 rounded-lg p-6 transition-all duration-300 ease-in-out transform hover:shadow-md'>
              <p className='text-lg font-semibold text-yellow-700 mb-4'>
                How It Works
              </p>
              <ul className='list-disc list-inside space-y-2 text-sm text-gray-600'>
                <li>Share your unique code with friends</li>
                <li>They get ${friendCreditAmount} when they sign up</li>
                <li>
                  You get ${yourCreditAmount} when they make their first
                  purchase
                </li>
                <li>
                  Invite up to {sharingLimit} friends for maximum rewards!
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='mt-8'>
          <button className='w-full bg-customColorTertiary hover:bg-customColorTertiaryLight text-white text-lg py-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50'>
            <Share2 className='inline-block mr-2 h-5 w-5' /> Share Your Code Now
          </button>
        </div>

        <p className='text-sm text-gray-500 text-center mt-6'>
          Start sharing and watch your rewards grow! The more friends you
          invite, the more you both earn.
        </p>
      </div>
    </div>
  )
}
