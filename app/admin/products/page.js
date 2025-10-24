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
    description: "",
  });
  const [images, setImages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("description", form.description);

    images.forEach((img) => formData.append("images", img));

    const url = editing
      ? `/api/admin/products/${editing}`
      : "/api/admin/products";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      body: method === "POST" ? formData : JSON.stringify(form),
      headers:
        method === "PUT" ? { "Content-Type": "application/json" } : undefined,
    });

    setForm({ name: "", price: "", category: "", description: "" });
    setImages([]);
    setEditing(null);
    setShowModal(false);
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
      description: p.description || "",
    });
    setShowModal(true);
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
              setForm({ name: "", price: "", category: "", description: "" });
              setImages([]);
              setShowModal(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Product
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl relative">
              <button
                className="absolute top-2 right-2 text-white text-xl font-bold"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4">
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-4"
              >
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
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full p-2 rounded text-gray-200"
                  required
                />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages([...e.target.files])}
                  className="w-full text-gray-200"
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
                <button className="bg-blue-600 w-full text-white px-4 py-2 rounded md:col-span-2">
                  {editing ? "Update Product" : "Add Product"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Product List */}
        <div className="bg-gray-800 rounded-lg shadow overflow-x-auto mt-6">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-700 uppercase text-gray-300 text-xs">
              <tr>
                <th className="px-4 py-3">Images</th>
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
                    <td className="px-4 py-3 flex gap-1">
                      {p.images?.map((img, idx) => (
                        <Image
                          key={idx}
                          src={`data:${img.contentType};base64,${Buffer.from(
                            img.data.data
                          ).toString("base64")}`}
                          alt={p.name}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                      ))}
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
