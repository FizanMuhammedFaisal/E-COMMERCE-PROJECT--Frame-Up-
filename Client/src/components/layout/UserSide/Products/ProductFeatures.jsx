export default function ProductFeatures({ features }) {
  return (
    <div className='bg-white'>
      <div className='mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            Details
          </h2>
          <p className='mt-4 text-gray-500'>{features.productDescription}</p>

          <div className='mt-16'>
            {/* Display additional product features */}
            {features.dimensions && (
              <p className='mt-2 text-sm text-gray-500'>
                <strong>Dimensions:</strong> {features.dimensions}
              </p>
            )}
            {features.weight && (
              <p className='mt-2 text-sm text-gray-500'>
                <strong>Weight:</strong> {features.weight} kg
              </p>
            )}
            {features.productCategories &&
              features.productCategories.length > 0 && (
                <div className='mt-2 text-sm text-gray-500'>
                  <strong>Categories:</strong>{' '}
                  {features.productCategories &&
                  features.productCategories.length > 0 ? (
                    <ul>
                      {features.productCategories.map((category, index) => (
                        <li key={category._id || index}>{category.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <div>No categories available</div>
                  )}
                </div>
              )}
            {features.stock !== undefined && (
              <p className='mt-2 text-sm text-gray-500'>
                <strong>Stock:</strong> {features.stock}
              </p>
            )}
            {features.createdAt && (
              <p className='mt-2 text-sm text-gray-500'>
                <strong>Listed At:</strong>{' '}
                {new Date(features.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8'>
          {features.productImages.map((img, i) => (
            <img
              key={i}
              alt={`Product Image ${i + 1}`}
              src={img}
              className='rounded-lg bg-gray-100'
            />
          ))}
        </div>
      </div>
    </div>
  )
}
