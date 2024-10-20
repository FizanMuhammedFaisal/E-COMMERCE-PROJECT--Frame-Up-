import { useRef, useState, useEffect } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import Spinner from './Animations/Spinner'
import { Crop, RotateCcw, RotateCw, X, AlertCircle } from 'lucide-react'

const ImageCropper = ({
  open,
  onClose,
  initialImage,
  onCropComplete,
  imageLoading,
  error
}) => {
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
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas()
      const croppedImageBase64 = cropperRef.current.cropper
        .getCroppedCanvas()
        .toDataURL('image/webp', 0.8)

      const fileName = `cropped-image-${Date.now()}.webp`
      const file = base64ToFile(croppedImageBase64, fileName)

      if (onCropComplete) {
        onCropComplete({
          image: file,
          type: image.type,
          index: image.currentIndex,
          DBError: image.DBError,
          id: image.id
        })
      }
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
    <div className='fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden'>
        <div className='p-6 relative'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1'
          >
            <X size={24} />
          </button>
          <h2 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white'>
            Crop Image
          </h2>
          {image && (
            <div className='mb-6 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg'>
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
            </div>
          )}
          <div className='space-y-4'>
            <div className='flex flex-wrap justify-center gap-2'>
              {[
                { ratio: 1, label: '1:1' },
                { ratio: 16 / 9, label: '16:9' },
                { ratio: 4 / 3, label: '4:3' },
                { ratio: null, label: 'Free' }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => changeAspectRatio(item.ratio)}
                  className='px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50'
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className='flex justify-center gap-2'>
              <button
                onClick={() => rotateImage(-90)}
                className='px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 flex items-center'
              >
                <RotateCcw size={18} className='mr-2' />
                Rotate Left
              </button>
              <button
                onClick={() => rotateImage(90)}
                className='px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 flex items-center'
              >
                <RotateCw size={18} className='mr-2' />
                Rotate Right
              </button>
            </div>
          </div>
        </div>
        {error && (
          <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 dark:bg-red-900 dark:text-red-100 mb-4'>
            <div className='flex items-center'>
              <AlertCircle size={24} className='mr-2' />
              <p>{error}</p>
            </div>
          </div>
        )}
        <div className='bg-gray-100 dark:bg-gray-700 px-6 py-4 flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center'
          >
            <X size={18} className='mr-2' />
            Cancel
          </button>
          <button
            onClick={handleCrop}
            disabled={imageLoading?.state}
            className={`px-6 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center ${
              imageLoading?.state
                ? 'bg-emerald-400 text-white cursor-not-allowed'
                : 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500'
            }`}
          >
            {imageLoading?.state ? (
              <div className='flex items-center justify-center space-x-2'>
                <Spinner size={-1} />
                <span>{imageLoading.message || 'Processing...'}</span>
                {imageLoading.progress && (
                  <span className='text-xs'>{imageLoading.progress}%</span>
                )}
              </div>
            ) : (
              <>
                <Crop size={18} className='mr-2' />
                Crop Image
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper
