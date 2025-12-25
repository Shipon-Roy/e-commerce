"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function BuyNowButton({ product, selectedSize }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleBuyNow = () => {
    // size validation
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    // attach size to product
    addToCart({
      ...product,
      selectedSize,
    });

    // redirect to cart page
    router.push("/cart");
  };

  return (
    <button
      onClick={handleBuyNow}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg w-full sm:w-auto"
    >
      Buy Now
    </button>
  );
}
