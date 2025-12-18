"use client";

import ProtectedRoute from "../../../components/ProtectedRoute";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sizeInput, setSizeInput] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    offerPrice: "",
    category: "",
    description: "",
    sizes: [],
    inStock: true, // ✅ Add inStock
  });

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= SIZE ADD / REMOVE =================
  const addSize = () => {
    if (!sizeInput.trim()) return;
    if (form.sizes.includes(sizeInput.trim())) return;

    setForm((prev) => ({
      ...prev,
      sizes: [...prev.sizes, sizeInput.trim()],
    }));
    setSizeInput("");
  };

  const removeSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("offerPrice", form.offerPrice);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("sizes", JSON.stringify(form.sizes));
    formData.append("inStock", form.inStock);

    images.forEach((img) => formData.append("images", img));

    const url = editing
      ? `/api/admin/products/${editing}`
      : "/api/admin/products";

    await fetch(url, {
      method: editing ? "PUT" : "POST",
      body: formData,
    });

    resetForm();
    fetchProducts();
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      offerPrice: "",
      category: "",
      description: "",
      sizes: [],
      inStock: true,
    });
    setImages([]);
    setEditing(null);
    setShowModal(false);
    setSizeInput("");
  };

  // ================= EDIT =================
  const handleEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name || "",
      price: p.price || "",
      offerPrice: p.offerPrice || "",
      category: p.category || "",
      description: p.description || "",
      sizes: p.sizes || [],
      inStock: p.inStock !== false,
    });
    setShowModal(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Delete product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  // ================= TOGGLE STOCK =================
  const toggleStock = async (p) => {
    await fetch(`/api/admin/products/${p._id}`, {
      method: "PUT",
      body: JSON.stringify({ inStock: !p.inStock }),
      headers: { "Content-Type": "application/json" },
    });
    fetchProducts();
  };

  // ================= UI =================
  return (
    <ProtectedRoute role="admin">
      <div className="max-w-6xl mx-auto text-white p-6">
        <h1 className="text-3xl font-bold mb-6">🛍️ Manage Products</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 px-4 py-2 rounded mb-4"
        >
          Add Product
        </button>

        {/* ================= MODAL ================= */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl relative">
              {/* Close Button */}
              <button
                onClick={resetForm}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>

              <h2 className="text-2xl mb-4 font-bold">
                {editing ? "Edit Product" : "Add Product"}
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="p-2 rounded bg-gray-800 col-span-2"
                  required
                />

                <input
                  placeholder="Price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="p-2 rounded bg-gray-800"
                  required
                />

                <input
                  placeholder="Offer Price"
                  type="number"
                  value={form.offerPrice}
                  onChange={(e) =>
                    setForm({ ...form, offerPrice: e.target.value })
                  }
                  className="p-2 rounded bg-gray-800"
                />

                <input
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="p-2 rounded bg-gray-800 col-span-2"
                  required
                />

                {/* Sizes */}
                <div className="col-span-2">
                  <p className="mb-1 text-sm">Sizes</p>

                  <div className="flex gap-2 mb-2">
                    <input
                      placeholder="Type size (S, M, XL)"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      className="p-2 rounded bg-gray-800 flex-1"
                    />
                    <button
                      type="button"
                      onClick={addSize}
                      className="bg-green-600 px-4 rounded"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {form.sizes.map((size) => (
                      <span
                        key={size}
                        className="bg-gray-700 px-3 py-1 rounded flex items-center gap-2"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          className="text-red-400"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="p-2 rounded bg-gray-800 col-span-2"
                />

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages([...e.target.files])}
                  className="col-span-2"
                />

                <button className="bg-blue-600 py-2 rounded col-span-2 font-semibold">
                  {editing ? "Update Product" : "Add Product"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= TABLE ================= */}
        <div className="bg-gray-800 rounded mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3">Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Offer</th>
                <th>Stock</th>
                <th>Sizes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-gray-700">
                  <td className="p-2">
                    {p.images?.[0] && (
                      <Image
                        src={`data:${
                          p.images[0].contentType
                        };base64,${Buffer.from(p.images[0].data.data).toString(
                          "base64"
                        )}`}
                        width={50}
                        height={50}
                        alt=""
                      />
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>৳{p.price}</td>
                  <td className="text-green-400">{p.offerPrice || "-"}</td>
                  <td>
                    <span
                      onClick={() => toggleStock(p)} // ✅ click badge to toggle
                      className={`cursor-pointer px-2 py-1 rounded text-xs font-semibold ${
                        p.inStock ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {p.inStock ? "In Stock" : "Stock Out"}
                    </span>
                  </td>

                  <td>{p.sizes?.join(", ")}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-blue-600 px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-600 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
