"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
  });
  const [editing, setEditing] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `/api/admin/products/${editing}`
      : "/api/admin/products";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      price: "",
      category: "",
      image: "",
      description: "",
    });
    setEditing(null);
    fetchProducts();
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  // Edit product
  const handleEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name || "",
      price: p.price?.toString() || "",
      category: p.category || "",
      image: p.image || "",
      description: p.description || "",
    });
  };

  // Toggle stock
  const toggleStock = async (id, currentStatus) => {
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inStock: !currentStatus }),
    });
    fetchProducts();
  };

  return (
    <ProtectedRoute role="admin">
      <div className="max-w-6xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6">🛍️ Manage Products</h1>

        {/* Add Product Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditing(null);
              setForm({
                name: "",
                price: "",
                category: "",
                image: "",
                description: "",
              });
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Product
          </button>
        </div>

        {/* Form */}
        <div className="bg-gray-900 p-6 rounded-xl mb-10 shadow">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 rounded text-gray-200"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full p-2 rounded text-gray-200"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-2 rounded text-gray-200"
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full p-2 rounded text-gray-200"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-2 rounded text-gray-200 md:col-span-2"
              required
            />
            <button className="bg-blue-600 w-36 text-white px-4 py-2 rounded hover:bg-blue-700 md:col-span-2">
              {editing ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-gray-800 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-700 uppercase text-gray-300 text-xs">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-400 italic"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                  >
                    <td className="px-4 py-3">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          width={60}
                          height={60}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-[60px] h-[60px] bg-gray-600 rounded flex items-center justify-center text-xs text-gray-300">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">${p.price}</td>
                    <td className="px-4 py-3 text-gray-300 truncate max-w-[200px]">
                      {p.description}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStock(p._id, p.inStock)}
                        className={`px-3 py-1 rounded text-white ${
                          p.inStock
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
