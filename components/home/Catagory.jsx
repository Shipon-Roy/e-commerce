"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const getImageSrc = (image) => {
    if (!image) return "/no-image.png";
    if (image.url) return image.url;
    if (image.data) return `data:${image.contentType};base64,${image.data}`;
    return "/no-image.png";
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/50 to-black/90 backdrop-blur-xl text-white py-5 sm:py-16 lg:py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-10 sm:mb-14 text-center bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-2xl animate-fade-in-up">
          🛍️ Shop by Category
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 place-items-center">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="text-center flex flex-col items-center w-full max-w-xs"
            >
              <Link
                href={`/category/${cat.slug}`}
                className="relative group w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-48 xl:h-48 rounded-3xl overflow-hidden border-4 border-white/20 hover:border-emerald-400/70 shadow-2xl hover:shadow-emerald-500/30 backdrop-blur-xl bg-gradient-to-br from-gray-800/60 via-white/10 to-gray-900/60 transition-all duration-700 hover:-translate-y-3 hover:scale-[1.05] block mx-auto"
              >
                <img
                  src={getImageSrc(cat.image)}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-3xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 group-hover:brightness-125 shadow-inner"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 hidden sm:flex items-center justify-center backdrop-blur-md rounded-3xl">
                  <span className="text-base sm:text-lg md:text-xl font-black text-white drop-shadow-2xl bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/30">
                    {cat.name}
                  </span>
                </div>

                {/* Premium Ring Effect */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-emerald-400/30 to-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl animate-ping"></div>
              </Link>
              <div className="sm:hidden mt-4 px-3 py-2 w-full max-w-35 sm:max-w-45">
                <span className="block text-sm sm:text-base font-bold text-white/95 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-emerald-400/40 shadow-lg text-center truncate">
                  {cat.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
}
