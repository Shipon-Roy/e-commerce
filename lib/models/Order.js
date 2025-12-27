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
    extra: { type: String, default: "" }, // ✅ Extra notes
  },
  items: [
    {
      product: {
        _id: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
      size: { type: String },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  // ✅ CRITICAL: These were MISSING!
  subtotal: { type: Number, required: true, min: 0 }, // Items total
  shippingCost: { type: Number, required: true, min: 0 }, // 80/130
  totalPrice: { type: Number, required: true, min: 0 }, // subtotal + shipping
  paymentMethod: { type: String, default: "COD", enum: ["COD"] },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Confirmed", "Delivered"],
  },
  isPaid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Indexes for performance
OrderSchema.index({ "customer.phone": 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
