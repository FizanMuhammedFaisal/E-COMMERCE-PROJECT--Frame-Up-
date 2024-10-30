import { useEffect, useRef } from 'react'

function useDebounceFn(callback, delay) {
  const timerRef = useRef()
  const debouncedFunction = (...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [])

  return debouncedFunction
}

export { useDebounceFn }
