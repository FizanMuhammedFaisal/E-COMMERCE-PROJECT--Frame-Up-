import React, { useRef, useState, useEffect } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

const ImageCropper = ({ open, onClose, initialImage, onCropComplete }) => {
  const cropperRef = useRef(null)
  const [aspectRatio, setAspectRatio] = useState(null)
  const [rotation, setRotation] = useState(0)
  const image = initialImage || null

  useEffect(() => {
    if (image) {
      const img = new Image()
      img.onload = () => {
        setAspectRatio(img.width / img.height)
      }
      img.src = image
    }
  }, [image])

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedImage = cropperRef.current.cropper
        .getCroppedCanvas()
        .toDataURL()

      // Pass the cropped image to the parent component via callback
      if (onCropComplete) {
        onCropComplete(croppedImage)
      }

      onClose() // Close the modal after cropping
    }
  }

  const changeAspectRatio = ratio => {
    setAspectRatio(ratio)
    if (cropperRef.current) {
      cropperRef.current.cropper.setAspectRatio(ratio)
    }
  }

  const rotateImage = degree => {
    setRotation(prevRotation => prevRotation + degree)
    if (cropperRef.current) {
      cropperRef.current.cropper.rotate(degree)
    }
  }

  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded-lg w-full max-w-3xl md:max-w-2xl sm:max-w-full'>
        {image && (
          <Cropper
            src={image}
            style={{ height: '400px', width: '100%' }}
            aspectRatio={aspectRatio}
            guides={false}
            zoomable={true}
            scalable={true}
            cropBoxResizable={true}
            cropBoxMovable={true}
            ref={cropperRef}
            wheelZoomRatio={0.1}
            rotatable={true}
          />
        )}
        <button
          onClick={() => {
            console.log(initialImage)
          }}
          className=' text-black'
        >
          fasf
        </button>
        <div className='flex justify-center mt-4 space-x-2'>
          <button
            onClick={() => changeAspectRatio(1)}
            className='px-4 py-2 bg-gray-500 text-white rounded-md'
          >
            1:1
          </button>
          <button
            onClick={() => changeAspectRatio(16 / 9)}
            className='px-4 py-2 bg-blue-500 text-white rounded-md'
          >
            16:9
          </button>
          <button
            onClick={() => changeAspectRatio(4 / 3)}
            className='px-4 py-2 bg-green-500 text-white rounded-md'
          >
            4:3
          </button>
          <button
            onClick={() => changeAspectRatio(null)}
            className='px-4 py-2 bg-red-500 text-white rounded-md'
          >
            Free
          </button>
        </div>

        <div className='flex justify-center mt-4 space-x-2'>
          <button
            onClick={() => rotateImage(-90)}
            className='px-4 py-2 bg-yellow-500 text-white rounded-md'
          >
            Rotate Left
          </button>
          <button
            onClick={() => rotateImage(90)}
            className='px-4 py-2 bg-yellow-500 text-white rounded-md'
          >
            Rotate Right
          </button>
        </div>

        <div className='mt-4 flex justify-end space-x-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600'
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
          >
            Crop Image
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper
