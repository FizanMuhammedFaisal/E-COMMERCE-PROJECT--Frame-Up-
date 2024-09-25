// components/SearchPopup.jsx
import React from 'react'

function SearchPopup({ isOpen, onClose }) {
  if (!isOpen) return null

  const handleBackdropClick = () => {
    // Close the popup when the backdrop is clicked
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black pl-12  bg-opacity-65 backdrop-blur-sm z-40 '
        onClick={handleBackdropClick}
      >
        {/* Modal */}
        <div className='fixed top-6 left-0 right-0 flex justify-center z-50 mt-4'>
          <div className='  relative' onClick={e => e.stopPropagation()}>
            <input
              type='text'
              placeholder='Search...'
              className='w-full  my-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-customColorSecondary'
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchPopup
