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

  const fetchProducts = async () => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return (
    <div className="my-20 text-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 🧭 Sidebar Filters (only sticky on large screens) */}
          <div className="bg-gray-900 p-5 rounded-lg h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="block mb-2 text-sm text-gray-300">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="bg-gray-800 w-full p-2 rounded"
              >
                <option value="">All Categories</option>
                <option value="Clothing">Clothing</option>
                <option value="Shoes">Shoes</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-4">
              <label className="block mb-2 text-sm text-gray-300">Price</label>
              <select
                value={filters.price}
                onChange={(e) =>
                  setFilters({ ...filters, price: e.target.value })
                }
                className="bg-gray-800 w-full p-2 rounded"
              >
                <option value="">Any Price</option>
                <option value="0-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-500">$100 - $500</option>
                <option value="500+">Above $500</option>
              </select>
            </div>

            {/* Stock Filter */}
            <div className="mb-4">
              <label className="block mb-2 text-sm text-gray-300">
                Availability
              </label>
              <select
                value={filters.inStock}
                onChange={(e) =>
                  setFilters({ ...filters, inStock: e.target.value })
                }
                className="bg-gray-800 w-full p-2 rounded"
              >
                <option value="">All</option>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>

            {/* Clear Button */}
            <button
              onClick={() =>
                setFilters({ category: "", price: "", inStock: "" })
              }
              className="bg-red-600 hover:bg-red-700 w-full py-2 rounded mt-4"
            >
              Clear Filters
            </button>
          </div>

          {/* 🛒 Product Grid */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold mb-10 text-center lg:text-left">
              Products
            </h1>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center mt-10">
                No products found.
              </p>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
