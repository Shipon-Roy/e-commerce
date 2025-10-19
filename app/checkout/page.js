"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const placeOrderCOD = async (e) => {
    e.preventDefault();
    if (!address) return alert("Delivery address den");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart,
          totalPrice: total,
          paymentMethod: "COD",
          address,
        }),
      });

      if (res.ok) {
        clearCart();
        router.push("/order-success");
      } else {
        const text = await res.text();
        alert("Order failed: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Checkout — Cash on Delivery</h1>
      <form onSubmit={placeOrderCOD} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Delivery Address</span>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            rows={4}
          />
        </label>

        <div className="text-right font-semibold">Total: ${total}</div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Placing order..." : "Place Order (COD)"}
        </button>
      </form>
    </div>
  );
}
