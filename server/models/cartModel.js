import mongoose from 'mongoose'
const Schema = mongoose.Schema
//cart item sub schema
const cartItemSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  },
  { _id: false }
)

const cartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  discount: {
    type: Number,
    default: 0.0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// for caluculating sub total
cartSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  )
  this.totalPrice = this.subtotal - this.discount
  next()
})

const Cart = mongoose.model('Cart', cartSchema)

export default Cart