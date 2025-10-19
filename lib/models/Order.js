import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },

  items: [
    {
      product: Object,
      quantity: Number,
    },
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, default: "COD" },
  status: { type: String, default: "Pending" },
  isPaid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
