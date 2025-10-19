"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Container from "./Container";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout, loading } = useAuth();

  console.log("Auth user:", user); // debug only

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) return null; // data লোড না হওয়া পর্যন্ত কিছু না দেখাও

  return (
    <nav className="bg-gray-800 shadow-sm">
      <Container>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-white">
            MyStore
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="px-3 py-1 border rounded relative text-white"
            >
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <span className="text-white px-3 py-1">
                  Hi, {user?.role || "User"}
                </span>

                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="px-3 py-1 border rounded text-white"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="px-3 py-1 border rounded text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="px-3 py-1 text-white">
                Login
              </Link>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}
