"use client";
import { useEffect, useState, useCallback } from "react";
import { useCart } from "../../context/CartContext";
import Container from "../../components/Container";
import OrderSuccess from "../order-success/page";
import Link from "next/link";

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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    policeStation: "",
    district: "",
    extra: "",
    paymentMethod: "COD",
    shipping: "outside",
  });

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  // helper: offer price > regular price হলে offer ব্যবহার
  const getPrice = (product) => {
    return product.offerPrice && product.offerPrice > 0
      ? product.offerPrice
      : product.price;
  };

  // cart subtotal
  const subtotal = cart.reduce(
    (sum, i) => sum + getPrice(i.product) * i.quantity,
    0
  );

  // shipping cost অনুযায়ী total
  const shippingCost =
    form.shipping === "outside" ? 130 : form.shipping === "inside" ? 80 : 0;

  const total = subtotal + shippingCost;

  // related products আনবে (same category)
  const fetchRelatedProducts = useCallback(async () => {
    if (cart.length === 0) return;
    setRelatedLoading(true);

    try {
      const category = cart[0].product.category;
      if (!category) return;

      const res = await fetch(`/api/products?category=${category}`);
      if (!res.ok) throw new Error("Failed to fetch related products");

      const data = await res.json();
      const filtered = data.filter(
        (p) => !cart.some((c) => String(c.product._id) === String(p._id))
      );
      setRelatedProducts(filtered.slice(0, 4));
    } catch (err) {
      console.error("Related products error:", err);
    } finally {
      setRelatedLoading(false);
    }
  }, [cart]);

  useEffect(() => {
    fetchRelatedProducts();
  }, [fetchRelatedProducts]);

  const handleInputChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validateForm = () => {
    if (!form.name.trim()) return "Please enter your name";
    if (!/^01\d{9}$/.test(form.phone))
      return "Phone must be 11 digits starting with 01";
    if (!form.address.trim()) return "Please enter your address";
    if (!form.policeStation.trim()) return "Please enter police station";
    if (!form.district.trim()) return "Please enter district";
    if (cart.length === 0) return "Your cart is empty";
    return null;
  };

  const handleOrderConfirm = async (e) => {
    if (e) e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const itemsSubtotal = cart.reduce((sum, item) => {
        return sum + Number(getPrice(item.product)) * Number(item.quantity);
      }, 0);

      const orderData = {
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          policeStation: form.policeStation.trim(),
          district: form.district.trim(),
          extra: form.extra.trim(),
        },
        items: cart.map((item) => ({
          product: {
            _id: item.product._id,
            name: item.product.name,
            price: Number(getPrice(item.product)),
          },
          size: item.product.selectedSize || null,
          quantity: Number(item.quantity),
        })),
        subtotal: Number(itemsSubtotal.toFixed(2)),
        shippingCost: Number(shippingCost),
        totalPrice: Number((itemsSubtotal + shippingCost).toFixed(2)),
        paymentMethod: form.paymentMethod,
        status: "Pending",
        isPaid: false,
      };

      console.log("🛒 SENDING TO DB:", orderData);

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const text = await res.text();
        let err = { message: "Order failed" };
        try {
          err = JSON.parse(text);
        } catch {}
        throw new Error(err.message);
      }

      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      console.error("Order Error:", err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (orderPlaced) {
    return <OrderSuccess />;
  }

  return (
    <Container>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 my-6 sm:my-10">
        {/* ✅ MOBILE RESPONSIVE TITLE */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent leading-tight">
          🛒 Your Order
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-xl sm:text-2xl">🛒</span>
            </div>
            <p className="text-xl sm:text-2xl text-gray-400 mb-4 px-4">
              Your cart is empty
            </p>
            <Link
              href="/"
              className="inline-block px-6 sm:px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all text-sm sm:text-base"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* LEFT: Billing & Shipping - FULL WIDTH ON MOBILE */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 order-2 lg:order-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-white flex items-center gap-2 sm:gap-3">
                📋 Billing & Shipping
              </h2>

              <form
                onSubmit={handleOrderConfirm}
                className="space-y-4 sm:space-y-6"
              >
                {/* Name */}
                <div>
                  <input
                    type="text"
                    placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                    className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-400 text-base"
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    placeholder="০১XXXXXXXXX"
                    className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all text-white placeholder-gray-400 text-base"
                    maxLength={11}
                    value={form.phone}
                    onChange={(e) =>
                      handleInputChange(
                        "phone",
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <textarea
                    placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                    rows={3}
                    className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-400 resize-vertical text-base"
                    value={form.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Police Station + District - STACK ON MOBILE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    placeholder="থানা"
                    className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all text-white placeholder-gray-400 text-base"
                    value={form.policeStation}
                    onChange={(e) =>
                      handleInputChange("policeStation", e.target.value)
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="জেলা"
                    className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all text-white placeholder-gray-400 text-base"
                    value={form.district}
                    onChange={(e) =>
                      handleInputChange("district", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Extra Notes */}
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-gray-300">
                    📝 অতিরিক্ত নোট (Optional)
                  </label>
                  <textarea
                    placeholder="ডেলিভারির জন্য বিশেষ নির্দেশনা..."
                    rows={2}
                    className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder-gray-400 resize-vertical text-base"
                    value={form.extra}
                    onChange={(e) => handleInputChange("extra", e.target.value)}
                  />
                </div>

                {/* Payment Method */}
                <div className="p-3 sm:p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                  <label className="flex items-center gap-3 p-2 sm:p-3 bg-blue-500/10 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      checked={form.paymentMethod === "COD"}
                      onChange={() => handleInputChange("paymentMethod", "COD")}
                    />
                    <span className="font-semibold text-white text-sm sm:text-base">
                      💰 Cash on Delivery
                    </span>
                  </label>
                </div>
              </form>
            </div>

            {/* RIGHT: Order Summary - FULL WIDTH ON MOBILE */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 order-1 lg:order-2">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center text-white flex items-center justify-center gap-2 sm:gap-3">
                💳 Order Summary
              </h2>

              {/* Cart Items - SCROLLABLE ON MOBILE */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-h-80 sm:max-h-96 lg:max-h-none overflow-y-auto pb-2">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.product._id}-${
                      item.product.selectedSize || "default"
                    }-${idx}`}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate pr-2 text-sm sm:text-base">
                        {item.product.name}
                        {item.product.selectedSize && (
                          <span className="ml-2 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-purple-500/20 text-purple-300 text-xs sm:text-sm rounded-full">
                            {item.product.selectedSize}
                          </span>
                        )}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        ৳{getPrice(item.product)} × {item.quantity}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 min-w-0">
                      {/* Quantity Controls - STACK ON MOBILE */}
                      <div className="flex items-center bg-gray-900 border border-gray-600 rounded-lg overflow-hidden w-full sm:w-auto">
                        <button
                          className="px-2 sm:px-3 py-1.5 hover:bg-gray-700 transition-colors w-10 flex items-center justify-center flex-shrink-0"
                          onClick={() =>
                            decreaseQuantity(
                              item.product._id,
                              item.product.selectedSize
                            )
                          }
                        >
                          <span className="text-sm sm:text-lg font-bold">
                            -
                          </span>
                        </button>
                        <span className="px-3 sm:px-4 py-1.5 font-bold bg-gray-800 text-sm sm:text-base min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          className="px-2 sm:px-3 py-1.5 hover:bg-gray-700 transition-colors w-10 flex items-center justify-center flex-shrink-0"
                          onClick={() =>
                            increaseQuantity(
                              item.product._id,
                              item.product.selectedSize
                            )
                          }
                        >
                          <span className="text-sm sm:text-lg font-bold">
                            +
                          </span>
                        </button>
                      </div>

                      <span className="font-bold text-base sm:text-lg text-green-400 flex-shrink-0">
                        ৳{getPrice(item.product) * item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          removeFromCart(
                            item.product._id,
                            item.product.selectedSize
                          )
                        }
                        className="px-2 sm:px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-100 border border-red-500/30 rounded-lg text-xs font-semibold transition-all flex-shrink-0 w-full sm:w-auto"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-gray-900/50 to-transparent rounded-2xl border border-gray-700/50">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-400">
                    Subtotal ({cart.length} items)
                  </span>
                  <span className="font-semibold text-white">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>

                {/* Shipping - FULL WIDTH ON MOBILE */}
                <div className="space-y-2 p-3 sm:p-4 bg-gray-900/30 rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <span className="text-gray-300 font-medium text-sm sm:text-base">
                      🚚 Shipping
                    </span>
                    <div className="flex flex-col sm:flex-row sm:ml-4 gap-2 w-full sm:w-auto">
                      {/* Outside Dhaka */}
                      <label className="flex items-center justify-between sm:justify-end gap-2 cursor-pointer p-2 sm:p-1 bg-white/5 rounded-lg w-full sm:w-auto text-xs sm:text-sm">
                        <div className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="shipping"
                            value="outside"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 ml-auto sm:ml-0"
                            checked={form.shipping === "outside"}
                            onChange={() =>
                              handleInputChange("shipping", "outside")
                            }
                          />
                          <span className="text-xs sm:text-sm text-gray-400">
                            Outside Dhaka
                          </span>
                        </div>
                        <span className="font-bold text-green-400 text-sm sm:text-base">
                          ৳130
                        </span>
                      </label>

                      {/* Inside Dhaka */}
                      <label className="flex items-center justify-between sm:justify-end gap-2 cursor-pointer p-2 sm:p-1 bg-white/5 rounded-lg w-full sm:w-auto text-xs sm:text-sm">
                        <div className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="shipping"
                            value="inside"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 ml-auto sm:ml-0"
                            checked={form.shipping === "inside"}
                            onChange={() =>
                              handleInputChange("shipping", "inside")
                            }
                          />
                          <span className="text-xs sm:text-sm text-gray-400">
                            Inside Dhaka
                          </span>
                        </div>
                        <span className="font-bold text-green-400 text-sm sm:text-base">
                          ৳80
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700 text-sm">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-xl sm:text-2xl font-bold text-green-400">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA - FULL WIDTH */}
              <div className="p-4 sm:p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/20 rounded-2xl">
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl text-xs sm:text-sm">
                  <p className="font-semibold text-yellow-300 mb-1">
                    📞 Cash on Delivery
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    আমাদের একজন প্রতিনিধি কল করে অর্ডার কনফার্ম করবেন। অজানা
                    নম্বর থেকে কল এলে রিসিভ করুন।
                  </p>
                </div>

                <button
                  onClick={handleOrderConfirm}
                  disabled={submitting || cart.length === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-xl shadow-2xl hover:shadow-green-500/25 transition-all transform hover:-translate-y-1 disabled:transform-none"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-sm sm:text-base">
                        Processing...
                      </span>
                    </span>
                  ) : (
                    "✅ PLACE ORDER NOW"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
