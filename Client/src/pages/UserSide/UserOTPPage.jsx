import React, { useState, useEffect } from 'react'
import api from '../../services/api/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CircularProgress from '@mui/material/CircularProgress'

function UserOTPPage() {
  const navigate = useNavigate()
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(60)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async () => {
    if (loading) return
    setError('')
    setOtp('')
    setLoading(true)

    const token = sessionStorage.getItem('x-timer')
    if (!token) {
      toast.error('No session Token')
      setTimeout(() => {
        navigate('/signup', { replace: true })
      }, 2000)
      return
    }

    try {
      const response = await api.post(
        '/users/send-otp',
        {},
        {
          headers: { 'x-session-token': token }
        }
      )
      console.log(response.data.message)
      setOtpSent(true)
      setTimer(60) // Reset timer to 60
    } catch (error) {
      const responseError = error?.response?.data?.message || error.message
      if (error?.response?.status === 401) {
        toast.error('Timeout, Try Signing in again')
        setTimeout(() => {
          navigate('/signup', { replace: true })
        }, 2000)
      } else {
        console.error('Error sending OTP:', responseError)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOTPChange = e => setOtp(e.target.value)

  const handleVerifyOTP = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be a 6-digit number')
      return
    }
    setLoading(true)
    try {
      const token = sessionStorage.getItem('x-timer')
      const res = await api.post(
        '/users/verify-otp',
        { otp },
        {
          headers: { 'x-session-token': token }
        }
      )
      if (res.status === 201) {
        navigate('/', { replace: true })
      }
    } catch (error) {
      const responseError = error?.response?.data?.message || error.message
      setError(responseError)
      if (error?.response?.status === 401) {
        toast.error('Timeout, Try Signing in again')
        setTimeout(() => {
          navigate('/signup', { replace: true })
        }, 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let countdown
    if (timer === 0) {
      setError('Your OTP has expired. Please request a new one.')
    }
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1)
      }, 1000)
    }
    return () => clearInterval(countdown)
  }, [timer])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      <h2 className='text-2xl font-bold mb-3 text-gray-800'>
        Confirm Your Email
      </h2>
      <p className='text-gray-600 text-center mb-6 max-w-md'>
        Please confirm that this is your correct email address. We will send an
        OTP to verify your account.
      </p>
      {error && <p className='text-red-500 mb-3'>{error}</p>}

      {!otpSent ? (
        <button
          onClick={handleSendOTP}
          className='bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 w-full max-w-md'
        >
          {loading ? (
            <CircularProgress size={24} color='inherit' />
          ) : (
            'Send OTP'
          )}
        </button>
      ) : (
        <>
          <div className='flex flex-col md:flex-row items-center mb-6 w-full max-w-md'>
            <input
              type='text'
              placeholder='Enter OTP'
              value={otp}
              onChange={handleOTPChange}
              className='p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 md:mb-0 md:mr-4 w-full'
            />
            <button
              onClick={handleVerifyOTP}
              className='bg-green-600 text-white p-3 rounded-md hover:bg-green-400 w-full md:w-auto'
            >
              Verify
            </button>
          </div>

          {timer > 0 ? (
            <p className='text-gray-600'>
              Resend OTP in <span className='font-bold'>{timer}</span> seconds
            </p>
          ) : (
            <button
              onClick={handleSendOTP}
              className='bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 w-full max-w-md'
            >
              {loading ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                'Resend OTP'
              )}
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default UserOTPPage
