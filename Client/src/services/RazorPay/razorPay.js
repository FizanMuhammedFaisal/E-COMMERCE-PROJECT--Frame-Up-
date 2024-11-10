import apiClient from '../api/apiClient'

export const handleRazorPaySuccess = async (orderData, transactionType) => {
  console.log(orderData)
  return new Promise((resolve, reject) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: 'INR',
      order_id: orderData.razorpayOrderId,
      handler: async response => {
        try {
          const verificationResult = await verifyPayment(
            response,
            orderData.orderId,
            transactionType
          )
          if (verificationResult.success) {
            resolve(verificationResult)
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
      },
      name: 'Frame Up',
      description: 'Payment for your order',
      theme: {
        color: '#2B5D6E'
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  })
}

const verifyPayment = async (paymentResponse, orderId, transactionType) => {
  const endpoint =
    transactionType === 'addMoney'
      ? '/api/wallet/verify-add-money'
      : '/api/order/verify-payment'

  const res = await apiClient.post(endpoint, {
    paymentResponse,
    orderId
  })

  if (res.status !== 200) {
    throw new Error('Payment verification failed')
  }
  return res.data
}
