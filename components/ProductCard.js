import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const isOutOfStock = product.inStock === false;

  // প্রথম image Base64
  const firstImage =
    product.images && product.images.length > 0
      ? `data:${product.images[0].contentType};base64,${Buffer.from(
          product.images[0].data.data
        ).toString("base64")}`
      : null;

  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative w-full h-48 sm:h-56 md:h-60 flex items-center justify-center mb-4 overflow-hidden rounded-lg">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            width={400}
            height={300}
            className={`object-cover w-full h-full rounded-lg transition-transform duration-500 ${
              isOutOfStock ? "opacity-50" : "group-hover:scale-105"
            }`}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-sm text-gray-400 bg-gray-700 rounded-lg">
            No image
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs sm:text-sm px-2 py-1 rounded-md shadow">
            Out of Stock
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-white text-lg mb-1 truncate text-center sm:text-left">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-2 text-center sm:text-left">
          {product.category || "General"}
        </p>
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between mt-2">
          <div className="text-lg sm:text-xl font-bold text-green-400">
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
          </div>

          <Link
            href={`/product/${product._id}`}
            className={`text-sm sm:text-base px-3 py-1.5 rounded-md border border-gray-600 text-white hover:bg-blue-600 transition-all duration-300 ${
              isOutOfStock
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
          >
            View
          </Link>
        </div>

        <p
          className={`mt-2 text-sm sm:text-base font-medium ${
            isOutOfStock ? "text-red-400" : "text-green-400"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </p>
      </div>
    </div>
  );
}
