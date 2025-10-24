"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Container from "@/components/Container";
import OrderSuccess from "../order-success/page";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    addToCart,
  } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    paymentMethod: "COD",
  });
  const [relatedProducts, setRelatedProducts] = useState([]);

  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  useEffect(() => {
    const fetchRelated = async () => {
      if (cart.length === 0) return;
      const category = cart[0].product.category;
      if (!category) return;

      const res = await fetch(`/api/products?category=${category}`);
      const data = await res.json();

      const filtered = data.filter(
        (p) => !cart.some((c) => String(c.product._id) === String(p._id))
      );

      setRelatedProducts(filtered.slice(0, 4));
    };

    fetchRelated();
  }, [cart]);

  const handleOrderConfirm = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          totalPrice: total,
          customer: form,
          paymentMethod: form.paymentMethod,
        }),
      });
      if (res.ok) {
        clearCart();
        setOrderPlaced(true);
        setShowModal(false);
      } else console.error("Order failed");
    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  if (orderPlaced) {
    return <OrderSuccess />;
  }

  return (
    <Container>
      <div className="min-h-screen bg-gray-800 rounded shadow p-4 md:p-6 my-10">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          Your Order
        </h1>

        {cart.length === 0 ? (
          <p className="text-white text-center">Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-3 mb-3 text-white gap-3"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-400">
                    ${item.product.price} × {item.quantity}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => decreaseQuantity(item.product._id)}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.product._id)}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold">
                    ${item.product.price * item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-red-500 border px-2 py-1 rounded hover:bg-red-600 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="text-right text-xl font-semibold mt-4 text-white">
              Total: ${total}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="mt-4 w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>

            {showModal && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded p-4 sm:p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-3 right-3 text-white font-bold text-xl sm:text-2xl p-2 rounded hover:bg-gray-700 transition"
                    aria-label="Close"
                  >
                    ×
                  </button>

                  <h2 className="text-xl font-bold mb-4 text-white text-center sm:text-left">
                    Customer Details
                  </h2>

                  <form
                    onSubmit={handleOrderConfirm}
                    className="space-y-3 text-white"
                  >
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full border p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full border p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <textarea
                      placeholder="Address"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      className="w-full border p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <select
                      value={form.paymentMethod}
                      onChange={(e) =>
                        setForm({ ...form, paymentMethod: e.target.value })
                      }
                      className="w-full border p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="COD">Cash on Delivery</option>
                      <option value="Online">Online Payment</option>
                    </select>

                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
                    >
                      Confirm Order
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="my-10">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  You Might Also Like
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedProducts.map((p) => (
                    <div
                      key={p._id}
                      className="bg-gray-700 p-4 rounded text-white"
                    >
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-40 object-cover rounded mb-2"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-600 rounded mb-2 flex items-center justify-center">
                          No Image
                        </div>
                      )}
                      <h3 className="font-semibold">{p.name}</h3>
                      <p>${p.price}</p>
                      <button
                        onClick={() => addToCart(p)}
                        className="mt-2 w-full bg-blue-600 py-1 rounded hover:bg-blue-700"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
}
