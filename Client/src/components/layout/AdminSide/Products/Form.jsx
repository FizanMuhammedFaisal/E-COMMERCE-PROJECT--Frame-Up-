import { CircularProgress } from '@mui/material'
import CategorySelect from '../../../common/CategorySelect'
import ImageCarousel from '../../../common/ImageCarousel'
import ArtistSelect from '../../../common/ArtistSelect'
import Spinner from '../../../common/Animations/Spinner'

function Form({
  handleSubmit,
  formData,
  handleChange,
  errorMessages,
  loadingImages,
  loadingThumbnail,
  handleDeleteImage,
  handleCategoryChange,
  handleImageEdit,
  productImages,
  thumbnailImage,
  DBError,
  loading
}) {
  return (
    <div>
      {' '}
      <form onSubmit={handleSubmit} className='space-y-6 '>
        {/* Product Information Section */}
        <div className='bg-white p-6 rounded-lg w-full space-y-6  dark:bg-customP2BackgroundD_darkest dark:text-white'>
          <h2 className='text-2xl  font-semibold my-3'>Product Information</h2>

          {/* Product Name */}
          <div className='flex flex-col'>
            <label
              htmlFor='productName'
              className='dark:text-slate-200 text-slate-900 mb-2 font-medium '
            >
              Product Name
            </label>

            <input
              type='text'
              id='productName'
              value={formData.productName}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
              placeholder='Enter product name'
            />
            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.productName}
                </p>
              )}
            </div>
          </div>

          {/* Product Price */}
          <div className='flex flex-col'>
            <label
              htmlFor='productPrice'
              className='dark:text-slate-200 text-slate-900 mb-2 font-medium'
            >
              Product Price
            </label>
            <input
              type='number'
              id='productPrice'
              value={formData.productPrice}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
              placeholder='Enter product price'
            />
            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.productPrice}
                </p>
              )}
            </div>
          </div>
          {/* product discounded price */}
          <div className='flex flex-col'>
            <label
              htmlFor='discountPrice'
              className='dark:text-slate-200 text-slate-900 mb-2 font-medium'
            >
              Product Discount Price
            </label>
            <input
              type='number'
              id='discountPrice'
              value={formData.discountPrice}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
              placeholder='Enter product Discount price'
            />
            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.discountPrice}
                </p>
              )}
            </div>
          </div>
          <div className='flex flex-col'>
            <label
              htmlFor='productYear'
              className='dark:text-slate-200 text-slate-900 mb-2 font-medium'
            >
              Product Year
            </label>
            <input
              type='number'
              id='productYear'
              value={formData.productYear}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
              placeholder='Enter product year'
            />
            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.productYear}
                </p>
              )}
            </div>
          </div>
          <div className='flex flex-col'>
            <label
              htmlFor='productStock'
              className='dark:text-slate-200 text-slate-900 mb-2 font-medium'
            >
              Product Stock
            </label>
            <input
              type='number'
              id='productStock'
              value={formData.productStock}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
              placeholder='Enter product Stock'
            />
            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.productStock}
                </p>
              )}
            </div>
          </div>

          {/* Product Category */}
          <div className='flex flex-col'>
            <label
              htmlFor='productCategory'
              className='dark:text-slate-100 text-slate-900 mb-2 font-medium text-xl my-2'
            >
              Product Category
            </label>
            <div className='flex flex-col  gap-3 lg:flex-row sm:gap-4 w-full border p-4 py-4 rounded-xl border-gray-200 dark:border-customP2ForegroundD_400'>
              <div className='flex-1 dark:text-slate-200 text-slate-900 '>
                <p className='mb-2'>Themes</p>
                <CategorySelect
                  type='theme'
                  value={formData.productCategory.themes}
                  onChange={selectedOption => {
                    handleCategoryChange(selectedOption, 'themes')
                  }}
                  placeholder='Select categories...'
                />
              </div>
              <div className='flex-1 dark:text-slate-200 text-slate-900 '>
                <p className='mb-2'>Styles</p>
                <CategorySelect
                  type='style'
                  value={formData.productCategory.styles}
                  onChange={selectedOption => {
                    handleCategoryChange(selectedOption, 'styles')
                  }}
                  placeholder='Select categories...'
                />
              </div>
              <div className='flex-1 dark:text-slate-200 text-slate-900 '>
                <p className='mb-2'>Techniques</p>
                <CategorySelect
                  type='technique'
                  value={formData.productCategory.techniques}
                  onChange={selectedOption => {
                    handleCategoryChange(selectedOption, 'techniques')
                  }}
                  placeholder='Select categories...'
                />
              </div>
            </div>

            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.productCategory}
                </p>
              )}
            </div>
          </div>
          {/* product artist name */}
          <div className='flex flex-col'>
            <label
              htmlFor='productCategory'
              className='dark:text-slate-100 text-slate-900 mb-2 font-medium text-xl my-2'
            >
              Product Artist
            </label>
            <div className='flex flex-col  gap-3 lg:flex-row sm:gap-4 w-full border p-4 py-4 rounded-xl border-gray-200 dark:border-customP2ForegroundD_400'>
              <div className='flex-1 dark:text-slate-200 text-slate-900 '>
                <p className='mb-2'>Select Artist</p>
                <ArtistSelect />
              </div>
            </div>

            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.artistName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className='bg-white p-6 rounded-lg  space-y-4 dark:bg-customP2BackgroundD_darkest dark:text-white'>
          <h2 className='text-2xl  font-semibold'>Product Description</h2>
          <textarea
            id='productDescription'
            value={formData.productDescription}
            onChange={handleChange}
            rows='5'
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
            placeholder='Enter product description'
          ></textarea>
          <div className='pt-2 font-tertiary'>
            {errorMessages && (
              <p className='text-red-500 hover:text-red-300'>
                {errorMessages.productDescription}
              </p>
            )}
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg  space-y-4 dark:bg-customP2BackgroundD_darkest dark:text-white'>
          <h2 className='text-2xl  font-semibold'>About this artwork</h2>
          <textarea
            id='productInformation'
            value={formData.productInformation}
            onChange={handleChange}
            rows='5'
            className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
            placeholder='About the Art'
          ></textarea>
          {errorMessages && (
            <p className='text-red-500 hover:text-red-300'>
              {errorMessages.productInformation}
            </p>
          )}
        </div>

        <div className='bg-white p-8 rounded-lg  space-y-6 dark:bg-customP2BackgroundD_darkest dark:text-white'>
          <h2 className='text-2xl  font-semibold text-center mb-6'>
            Product and Thumbnail Images
          </h2>

          {/* Product Images Section */}
          <div className='space-y-4 border rounded-md p-4 border-gray-200 dark:border-customP2ForegroundD_400'>
            <p className='font-semibold text-lg'>
              Upload Multiple Product Images
            </p>

            {errorMessages.productImages && (
              <p className='text-red-500'>{errorMessages.productImages}</p>
            )}

            {/* Custom Button to Trigger File Input */}
            <div className='flex items-center justify-between'>
              <button
                type='button'
                disabled={loadingImages}
                className={`${
                  loadingImages
                    ? 'bg-gray-400'
                    : 'bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500'
                } text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={() => document.getElementById('productImages').click()}
              >
                {formData.productImages.length > 0
                  ? 'Add More Images'
                  : 'Upload Images'}
              </button>

              {loadingImages && (
                <div className='flex items-center space-x-2'>
                  <p className='text-cusbg-customP2Primary'>Uploading...</p>
                  <CircularProgress color='primary' size={25} />
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type='file'
              id='productImages'
              multiple
              accept='image/jpeg, image/png,image/webp'
              className='hidden'
              onChange={handleChange}
            />

            {/* Display uploaded product images */}
            <div className='flex gap-4 flex-wrap justify-center mt-4'>
              {Array.isArray(productImages) && productImages.length > 0 && (
                <ImageCarousel
                  imageIds={productImages}
                  onDelete={handleDeleteImage}
                  onEdit={handleImageEdit}
                  type={'productImages'}
                  DBError={DBError}
                />
              )}
            </div>
          </div>

          {/* Divider */}
          <hr className='border-gray-200 dark:border-customP2ForegroundD_400 my-6' />

          {/* Thumbnail Image Section */}
          <div className='space-y-4  border rounded-md border-gray-200 p-4 dark:border-customP2ForegroundD_400'>
            <p className='font-semibold text-lg'>Upload Thumbnail Image</p>
            {errorMessages.thumbnailImage && (
              <p className='text-red-500'>{errorMessages.thumbnailImage}</p>
            )}
            {/* Custom Button for Thumbnail */}
            <div className='flex items-center justify-between'>
              <button
                type='button'
                disabled={loadingThumbnail}
                className={`${
                  loadingThumbnail
                    ? 'bg-gray-400'
                    : 'bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500'
                } text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={() =>
                  document.getElementById('thumbnailImage').click()
                }
              >
                {thumbnailImage && thumbnailImage.length > 0
                  ? 'Change Thumbnail Image'
                  : 'Upload Thumbnail Image'}
              </button>
              {loadingThumbnail && (
                <div className='flex items-center space-x-2'>
                  <p className='text-cusbg-customP2Primary'>Uploading...</p>
                  <CircularProgress color='primary' size={25} />
                </div>
              )}
            </div>

            {/* Hidden Thumbnail Input */}
            <input
              type='file'
              accept='image/jpeg, image/png,image/webp'
              id='thumbnailImage'
              className='hidden'
              onChange={handleChange}
            />

            {/* Display uploaded thumbnail image */}
            <div className='flex gap-4 justify-center mt-4'>
              {Array.isArray(thumbnailImage) && thumbnailImage.length > 0 && (
                <ImageCarousel
                  imageIds={thumbnailImage}
                  onDelete={handleDeleteImage}
                  onEdit={handleImageEdit}
                  type={'thumbnailImage'}
                  DBError={DBError}
                />
              )}
            </div>
          </div>
        </div>

        {/* Shipping Details Section */}
        <div className='bg-white p-6 rounded-lg  space-y-4 dark:bg-customP2BackgroundD_darkest dark:text-white'>
          <h2 className='text-xl  font-semibold'>Shipping Details</h2>
          <div className='flex flex-col'>
            <label
              htmlFor='weight'
              className='dark:text-slate-200 text-slate-900 mb-2 font-medium'
            >
              Weight (kg)
            </label>
            <input
              type='number'
              id='weight'
              value={formData.weight}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
              placeholder='Enter product weight'
            />
            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.weight}
                </p>
              )}
            </div>
          </div>
          <div className='flex flex-col'>
            <label
              htmlFor='dimensions'
              className='dark:text-slate-200 text-slate-900 mb-2 font-medium'
            >
              Dimensions (cm)
              <p className='dark:text-slate-300 text-slate-800 font-light'>
                {' '}
                format: width x height x depth (e.g., 10x20x30)
              </p>
            </label>
            <input
              type='text'
              id='dimensions'
              value={formData.dimensions}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50'
              placeholder='Enter product dimensions'
            />
            <div className='pt-2 font-tertiary'>
              {errorMessages && (
                <p className='text-red-500 hover:text-red-300'>
                  {errorMessages.dimensions}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className='mt-8 text-center'>
          <button
            type='submit'
            className={`${': bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500'} text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-95 disabled:cursor-not-allowed`}
            disabled={loadingImages || loadingThumbnail || loading}
          >
            <div className='flex gap-2'>
              {loading ? <Spinner size={1} /> : ''}
              Add Product
            </div>
          </button>
        </div>
        <div>
          {/* <div className='col-span-full'>
      <label
        htmlFor='cover-photo'
        className='block text-sm font-medium leading-6 text-gray-900'
      >
        Cover photo
      </label>
      <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
        <div className='text-center'>
          <div className='mt-4 flex text-sm leading-6 text-gray-600'>
            <label
              htmlFor='file-upload'
              className='relative cursor-pointer rounded-md bg-white  font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500'
            >
              <span>Upload a file</span>
              <input
                id='file-upload'
                name='file-upload'
                type='file'
                className='sr-only'
              />
            </label>
            <p className='pl-1'>or drag and drop</p>
          </div>
          <p className='text-xs leading-5 text-gray-600'>
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>
    </div> */}
        </div>
      </form>
    </div>
  )
}

export default Form
