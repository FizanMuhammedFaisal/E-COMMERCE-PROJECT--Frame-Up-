import React, { useRef, useState, useEffect } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

const ImageCropper = ({ open, onClose, initialImage, onCropComplete }) => {
  const cropperRef = useRef(null)
  const [aspectRatio, setAspectRatio] = useState(null)
  const [rotation, setRotation] = useState(0)
  const image = initialImage || null
  function base64ToFile(base64String, filename) {
    const [header, data] = base64String.split(',')
    const mimeString = header.split(':')[1].split(';')[0]

    const binaryString = atob(data)
    const arrayBuffer = new ArrayBuffer(binaryString.length)
    const uint8Array = new Uint8Array(arrayBuffer)

    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i)
    }

    const blob = new Blob([uint8Array], { type: mimeString })
    return new File([blob], filename, { type: mimeString })
  }

  useEffect(() => {
    if (image && image.url) {
      const img = new Image()
      img.onload = () => {
        setAspectRatio(img.width / img.height)
      }
      img.src = image.url
    }
  }, [image])

  const handleCrop = () => {
    if (cropperRef.current) {
      // Get cropped canvas
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas()

      // Convert canvas to JPEG format with specified quality
      const croppedImageBase64 = cropperRef.current.cropper
        .getCroppedCanvas()
        .toDataURL('image/jpeg', 0.9)

      const fileName = `cropped-image-${Date.now()}.jpeg`
      const file = base64ToFile(croppedImageBase64, fileName)

      // Pass the cropped image to the parent component via callback
      if (onCropComplete) {
        onCropComplete({
          image: file,
          type: image.type,
          index: image.currentIndex,
          DBError: image.DBError,
          id: image.id
        })
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
    <div className='fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center'>
      <div className='bg-white dark:bg-customP2ForegroundD_200 dark:text-slate-50 p-6 rounded-lg w-full max-w-3xl md:max-w-2xl sm:max-w-full'>
        {image && (
          <Cropper
            src={image.url}
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
          className='text-black'
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
            className='px-4 py-2 bg-customP2Primary text-white rounded-md duration-300 hover:bg-customP2BackgroundD_500'
          >
            Crop Image
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper
