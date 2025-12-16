"use client";

import { useState } from "react";
import AddToCartButton from "../../../components/AddToCartButton";
import Container from "../../../components/Container";
import ProductDescript from "../../../components/products/ProductDescript";

export default function ProductPageClient({ product, relatedProducts }) {
  const [selectedSize, setSelectedSize] = useState([]);
  const firstImage =
    product.images?.length > 0
      ? `data:${product.images[0].contentType};base64,${product.images[0].data}`
      : "/no-image.png";

  const [mainImage, setMainImage] = useState(firstImage);

  const thumbnails =
    product.images?.map(
      (img) => `data:${img.contentType};base64,${img.data}`
    ) || [];

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
                <AddToCartButton
                  product={product}
                  selectedSize={selectedSize}
                />
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
