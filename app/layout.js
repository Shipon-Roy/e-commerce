import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "My Store",
  description: "Next.js eCommerce website with dark theme",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gray-900 text-white min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            {/* 🧭 Navbar */}
            <Navbar />

            {/* 🛍️ Main content area */}
            <main className="flex-grow bg-gray-900">{children}</main>

            {/* ⚓ Footer */}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
