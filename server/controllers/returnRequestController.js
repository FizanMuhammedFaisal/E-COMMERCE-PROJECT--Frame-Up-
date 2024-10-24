import asyncHandler from 'express-async-handler'
import Return from '../models/returnModel.js'
import Order from '../models/orderModel.js'
import Wallet from '../models/walletModel.js'
const createReturnRequest = asyncHandler(async (req, res, next) => {
  const { orderId, reason } = req.body
  if (!orderId || !reason) {
    const error = new Error('Order ID and reason are required')
    error.statusCode = 400
    return next(error)
  }

  const order = await Order.findById(orderId)

  if (!order) {
    const error = new Error('Order not found')
    error.statusCode = 404
    return next(error)
  }
  order.orderStatus = 'Return Initialized'
  await order.save()
  const returnRequest = await Return.create({
    orderId,
    userId: req.user.id,
    reason,
    requestedAt: Date.now()
  })

  res.status(201).json({
    message: 'Return request submitted successfully',
    returnRequest
  })
})
const updateReturnRequest = asyncHandler(async (req, res, next) => {
  const { orderId, newStatus } = req.body
  console.log(req.body)
  const user = req.user._id
  if (!orderId || !user || !newStatus) {
    const error = new Error('Cannot update Request')
    error.statusCode = 400
    return next(error)
  }
  try {
    const returnRequest = await Return.findOne({ orderId })
    console.log(returnRequest)
    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found' })
    }

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    if (
      order.orderStatus === 'Return Accepted' ||
      order.orderStatus === 'Return Rejected'
    ) {
      const error = new Error('Return Request Already Setteled')
      error.statusCode = 400
      return next(error)
    }
    if (newStatus === 'Accept') {
      returnRequest.status = 'Approved'
    } else if (newStatus === 'Reject') {
      returnRequest.status = 'Rejected'
    } else {
      const error = new Error('Error updating the Request Status')
      error.statusCode = 400
      return next(error)
    }

    if (newStatus === 'Accept') {
      let wallet = await Wallet.findOne({ userId: order.userId })

      if (!wallet) {
        wallet = new Wallet({
          userId: order.userId,
          balance: 0,
          transactions: []
        })
      }
      wallet.balance += order.subtotal
      wallet.transactions.push({
        type: 'refund',
        amount: order.subtotal,
        description: `Refund for order ${order._id}`
      })
      order.orderStatus = 'Return Accepted'

      await wallet.save()
    } else if (newStatus === 'Reject') {
      order.orderStatus = 'Return Rejected'
    }

    await returnRequest.save()
    await order.save()

    res.status(200).json({ message: `Return request ${newStatus}` })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error processing the request', error: error.message })
  }
})

export { createReturnRequest, updateReturnRequest }
