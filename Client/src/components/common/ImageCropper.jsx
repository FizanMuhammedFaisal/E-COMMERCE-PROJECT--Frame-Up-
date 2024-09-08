// import React, { useRef, useState } from 'react'
// import Cropper from 'react-cropper'
// import 'cropperjs/dist/cropper.css'

// const ImageCropper = ({ open, onClose }) => {
//   const cropperRef = useRef(null)
//   const [image, setImage] = useState(null)
//   const [aspectRatio, setAspectRatio] = useState(null) // To store the aspect ratio

//   const onImageChange = e => {
//     const files = e.target.files
//     if (files && files.length > 0) {
//       const reader = new FileReader()
//       reader.onload = () => {
//         setImage(reader.result)
//         const img = new Image()
//         img.onload = () => {
//           // Set initial aspect ratio based on image dimensions
//           setAspectRatio(img.width / img.height)
//         }
//         img.src = reader.result
//       }
//       reader.readAsDataURL(files[0])
//     }
//   }

//   const handleCrop = () => {
//     if (cropperRef.current) {
//       const croppedImage = cropperRef.current.cropper
//         .getCroppedCanvas()
//         .toDataURL()
//       console.log(croppedImage) // Here you can handle the cropped image
//       onClose() // Close the modal or perform any other action
//     }
//   }

//   const changeAspectRatio = ratio => {
//     setAspectRatio(ratio)
//     // Ensure Cropper reflects the change immediately by using the cropper instance
//     if (cropperRef.current) {
//       cropperRef.current.cropper.setAspectRatio(ratio)
//     }
//   }

//   if (!open) return null

//   return (
//     <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center'>
//       <div className='bg-white p-6 rounded-lg w-full max-w-3xl'>
//         <input
//           type='file'
//           accept='image/*'
//           onChange={onImageChange}
//           className='mb-4'
//         />
//         {image && (
//           <Cropper
//             src={image}
//             style={{ height: 400, width: '100%' }}
//             aspectRatio={aspectRatio} // Dynamically set aspect ratio
//             guides={false}
//             zoomable={true}
//             scalable={true}
//             cropBoxResizable={true}
//             cropBoxMovable={true}
//             ref={cropperRef}
//             wheelZoomRatio={0.1}
//           />
//         )}
//         {/* Aspect Ratio Selection Buttons */}
//         <div className='flex justify-center mt-4 space-x-2'>
//           <button
//             onClick={() => changeAspectRatio(1)}
//             className='px-4 py-2 bg-gray-500 text-white rounded-md'
//           >
//             1:1
//           </button>
//           <button
//             onClick={() => changeAspectRatio(16 / 9)}
//             className='px-4 py-2 bg-blue-500 text-white rounded-md'
//           >
//             16:9
//           </button>
//           <button
//             onClick={() => changeAspectRatio(4 / 3)}
//             className='px-4 py-2 bg-green-500 text-white rounded-md'
//           >
//             4:3
//           </button>
//           <button
//             onClick={() => changeAspectRatio(null)}
//             className='px-4 py-2 bg-red-500 text-white rounded-md'
//           >
//             Free
//           </button>
//         </div>
//         {/* Action Buttons */}
//         <div className='mt-4 flex justify-end space-x-2'>
//           <button
//             onClick={onClose}
//             className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600'
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleCrop}
//             className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
//           >
//             Crop Image
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ImageCropper
