"use client";
import { useState } from "react";
import AddToCartButton from "../../../components/AddToCartButton";
import Container from "../../../components/Container";
import ProductDescript from "../../../components/products/ProductDescript";

export default function ProductPageClient({ product, relatedProducts }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ✅ EXACT SAME FORM STATE AS CART PAGE
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

  const firstImage =
    product.images?.length > 0
      ? `data:${product.images[0].contentType};base64,${product.images[0].data}`
      : "/no-image.png";

  const [mainImage, setMainImage] = useState(firstImage);
  const thumbnails =
    product.images?.map(
      (img) => `data:${img.contentType};base64,${img.data}`
    ) || [];

  const getPrice = (product) => {
    return product.offerPrice && product.offerPrice > 0
      ? product.offerPrice
      : product.price;
  };

  const price = getPrice(product);
  const shippingCost =
    form.shipping === "outside" ? 130 : form.shipping === "inside" ? 80 : 0;
  const total = price + shippingCost;

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 FORM SUBMITTED!"); // ✅ Debug log

    if (!/^01\d{9}$/.test(form.phone)) {
      alert("Phone must be ০১XXXXXXXXX format");
      return;
    }

    console.log("📱 Phone OK:", form.phone); // ✅ Debug log

    const orderData = {
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        policeStation: form.policeStation.trim(),
        district: form.district.trim(),
        extra: form.extra.trim(),
      },
      items: [
        {
          product: {
            _id: product._id,
            name: product.name,
            price: Number(price),
          },
          size: selectedSize || null,
          quantity: 1,
        },
      ],
      subtotal: Number(price),
      shippingCost: Number(shippingCost),
      totalPrice: Number(total),
      paymentMethod: form.paymentMethod,
      status: "Pending",
      isPaid: false,
    };

    try {
      console.log("📦 Sending order:", orderData); // ✅ Debug log
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      console.log("📡 Response status:", res.status); // ✅ Debug log

      if (res.ok) {
        console.log("✅ ORDER SUCCESS!"); // ✅ Debug log
        // ✅ RESET EVERYTHING + SHOW SUCCESS
        setForm({
          name: "",
          phone: "",
          address: "",
          policeStation: "",
          district: "",
          extra: "",
          paymentMethod: "COD",
          shipping: "outside",
        });
        setSelectedSize(null);
        setShowOrderModal(false);
        setShowSuccessModal(true);
      } else {
        console.error("❌ Order failed:", await res.text());
        alert("Order failed! Check console for details.");
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      alert("Order failed! Check console for details.");
    }
  };

  // ✅ RELATED PRODUCTS SIZE
  const [relatedSizes, setRelatedSizes] = useState({});
  const handleRelatedSizeChange = (productId, size) => {
    setRelatedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  // ✅ SUCCESS MODAL - SHOWS AFTER ORDER
  if (showSuccessModal) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl p-8 rounded-3xl border-2 border-green-500/30 max-w-sm w-full text-center text-white shadow-2xl">
          <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-green-400">
            Order Placed!
          </h2>
          <p className="text-gray-300 mb-8">We'll call to confirm soon!</p>
          <button
            onClick={() => {
              setShowSuccessModal(false);
              setSelectedSize(null);
            }}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-green-500/25 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 my-6 sm:my-10 text-white">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start mb-16">
            {/* Images */}
            <div className="order-2 lg:order-1 flex flex-col items-center">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full max-w-sm lg:max-w-md h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-xl border-4 border-gray-700/50 hover:border-green-400/50 transition-all"
              />
              {thumbnails.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 w-full max-w-sm lg:max-w-md">
                  {thumbnails.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl cursor-pointer border-4 flex-shrink-0 transition-all ${
                        mainImage === src
                          ? "border-green-400 shadow-lg"
                          : "border-gray-600 hover:border-green-300"
                      }`}
                      onClick={() => setMainImage(src)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="order-1 lg:order-2 space-y-4 lg:space-y-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight break-words">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-green-400">
                  ৳{price.toLocaleString()}
                </span>
                {product.offerPrice && (
                  <span className="text-lg line-through text-gray-400">
                    ৳{product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Size Selector */}
              {product.sizes?.length > 0 && (
                <div className="p-4 sm:p-6 bg-gray-900/50 rounded-2xl border border-gray-700/50">
                  <p className="font-semibold mb-3 text-gray-200 text-sm sm:text-base">
                    Select Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-semibold transition-all flex-1 sm:flex-none text-sm sm:text-base ${
                          selectedSize === size
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                            : "bg-gray-800/50 border border-gray-600 hover:border-green-400 hover:bg-green-500/10 text-gray-200"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <AddToCartButton
                  product={product}
                  selectedSize={selectedSize}
                />
                <button
                  onClick={() => {
                    if (product.sizes?.length > 0 && !selectedSize) {
                      alert("Please select a size");
                      return;
                    }
                    setShowOrderModal(true);
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 sm:py-3 lg:py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-green-500/25 transition-all w-full text-center"
                  disabled={!product.inStock}
                >
                  🚀 Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* ✅ FIXED: EXACT CART PAGE FORM MODAL */}
          {showOrderModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 p-4 sm:p-6 overflow-y-auto">
              <div
                className={`mx-auto w-full max-h-[95vh] animate-in slide-in-from-bottom-4 duration-300 shadow-2xl border border-gray-700/50 rounded-3xl backdrop-blur-xl overflow-y-auto p-4 sm:p-6 lg:p-8 ${"max-md:max-w-md max-md:mx-auto lg:max-w-7xl"} bg-gray-800/90 relative`}
              >
                {/* ✅ FIXED: 2-COLUMN LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* LEFT: Billing & Shipping - FORM WITH ID */}
                  <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 order-2 lg:order-1">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-white flex items-center gap-2 sm:gap-3">
                      📋 Billing & Shipping
                    </h2>

                    {/* ✅ FIXED: FORM ID যোগ করা হয়েছে */}
                    <form
                      id="order-form"
                      onSubmit={handleOrderSubmit}
                      className="space-y-4 sm:space-y-6"
                    >
                      {/* Name */}
                      <div>
                        <input
                          type="text"
                          placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                          className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-400 text-base"
                          value={form.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
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

                      {/* Police Station + District */}
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
                          onChange={(e) =>
                            handleInputChange("extra", e.target.value)
                          }
                        />
                      </div>

                      {/* Payment Method */}
                      <div className="p-3 sm:p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                        <label className="flex items-center gap-3 p-2 sm:p-3 bg-blue-500/10 rounded-lg cursor-pointer">
                          <input
                            type="radio"
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            checked={form.paymentMethod === "COD"}
                            onChange={() =>
                              handleInputChange("paymentMethod", "COD")
                            }
                          />
                          <span className="font-semibold text-white text-sm sm:text-base">
                            💰 Cash on Delivery
                          </span>
                        </label>
                      </div>
                    </form>
                  </div>

                  {/* RIGHT: Order Summary */}
                  <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 order-1 lg:order-2">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center text-white flex items-center justify-center gap-2 sm:gap-3">
                      💳 Order Summary
                    </h2>

                    {/* Product Item */}
                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-h-80 sm:max-h-96 lg:max-h-none overflow-y-auto pb-2">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate pr-2 text-sm sm:text-base">
                            {product.name}
                            {selectedSize && (
                              <span className="ml-2 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-purple-500/20 text-purple-300 text-xs sm:text-sm rounded-full">
                                {selectedSize}
                              </span>
                            )}
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            ৳{price.toLocaleString()} × 1
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 min-w-0">
                          <span className="font-bold text-base sm:text-lg text-green-400 flex-shrink-0">
                            ৳{price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-gray-900/50 to-transparent rounded-2xl border border-gray-700/50">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-400">Subtotal (1 item)</span>
                        <span className="font-semibold text-white">
                          ৳{price.toLocaleString()}
                        </span>
                      </div>

                      {/* Shipping */}
                      <div className="space-y-2 p-3 sm:p-4 bg-gray-900/30 rounded-xl">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <span className="text-gray-300 font-medium text-sm sm:text-base">
                            🚚 Shipping
                          </span>
                          <div className="flex flex-col sm:ml-4 gap-2 w-full sm:w-auto">
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
                          <span className="text-lg font-bold text-white">
                            Total
                          </span>
                          <span className="text-xl sm:text-2xl font-bold text-green-400">
                            ৳{total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ✅ FIXED: MAIN BUTTON - form="order-form" দিয়ে LEFT form target */}
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/20 rounded-2xl">
                      <button
                        type="submit"
                        form="order-form" // ✅ এটাই মেইন FIX!
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-xl shadow-2xl hover:shadow-green-500/25 transition-all transform hover:-translate-y-1"
                      >
                        ✅ PLACE ORDER NOW
                      </button>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="absolute top-4 right-4 lg:top-6 lg:right-6 text-2xl hover:text-green-400 transition-all p-2 rounded-xl hover:bg-gray-700/50 w-10 h-10 flex items-center justify-center lg:w-12 lg:h-12 z-10"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts?.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                💡 You Might Also Like
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
                {relatedProducts.map((p) => {
                  const relImage = p.images?.[0]?.data
                    ? `data:${p.images[0].contentType};base64,${p.images[0].data}`
                    : "/no-image.png";
                  const relSelectedSize = relatedSizes[p._id] || null;

                  return (
                    <div
                      key={p._id}
                      className="group bg-gray-800/50 backdrop-blur-xl p-3 sm:p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 hover:bg-gray-800/70 transition-all shadow-xl hover:shadow-purple-500/20 hover:-translate-y-2"
                    >
                      <div className="relative overflow-hidden rounded-xl mb-3 sm:mb-4 h-32 sm:h-40 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center group-hover:from-purple-500/10 group-hover:to-pink-500/10">
                        <img
                          src={relImage}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <h3 className="font-bold text-white mb-2 line-clamp-2 text-sm sm:text-base">
                        {p.name}
                      </h3>
                      <p className="text-xl sm:text-2xl font-bold text-green-400 mb-3 sm:mb-4">
                        ৳{(p.offerPrice || p.price).toLocaleString()}
                      </p>

                      {p.sizes?.length > 0 && (
                        <div className="mb-3 p-2 sm:p-3 bg-purple-500/10 rounded-xl border border-purple-500/30">
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {p.sizes.slice(0, 5).map((size) => (
                              <button
                                key={size}
                                onClick={() =>
                                  handleRelatedSizeChange(p._id, size)
                                }
                                className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold transition-all flex-1 ${
                                  relSelectedSize === size
                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                                    : "bg-gray-700/50 hover:bg-purple-500/20 border border-purple-400/50 hover:border-purple-300 text-gray-200"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <AddToCartButton
                        product={p}
                        selectedSize={relSelectedSize}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <ProductDescript
            title={product.name}
            description={product.description}
          />
        </div>
      </Container>
    </div>
  );
}
