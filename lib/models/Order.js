import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema({
  customer: {
    name: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      match: [
        /^(?:\+880|880|0)1[3-9]\d{8}$/,
        "Invalid Bangladeshi phone number",
      ],
    },
    address: { type: String, required: true },
    policeStation: { type: String, required: true },
    district: { type: String, required: true },
  },
  items: [
    {
      product: {
        _id: { type: Schema.Types.ObjectId, required: true }, // ✅ FIX
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
      size: { type: String },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, default: "COD" },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Processing", "Confirmed", "Delivered"],
  },

  isPaid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite in Next.js hot reload
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
