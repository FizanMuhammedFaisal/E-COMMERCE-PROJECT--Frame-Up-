function SessionTimeoutOverlay() {
  const handleLogin = () => {
    window.location.href = '/login'
  }
  return (
    <>
      <div className='fixed inset-0 flex items-center justify-center font-primary bg-black bg-opacity-60 z-10 backdrop-blur-sm'>
        <div className='bg-customP2BackgroundW p-8 rounded-lg shadow-lg text-center max-w-sm mx-auto'>
          <h2 className='text-2xl font-semibold text-red-600'>
            Session Expired
          </h2>
          <p className='mt-4 text-gray-700'>
            Your session has expired. Please log in again to continue.
          </p>
          <button
            onClick={handleLogin}
            className='mt-6 px-4 py-2 font-tertiary font-semibold bg-customColorTertiary text-white  hover:bg-customColorPrimary duration-300 hover:text-black'
          >
            Log In
          </button>
        </div>
      </div>
    </>
  )
}

export default SessionTimeoutOverlay
