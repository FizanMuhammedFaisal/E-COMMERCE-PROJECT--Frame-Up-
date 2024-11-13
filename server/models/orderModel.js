import mongoose from "mongoose"

const itemsSchema = {
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnailImage: {
    type: [String],
    required: false,
  },
  discount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Return Initialized",
      "Return Accepted",
      "Return Rejected",
      "Return Completed",
    ],
    default: "Pending",
  },
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [itemsSchema],

    // Shipping address
    shippingAddress: {
      addressName: { type: String, required: true },
      name: { type: String, required: true },
      address: { type: String, required: true },
      locality: { type: String },
      city: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["Wallet", "Razor Pay", "Cash on Delivery"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
      required: true,
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Return Initialized",
        "Return Accepted",
        "Return Rejected",
        "Return Processing",
        "Partially Returned",
        "Return Completed",
      ],
      default: "Pending",
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    cancelledAmount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
    },
    couponAmount: {
      type: Number,
      default: 0,
    },

    razorpayOrderId: {
      type: String,
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

const Order = mongoose.model("Order", orderSchema)
export default Order
