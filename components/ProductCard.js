import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const isOutOfStock = product.inStock === false;

  // প্রথম image Base64 (ঠিক আছে)
  const firstImage =
    product.images && product.images.length > 0
      ? `data:${product.images[0].contentType};base64,${Buffer.from(
          product.images[0].data.data
        ).toString("base64")}`
      : null;

  return (
    <div className="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/70 to-gray-900/90 backdrop-blur-xl rounded-3xl p-4 sm:p-5 lg:p-6 border border-gray-700/40 hover:border-blue-500/50 shadow-2xl hover:shadow-blue-500/20 h-full flex flex-col transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
      {/* Premium Image Container */}
      <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 mb-4 sm:mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-black/60 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-700 flex items-center justify-center">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            width={400}
            height={300}
            className={`object-cover w-full h-full rounded-2xl transition-all duration-700 group-hover:scale-110 ${
              isOutOfStock ? "opacity-60 saturate-50" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-2xl flex flex-col items-center justify-center text-center p-4 backdrop-blur-sm border-2 border-gray-600/50">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600/50 rounded-2xl flex items-center justify-center mb-2 mx-auto">
              <span className="text-2xl">🖼️</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              No Image
            </p>
          </div>
        )}

        {/* Premium Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600/95 to-red-700/95 backdrop-blur-xl text-white text-xs sm:text-sm px-3 py-1.5 rounded-2xl shadow-2xl border-2 border-red-500/50 font-bold tracking-wide">
            ❌ Sold Out
          </div>
        )}

        {/* Quick Actions Overlay - Mobile Hidden */}
        {!isOutOfStock && (
          <div className="absolute top-3 left-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-400 flex gap-2 backdrop-blur-xl p-1 rounded-2xl bg-white/10 border border-white/20 hidden sm:flex">
            <button className="p-2 hover:bg-white/20 rounded-xl transition-all hover:scale-110">
              <span className="w-4 h-4 sm:w-5 sm:h-5 text-white">🛒</span>
            </button>
            <button className="p-2 hover:bg-white/20 rounded-xl transition-all hover:scale-110">
              <span className="w-4 h-4 sm:w-5 sm:h-5 text-white hover:text-red-400">
                ❤️
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 space-y-2 sm:space-y-3 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-base sm:text-lg lg:text-xl leading-tight line-clamp-2 group-hover:text-blue-400 transition-all duration-300 text-left">
            {product.name}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm font-medium capitalize mt-1 opacity-85">
            {product.category || "General"}
          </p>
        </div>

        {/* Premium Price Section */}
        <div className="space-y-2 pt-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 min-w-0">
              {product.offerPrice ? (
                <>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent drop-shadow-lg block leading-none">
                    ৳{product.offerPrice.toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 font-mono line-through tracking-wide">
                    ৳{product.price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent drop-shadow-lg">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Discount Badge */}
            {product.offerPrice && product.price && (
              <div className="bg-gradient-to-br from-orange-500/95 to-yellow-500/95 text-white text-xs sm:text-sm font-black px-2.5 py-1.5 rounded-full shadow-xl border border-orange-400/50 flex-shrink-0 whitespace-nowrap animate-pulse">
                -
                {Math.round(
                  ((product.price - product.offerPrice) / product.price) * 100
                )}
                %
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Link
            href={`/product/${product._id}`}
            className={`block w-full text-center py-2.5 sm:py-3 px-4 rounded-2xl font-bold text-sm sm:text-base shadow-xl transition-all duration-400 border transform ${
              isOutOfStock
                ? "bg-gradient-to-r from-gray-700/70 to-gray-800/70 text-gray-400 border-gray-600/50 cursor-not-allowed opacity-70 hover:scale-100"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-500/50 hover:shadow-blue-500/30 hover:scale-[1.02] hover:-translate-y-1 active:scale-95"
            }`}
          >
            {isOutOfStock ? "❌ Sold Out" : "👀 View Details"}
          </Link>

          {/* Stock Status */}
          <div className={`flex items-center gap-2 pt-1 sm:pt-2`}>
            <div
              className={`w-2 h-2 rounded-full ${
                isOutOfStock ? "bg-red-500" : "bg-emerald-500"
              } animate-ping`}
            ></div>
            <span
              className={`text-xs sm:text-sm font-semibold tracking-wide ${
                isOutOfStock
                  ? "text-red-400"
                  : "text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-400/30"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : "Ready to Ship"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
