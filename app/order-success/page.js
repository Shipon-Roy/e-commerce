"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white px-4 text-center">
      {/* Success Icon */}
      <CheckCircle className="w-20 h-20 text-green-400 mb-4 animate-bounce" />

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
        ✅ Order Placed Successfully!
      </h1>

      {/* Message */}
      <p className="text-sm sm:text-base text-gray-200 mb-2">
        Thank you for your order. You chose{" "}
        <span className="font-semibold text-green-300">Cash on Delivery</span>.
      </p>

      <p className="text-xs sm:text-sm text-gray-300">
        You will be redirected to the home page shortly...
      </p>

      {/* Button (Manual Redirect) */}
      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-all duration-300"
      >
        Go to Home Now
      </button>
    </div>
  );
}
