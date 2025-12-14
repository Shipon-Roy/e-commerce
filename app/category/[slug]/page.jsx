"use client";
import React, { use, useEffect, useState } from "react";
import Container from "../../../components/Container";
import ProductCard from "../../../components/ProductCard";

export default function CategoryPage({ params }) {
  // ✅ unwrap params using React.use()
  const { slug } = use(params);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryName = slug.replace(/-/g, " "); // convert slug → readable name

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
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <Container>
      <div className="min-h-screen bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center capitalize">
            {categoryName} Products
          </h1>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-10">
              No products found in this category.
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
