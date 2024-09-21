import React from 'react'

const reviews = [
  {
    name: 'Risako M',
    date: 'May 16, 2021',
    rating: 5,
    reviewTitle: "Can't say enough good things",
    reviewText: `I was really pleased with the overall shopping experience. My order even included a little personal, handwritten note, which delighted me!
    
    The product quality is amazing, it looks and feels even better than I had anticipated. Brilliant stuff! I would gladly recommend this store to my friends. And, now that I think of it... I actually have, many times!`
  },
  {
    name: 'Jackie H',
    date: 'April 6, 2021',
    rating: 5,
    reviewTitle: 'Very comfy and looks the part',
    reviewText: `After a quick chat with customer support, I had a good feeling about this shirt and ordered three of them.
    
    Less than 48 hours later, my delivery arrived. I haven't worn anything else since that day! These shirts are so comfortable, yet look classy enough that I can wear them at work or even some formal events. Winning!`
  },
  {
    name: 'Laura G',
    date: 'February 24, 2021',
    rating: 4,
    reviewTitle: 'The last shirts I may ever need',
    reviewText: `I bought two of those comfy cotton shirts, and let me tell you: they're amazing! I have been wearing them almost every day. Even after a dozen washes, that still looks and feels good as new. Will definitely order a few more... If I ever need to!`
  }
]

const ReviewCard = ({ review = {} }) => {
  const {
    name = 'Anonymous',
    date = '',
    rating = 0,
    reviewTitle = '',
    reviewText = ''
  } = review

  return (
    <div className='border-b border-gray-300 py-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='font-semibold text-lg'>{name}</h3>
          <p className='text-sm text-gray-500'>{date}</p>
        </div>
        <div className='flex items-center'>
          {Array.from({ length: rating }).map((_, i) => (
            <svg
              key={i}
              className='w-5 h-5 text-yellow-400'
              fill='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.27l-7.19-.61L12 2 9.19 8.66 2 9.27l5.46 4.7L5.82 21z' />
            </svg>
          ))}
        </div>
      </div>
      <div>
        <h4 className='font-semibold mt-2'>{reviewTitle}</h4>
        <p className='mt-2 text-gray-700'>{reviewText}</p>
      </div>
    </div>
  )
}

const ProductRatings = () => {
  return (
    <div className='max-w-full mx-20 p-8 bg-white shadow-md rounded-lg'>
      <h2 className='text-2xl font-semibold mb-6'>Recent Reviews</h2>
      {reviews.map((review, index) => (
        <ReviewCard key={index} review={review} />
      ))}
    </div>
  )
}

export default ProductRatings
