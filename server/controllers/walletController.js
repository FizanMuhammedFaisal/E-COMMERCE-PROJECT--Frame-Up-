import asyncHandler from 'express-async-handler'
import Wallet from '../models/walletModel.js'
const getWallet = asyncHandler(async (req, res, next) => {
  const user = req.user

  if (!user) {
    const error = new Error('User not authenticated.')
    error.statusCode = 401
    return next(error)
  }

  let wallet = await Wallet.findOne({ userId: user.id })

  if (!wallet) {
    wallet = new Wallet({
      userId: user.id,
      balance: 0,
      transactions: []
    })

    await wallet.save()
  }

  return res.status(200).json({
    message: 'Wallet retrieved successfully',
    wallet: {
      balance: wallet.balance,
      transactions: wallet.transactions
    }
  })
})

export { getWallet }
