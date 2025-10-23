"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-10 text-center">
          Shop by Category
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
          {categories.map((cat) => (
            <div key={cat.slug} className="text-center">
              <Link
                href={`/category/${cat.slug}`}
                className="relative group w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-green-400 hover:border-green-300 transition-all block mx-auto"
              >
                <img
                  src={cat.image || "/no-image.png"}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                />

                {/* 🩶 Overlay (visible only on hover for md+ screens) */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:flex items-center justify-center">
                  <span className="text-sm sm:text-base font-semibold text-white drop-shadow-lg">
                    {cat.name}
                  </span>
                </div>
              </Link>

              {/* 📱 Mobile View: name always visible below image */}
              <div className="sm:hidden mt-2 text-sm font-semibold">
                {cat.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
