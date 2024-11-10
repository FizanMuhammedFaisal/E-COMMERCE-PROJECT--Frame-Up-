import { useState, useEffect } from 'react'
import api from '../../../services/api/api'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import CircularProgress from '@mui/material/CircularProgress'
import { setUser } from '../../../redux/slices/authSlice'
import { useDispatch } from 'react-redux'

function UserOTPPage() {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const to = query.get('to') || 'signup'
  const navigate = useNavigate()
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(60)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
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
      if (to === 'signup') {
        const response = await api.post(
          '/users/send-otp',
          {},
          {
            headers: { 'x-session-token': token }
          }
        )
      } else {
        const response = await api.post(
          '/users/send-reset-otp',
          {},
          {
            headers: { 'x-session-token': token }
          }
        )
      }
      setOtpSent(true)
      setTimer(60)
    } catch (error) {
      const responseError = error?.response?.data?.message || error.message
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        console.log('asdf')
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
    const trimmedOtp = otp.trim()

    if (!/^\d{6}$/.test(trimmedOtp)) {
      setError('OTP must be a 6-digit number')
      return
    }
    setLoading(true)
    try {
      const token = sessionStorage.getItem('x-timer')
      if (!token) {
        toast.error('No session Token,Try again')
        setTimeout(() => {
          navigate('/signup', { replace: true })
        }, 2000)
        return
      }
      if (to === 'signup') {
        const res = await api.post(
          '/users/verify-otp',
          { otp },
          {
            headers: { 'x-session-token': token }
          }
        )
        if (res.status === 201) {
          const data = {
            user: res.data._id,
            role: res.data.role,
            status: res.data.status,
            accessToken: res.data.accessToken
          }
          navigate('/set-up', { replace: true })
          dispatch(setUser(data))
        }
      } else {
        const res = await api.post(
          '/users/verify-reset-otp',
          { otp },
          {
            headers: { 'x-session-token': token }
          }
        )
        if (res.status === 200) {
          navigate('/reset-password')
        }
      }
    } catch (error) {
      const responseError = error?.response?.data?.message || error.message
      setError(responseError)
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        if (to === 'signup') {
          toast.error('Timeout, Try Signing in again')
          setTimeout(() => {
            navigate('/signup', { replace: true })
          }, 2000)
        } else {
          toast.error('Timeout, Try again')
          setTimeout(() => {
            navigate('/forgot-password', { replace: true })
          }, 2000)
        }
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
    if (timer > 0 && otpSent) {
      countdown = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1)
      }, 1000)
    }
    return () => clearInterval(countdown)
  }, [timer, otpSent])

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
          className='bg-customColorTertiary text-white p-3 rounded-md hover:bg-customColorTertiaryLight duration-200 w-full max-w-md'
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
              className='w-full p-2  border border-customBorder  text-gray-900  focus:outline-none focus:ring-2 focus:ring-customColorTertiarypop focus:border-customColorSecondary transition ease-in-out duration-300  placeholder-opacity-75'
            />
            <button
              onClick={handleVerifyOTP}
              className='bg-customColorTertiary ml-2 text-white p-3 rounded-md hover:bg-customColorTertiaryLight w-full md:w-auto'
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
