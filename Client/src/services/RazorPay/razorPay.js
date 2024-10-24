import apiClient from '../api/apiClient'

export const handleRazorPaySuccess = async orderData => {
  console.log(orderData)
  return new Promise((resolve, reject) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount, // In paise
      currency: 'INR',
      order_id: orderData.razorpayOrderId,
      handler: async response => {
        try {
          const verificationResult = await verifyPayment(
            response,
            orderData.orderId
          )
          if (verificationResult.success) {
            resolve({ success: true })
          } else {
            reject(new Error('Payment verification failed.'))
          }
        } catch (error) {
          reject(new Error('Error verifying payment.'))
        }
      },
      modal: {
        ondismiss: () => {
          reject(new Error('Payment process interrupted.'))
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  })
}

const verifyPayment = async (paymentResponse, orderId) => {
  console.log(orderId)
  const res = await apiClient.post('/api/order/verify-payment', {
    paymentResponse,
    orderId
  })

  if (res.status !== 200) {
    throw new Error('Payment verification failed')
  }
  return res.data
}
