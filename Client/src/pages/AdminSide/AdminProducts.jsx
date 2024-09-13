import React, { useState } from 'react'
import ImageCropper from '../../components/common/ImageCropper'

function AdminProducts() {
  const [cropperOpen, setCropperOpen] = useState(false) // Controls the modal visibility

  // Function to handle opening the cropper
  const handleOpenCropper = () => {
    setCropperOpen(true) // Show the cropper
  }

  // Function to handle closing the cropper
  const handleCloseCropper = () => {
    setCropperOpen(false) // Hide the cropper
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Upload & Crop Image</h1>

      {/* Button to trigger the cropper modal */}
      <button
        onClick={handleOpenCropper}
        className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
      >
        Upload and Crop Image
      </button>

      {/* ImageCropper Modal */}
      <ImageCropper
        open={cropperOpen} // Pass the open state
        onClose={handleCloseCropper} // Pass the function to close
      />
    </div>
  )
}

export default AdminProducts
