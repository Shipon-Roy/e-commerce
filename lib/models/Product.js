import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: String,
    images: [ImageSchema], // multiple images
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
