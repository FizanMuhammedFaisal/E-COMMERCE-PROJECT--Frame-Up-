const validataImages = files => {
  const validFormats = ['image/jpg', 'image/png', 'image/jpeg', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  const errors = []
  const validFiles = []
  //
  files.forEach(file => {
    if (!validFormats.includes(file.type)) {
      errors.push(
        'Invalid format for ${file.name}. Only JPG ,WEBP, JPEG and PNG  are allowed.'
      )
    } else if (file.size > maxSize) {
      errors.push(`${file.name} exceeds 10MB. Please upload a smaller image.`)
    } else {
      validFiles.push(file) // If valid, push to valid files
    }
  })
  return {
    isValid: errors.length === 0,
    errors,
    validFiles //arrays of files
  }
}
export default validataImages
