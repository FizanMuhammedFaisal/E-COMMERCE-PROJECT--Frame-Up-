import { useEffect, useState } from 'react'

function useSessionTimeout() {
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    const handleSessionTimeout = () => {
      setSessionExpired(true)
    }

    window.addEventListener('sessionTimeout', handleSessionTimeout)

    return () => {
      window.removeEventListener('sessionTimeout', handleSessionTimeout)
    }
  }, [])

  return { sessionExpired }
}

export default useSessionTimeout
