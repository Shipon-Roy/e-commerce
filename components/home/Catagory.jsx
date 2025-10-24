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
    if (image.url) return image.url; // ✅ URL support
    if (image.data) return `data:${image.contentType};base64,${image.data}`;
    return "/no-image.png";
  };

  return (
    <div className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-10 text-center">
          🛍️ Shop by Category
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 place-items-center">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="text-center flex flex-col items-center"
            >
              <Link
                href={`/category/${cat.slug}`}
                className="relative group w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-green-400 hover:border-green-300 transition-all block"
              >
                <img
                  src={getImageSrc(cat.image)}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:flex items-center justify-center">
                  <span className="text-sm sm:text-base font-semibold text-white drop-shadow-lg">
                    {cat.name}
                  </span>
                </div>
              </Link>
              <div className="sm:hidden mt-3 text-sm font-semibold text-center">
                {cat.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
