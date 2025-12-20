"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // icon

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (loading) return null;

  return (
    <nav className="bg-gray-800 text-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* ✅ Logo */}
        <Link href="/" className="text-2xl font-bold">
          MyStore
        </Link>

        {/* ✅ Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* ✅ Desktop Menu */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/cart" className="relative px-3 py-1 border rounded">
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <span className="text-white">Hi, {user?.role || "User"}</span>
              {user?.role === "admin" && <Link href="/admin">Dashboard</Link>}

              {user?.role === "moderator" && (
                <Link href="/moderator">Dashboard</Link>
              )}

              <button
                onClick={logout}
                className="px-3 py-1 border rounded hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1 border rounded hover:bg-gray-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* ✅ Mobile Menu (Dropdown) */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700">
          <div className="flex flex-col p-4 space-y-3">
            <Link
              href="/cart"
              className="relative px-3 py-1 border rounded text-center"
              onClick={() => setMenuOpen(false)}
            >
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-3 bg-blue-600 text-white text-xs rounded-full px-1.5">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <span className="text-center">Hi, {user?.role || "User"}</span>
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-1 border rounded text-center hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="px-3 py-1 border rounded text-center hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-1 border rounded text-center hover:bg-gray-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
