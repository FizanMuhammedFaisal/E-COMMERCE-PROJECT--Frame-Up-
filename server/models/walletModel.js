import mongoose from "mongoose"

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ["credit", "order", "refund"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      description: String,
    },
  ],
})

const Wallet = mongoose.model("Wallet", walletSchema)
export default Wallet
