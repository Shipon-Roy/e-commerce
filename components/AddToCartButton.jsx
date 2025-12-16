"use client";
import { useCart } from "../context/CartContext";

export default function AddToCartButton({ product, selectedSize }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    addToCart({
      ...product,
      selectedSize, // ✅ size attach
    });
  };

  return (
    <button
      onClick={handleAdd}
      className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg w-full sm:w-auto"
    >
      Add to Cart
    </button>
  );
}
