import asyncHandler from "express-async-handler"
import Wallet from "../models/walletModel.js"
import Razorpay from "razorpay"
import crypto from "crypto"
const getWallet = asyncHandler(async (req, res, next) => {
  const userId = req.user._id

  if (!userId) {
    const error = new Error("User not authenticated.")
    error.statusCode = 401
    return next(error)
  }

  let wallet = await Wallet.findOne({ userId })

  if (!wallet) {
    wallet = new Wallet({
      userId,
      balance: 0,
      transactions: [],
    })

    await wallet.save()
  }

  return res.status(200).json({
    message: "Wallet retrieved successfully",
    wallet: {
      balance: wallet.balance,
      transactions: wallet.transactions,
    },
  })
})
//
//
//for razor pay order intiating
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID,
  key_secret: process.env.RAZOR_PAY_KEY_SECRET,
})
const addMoney = asyncHandler(async (req, res, next) => {
  const { amount } = req.body
  const user = req.user
  const orderOptions = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${new Date().getTime()}`,
    payment_capture: 1,
  }
  console.log(user)
  try {
    const razorpayOrder = await razorpay.orders.create(orderOptions)
    res.status(200).json({
      data: {
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        name: user.username,
      },
    })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    res.status(500).json({ message: "Failed to create payment order" })
  }
})
//
//
const verifyAddMoney = asyncHandler(async (req, res, next) => {
  console.log("sdfasf")
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body.paymentResponse
  const user = req.user
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZOR_PAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex")
  console.log("Expected Signature:", expectedSignature)
  console.log("Received Signature:", razorpay_signature)

  const isSignatureValid = expectedSignature === razorpay_signature
  if (!isSignatureValid) {
    return res.status(400).json({ message: "Payment verification failed" })
  }
  const order = await razorpay.orders.fetch(razorpay_order_id)
  const amount = order.amount / 100
  const userId = user._id
  let wallet = await Wallet.findOne({ userId })

  if (!wallet) {
    wallet = new Wallet({
      userId: user.id,
      balance: 0,
      transactions: [],
    })
  }
  wallet.balance += amount

  wallet.transactions.push({
    type: "credit",
    amount,
    description: `Money added to wallet ${amount}`,
  })
  try {
    wallet.save()
    return res
      .status(200)
      .json({ success: true, message: "Amount added sucessfully", amount })
  } catch (err) {
    const error = new Error("Couldn't add amount")
    error.statusCode = 400
    return next(error)
  }
})
export { getWallet, addMoney, verifyAddMoney }
