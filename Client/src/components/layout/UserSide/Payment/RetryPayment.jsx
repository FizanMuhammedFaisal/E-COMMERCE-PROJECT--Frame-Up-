import { motion } from 'framer-motion'
import { CreditCard, Package } from 'lucide-react'
import Spinner from '../../../common/Animations/Spinner'

export default function RetryPayment({
  orderDetails,
  loading,
  onRetryPayment
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='bg-white shadow-lg rounded-lg overflow-hidden'
    >
      <div className='p-6 space-y-6'>
        <div>
          <h2 className='text-xl font-semibold mb-4 flex items-center'>
            <CreditCard className='w-6 h-6 mr-2 text-customborder-customColorTertiarypop' />
            Payment Details
          </h2>
          <div className='bg-gray-50 p-4 rounded-md'>
            <p className='font-medium text-gray-800'>
              Amount Due: ${orderDetails.totalAmount.toFixed(2)}
            </p>
            <p className='text-gray-600'>
              Payment Method: {orderDetails.paymentMethod}
            </p>
            <p className='text-gray-600'>
              Order Status: {orderDetails.orderStatus}
            </p>
            <p className='text-gray-600'>
              Payment Status: {orderDetails.paymentStatus}
            </p>
          </div>
        </div>
        <div>
          <h2 className='text-xl font-semibold mb-4 flex items-center'>
            <Package className='w-6 h-6 mr-2 text-customborder-customColorTertiarypop' />
            Order Summary
          </h2>
          <div className='space-y-4'>
            {orderDetails.items.map((item, index) => (
              <div key={index} className='flex justify-between items-center'>
                <span className='text-gray-600'>
                  {item.productName} (x{item.quantity})
                </span>
                <span className='font-medium'>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className='border-t border-gray-200 pt-4 space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Subtotal</span>
                <span className='font-medium'>
                  ${orderDetails.subtotal.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Shipping</span>
                <span className='font-medium'>
                  ${orderDetails.shippingCost.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Tax</span>
                <span className='font-medium'>
                  ${orderDetails.taxAmount.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between items-center text-green-600'>
                <span>Total Discount</span>
                <span>-${orderDetails.discount.toFixed(2)}</span>
              </div>
            </div>
            <div className='border-t border-gray-200 pt-4 flex justify-between items-center'>
              <span className='text-lg font-semibold'>Total</span>
              <span className='text-lg font-semibold'>
                ${orderDetails.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
        <button
          onClick={onRetryPayment}
          className='w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-customColorTertiary hover:bg-customColorTertiaryLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customborder-customColorTertiarypop transition-colors'
          disabled={loading}
        >
          {loading ? (
            <span className='flex items-center justify-center'>
              <Spinner size={-1} />
              <p className='ml-2'>Processing...</p>
            </span>
          ) : (
            'Retry Payment'
          )}
        </button>
      </div>
    </motion.div>
  )
}
