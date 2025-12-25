"use client";

import { useState } from "react";
import AddToCartButton from "../../../components/AddToCartButton";
import Container from "../../../components/Container";
import ProductDescript from "../../../components/products/ProductDescript";

export default function ProductPageClient({ product, relatedProducts }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const firstImage =
    product.images?.length > 0
      ? `data:${product.images[0].contentType};base64,${product.images[0].data}`
      : "/no-image.png";

  const [mainImage, setMainImage] = useState(firstImage);

  const thumbnails =
    product.images?.map(
      (img) => `data:${img.contentType};base64,${img.data}`
    ) || [];

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const phone = formData.get("phone");

    // ✅ Phone validation (Bangladesh format: 11 digits starting with 01)
    const phoneRegex = /^01\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Phone number must be 11 digits and start with 01");
      return;
    }

    const orderPayload = {
      customer: {
        name: formData.get("name"),
        phone,
        address: formData.get("address"),
        policeStation: formData.get("policeStation"),
        district: formData.get("district"),
      },
      items: [
        {
          product: {
            _id: product._id,
            name: product.name,
            price: product.offerPrice || product.price,
          },
          size: selectedSize,
          quantity: 1,
        },
      ],
      totalPrice: product.offerPrice || product.price,
      paymentMethod: "COD",
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        setShowOrderModal(false); // hide order modal
        setShowSuccessModal(true); // show success modal
      } else {
        alert("Order failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Order failed!");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white py-10">
      <Container>
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* ✅ Main Image + Thumbnails */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full max-w-md h-72 sm:h-96 object-cover rounded-lg shadow-md mb-4 border border-gray-700"
              />

              {/* ✅ Thumbnails */}
              <div className="flex gap-2 overflow-x-auto">
                {thumbnails.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Thumbnail ${idx}`}
                    className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded cursor-pointer border-2 ${
                      mainImage === src
                        ? "border-green-400"
                        : "border-gray-700 hover:border-green-300"
                    }`}
                    onClick={() => setMainImage(src)}
                  />
                ))}
              </div>
            </div>

            {/* ✅ Product Details */}
            <div className="w-full lg:w-1/2 space-y-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {/* <p className="text-gray-300 leading-relaxed text-base">
                {product.description}
              </p> */}
              <div className="flex items-center gap-3">
                {product.offerPrice ? (
                  <>
                    <span className="text-2xl font-bold text-green-400">
                      ৳{product.offerPrice}
                    </span>
                    <span className="line-through text-gray-400">
                      ৳{product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-green-400">
                    ৳{product.price}
                  </span>
                )}
              </div>

              {/* SIZES */}
              {product.sizes?.length > 0 && (
                <div>
                  <p className="mb-2 font-medium">Select Size</p>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded border ${
                          selectedSize === size
                            ? "bg-green-600 border-green-500"
                            : "bg-gray-700 border-gray-600"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.inStock ? (
                <div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Existing Add to Cart */}
                    <AddToCartButton
                      product={product}
                      selectedSize={selectedSize}
                    />

                    {/* ✅ Buy Now */}
                    <button
                      onClick={() => {
                        if (product.sizes?.length > 0 && !selectedSize) {
                          alert("Please select a size");
                          return;
                        }
                        setShowOrderModal(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg w-full sm:w-auto"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  disabled
                  className="bg-gray-600 text-gray-300 px-6 py-3 rounded-lg w-full sm:w-auto cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>

          {showOrderModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg p-5 w-full max-w-md relative text-white">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="absolute top-2 right-3 text-2xl"
                >
                  ×
                </button>

                <h2 className="text-xl font-bold mb-4">Confirm Your Order</h2>

                {/* Product Info */}
                <div className="bg-gray-700 p-3 rounded mb-4">
                  <p className="font-semibold">{product.name}</p>
                  {selectedSize && (
                    <p className="text-sm text-gray-300">
                      Size: {selectedSize}
                    </p>
                  )}
                  <p className="text-green-400 font-bold">
                    ৳{product.offerPrice || product.price}
                  </p>
                </div>

                {/* Order Form */}
                <form onSubmit={handleOrderSubmit} className="space-y-3">
                  <input
                    name="name"
                    required
                    placeholder="Full Name"
                    className="w-full p-2 rounded bg-gray-700"
                  />
                  <input
                    name="phone"
                    required
                    placeholder="Phone Number"
                    className="w-full p-2 rounded bg-gray-700"
                  />
                  <textarea
                    name="address"
                    required
                    placeholder="Address"
                    className="w-full p-2 rounded bg-gray-700"
                  />
                  <input
                    name="policeStation"
                    required
                    placeholder="Police Station (Thana)"
                    className="w-full p-2 rounded bg-gray-700"
                  />
                  <input
                    name="district"
                    required
                    placeholder="District (Zila)"
                    className="w-full p-2 rounded bg-gray-700"
                  />

                  <button
                    type="submit"
                    className="w-full bg-green-600 py-3 rounded hover:bg-green-700"
                  >
                    Confirm Order
                  </button>
                </form>
              </div>
            </div>
          )}

          {showSuccessModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm relative text-white text-center">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="absolute top-2 right-3 text-2xl"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-4 text-green-400">
                  Order Placed!
                </h2>
                <p className="mb-4">
                  Your order has been successfully placed. Thank you for
                  shopping with us!
                </p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* ✅ Related Products */}
          {relatedProducts?.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-center lg:text-left">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => {
                  const relImage =
                    p.images?.length > 0
                      ? `data:${p.images[0].contentType};base64,${p.images[0].data}`
                      : "/no-image.png";

                  return (
                    <div
                      key={p._id}
                      className="bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-transform hover:-translate-y-1"
                    >
                      <img
                        src={relImage}
                        alt={p.name}
                        className="w-full h-44 sm:h-48 object-cover rounded mb-3"
                      />
                      <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
                      <p className="text-green-400 font-medium">৳{p.price}</p>

                      {p.inStock ? (
                        <div className="mt-3">
                          <AddToCartButton product={p} />
                        </div>
                      ) : (
                        <button
                          disabled
                          className="w-full mt-3 bg-gray-600 text-gray-400 py-2 rounded cursor-not-allowed"
                        >
                          Out of Stock
                        </button>
                      )}
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
