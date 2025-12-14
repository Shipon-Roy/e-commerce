"use client";
import { useCart } from "../context/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Add to Cart
    </button>
  );
}
