"use client";
import React, { use, useEffect, useState } from "react";
import Container from "../../../components/Container";
import ProductCard from "../../../components/ProductCard";

export default function CategoryPage({ params }) {
  // ✅ unwrap params using React.use()
  const { slug } = use(params);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Proper title case

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await fetch(`/api/products?category=${categoryName}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900/90 via-black/30 to-gray-900/70 backdrop-blur-xl flex items-center justify-center text-white py-12">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6"></div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent mb-2">
              Loading {categoryName}...
            </h2>
            <p className="text-gray-400 text-lg">Fetching premium collection</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/90 via-black/30 to-gray-900/70 backdrop-blur-xl py-12 sm:py-20 text-white">
      <Container>
        {/* ✨ Premium Hero Header */}
        <div className="text-center py-16 sm:py-24 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl mb-16 sm:mb-20">
          <div className="max-w-5xl mx-auto px-6">
            {/* Category Icon + Name */}
            <div className="inline-flex items-center gap-4 mb-6 group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl rounded-3xl border-2 border-emerald-400/50 p-5 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500">
                <span className="text-3xl">🛍️</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-3xl leading-tight">
                {categoryName}
              </h1>
            </div>

            {/* Subtitle + Stats */}
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 sm:p-8 border border-white/20 max-w-2xl mx-auto mb-10">
              <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-200 leading-relaxed">
                Explore our exclusive {categoryName.toLowerCase()} collection
              </p>
              <div className="flex items-center justify-center gap-8 mt-6 text-sm sm:text-base text-gray-400">
                <span>⭐ Premium Quality</span>
                <span>🚚 Fast Delivery</span>
                <span>🛡️️ Secure Payment</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="flex items-center justify-center gap-8">
              <div className="w-32 sm:w-40 h-px bg-gradient-to-r from-emerald-400 to-transparent"></div>
              <div className="text-emerald-400 text-4xl animate-pulse">✨</div>
              <div className="w-32 sm:w-40 h-px bg-gradient-to-r from-transparent to-emerald-400"></div>
            </div>
          </div>
        </div>

        {/* 🛒 Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="backdrop-blur-sm bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10 mb-10 sm:mb-12 flex flex-wrap items-center justify-between gap-4">
                <div className="text-left">
                  <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent mb-1">
                    {products.length} Products Found
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Premium {categoryName.toLowerCase()} collection
                  </p>
                </div>
                <div className="text-right text-sm sm:text-base text-gray-400 hidden sm:block">
                  Sort by:{" "}
                  <span className="text-emerald-400 font-medium">Featured</span>
                </div>
              </div>

              {/* Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                {products.map((product) => (
                  <div key={product._id} className="group">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ❌ Premium Empty State */
            <div className="text-center py-32 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl max-w-2xl mx-auto">
              <div className="text-8xl sm:text-9xl mb-8 opacity-10">🛒</div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-400 mb-6 bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">
                No Products Yet
              </h2>
              <p className="text-xl sm:text-2xl text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                We're working hard to bring you the best{" "}
                {categoryName.toLowerCase()} products. Check back soon for new
                arrivals!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500 text-lg">
                <span>🔄 Coming Soon</span>
                <span>•</span>
                <span>⭐ Premium Quality Guaranteed</span>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
