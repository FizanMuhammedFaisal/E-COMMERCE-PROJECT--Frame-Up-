import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addressName: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    locality: { type: String },
    city: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const Address = mongoose.model('Address', addressSchema)
export default Address
