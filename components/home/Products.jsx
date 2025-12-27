"use client";
import { useEffect, useState } from "react";
import Container from "../Container";
import ProductCard from "../ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    price: "",
    inStock: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams(filters);
    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/90 via-black/30 to-gray-900/70 backdrop-blur-xl py-12 sm:py-20 text-white">
      <Container>
        {/* ✨ Premium Category Header */}
        <div className="text-center py-16 sm:py-20 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-2xl mb-4">
            🛍️ Premium Products
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 font-medium tracking-wide">
            Discover our exclusive collection
          </p>
          <div className="flex items-center justify-center mt-8 space-x-4">
            <div className="w-20 sm:w-24 h-px bg-gradient-to-r from-emerald-400 to-transparent"></div>
            <div className="text-emerald-400 text-3xl">✨</div>
            <div className="w-20 sm:w-24 h-px bg-gradient-to-r from-transparent to-emerald-400"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* 🎨 Premium Sidebar Filters */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/20">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">🎚️</span>
                </div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Filters
                </h2>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block mb-3 text-sm font-bold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                  🏷️ Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-medium focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400/50 transition-all duration-300 hover:bg-gray-800/70"
                >
                  <option value="">All Categories</option>
                  <option value="Clothing">👕 Clothing</option>
                  <option value="Shoes">👟 Shoes</option>
                  <option value="Electronics">📱 Electronics</option>
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="block mb-3 text-sm font-bold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                  💰 Price Range
                </label>
                <select
                  value={filters.price}
                  onChange={(e) =>
                    setFilters({ ...filters, price: e.target.value })
                  }
                  className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-medium focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400/50 transition-all duration-300 hover:bg-gray-800/70"
                >
                  <option value="">Any Price</option>
                  <option value="0-50">৳0 - ৳50</option>
                  <option value="50-100">৳50 - ৳100</option>
                  <option value="100-500">৳100 - ৳500</option>
                  <option value="500+">৳500+</option>
                </select>
              </div>

              {/* Stock Filter */}
              <div className="mb-8">
                <label className="block mb-3 text-sm font-bold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                  📦 Availability
                </label>
                <select
                  value={filters.inStock}
                  onChange={(e) =>
                    setFilters({ ...filters, inStock: e.target.value })
                  }
                  className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-medium focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400/50 transition-all duration-300 hover:bg-gray-800/70"
                >
                  <option value="">Show All</option>
                  <option value="true">✅ In Stock</option>
                  <option value="false">❌ Out of Stock</option>
                </select>
              </div>

              {/* Clear Button */}
              <button
                onClick={() =>
                  setFilters({ category: "", price: "", inStock: "" })
                }
                className="group w-full bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-600 hover:to-red-700 border-2 border-red-400/50 backdrop-blur-sm text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
              >
                <span>🔄</span>
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>

          {/* 🛒 Premium Product Grid */}
          <div className="lg:col-span-3 space-y-8">
            {/* Results Count */}
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="text-lg font-bold text-emerald-400">
                {loading ? "Loading..." : `${products.length} Products Found`}
              </div>
              <div className="text-sm text-gray-400">
                Premium quality • Fast delivery
              </div>
            </div>

            {loading ? (
              // Premium Loader
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 py-20">
                {Array(8)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="group relative bg-white/5 rounded-3xl p-6 backdrop-blur-xl border border-white/10 shadow-xl animate-pulse hover:shadow-emerald-500/30 transition-all"
                    >
                      <div className="w-full h-48 bg-gray-800/50 rounded-2xl mb-4"></div>
                      <div className="h-6 bg-gray-800/50 rounded-full w-3/4 mb-3"></div>
                      <div className="h-5 bg-gray-800/50 rounded-full w-1/2"></div>
                    </div>
                  ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl">
                <div className="text-7xl mb-8 opacity-20">🛒</div>
                <h2 className="text-3xl font-black text-gray-400 mb-4">
                  No Products Found
                </h2>
                <p className="text-xl text-gray-500 max-w-md mx-auto">
                  Try adjusting your filters or check back later for new
                  arrivals.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
