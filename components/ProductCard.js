import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const isOutOfStock = product.inStock === false;
  return (
    <div className="bg-gray-700 rounded shadow p-4 relative">
      <div className="h-48 flex items-center justify-center mb-4">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element

          <Image
            src={product?.image}
            alt={product.name}
            width={100}
            height={200}
            className={`max-h-48 rounded ${isOutOfStock ? "opacity-50" : ""}`}
          />
        ) : (
          <div className="text-sm text-gray-400">No image</div>
        )}

        {/* 🔴 Overlay if Out of Stock */}
        {isOutOfStock && (
          <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>

      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-200">{product.category || "General"}</p>

      <div className="mt-2 flex items-center justify-between">
        <div className="text-lg font-bold">${product.price}</div>

        <Link
          href={`/product/${product._id}`}
          className={`text-sm px-3 py-1 border rounded ${
            isOutOfStock
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : ""
          }`}
        >
          View
        </Link>
      </div>

      {/* 🔘 Stock indicator */}
      <p
        className={`mt-2 text-sm font-semibold ${
          isOutOfStock ? "text-red-400" : "text-green-400"
        }`}
      >
        {isOutOfStock ? "Out of Stock" : "In Stock"}
      </p>
    </div>
  );
}
