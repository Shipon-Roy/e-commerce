"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OrderSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 5000); // redirect to home after 5s
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-green-100">
      <h1 className="text-3xl font-bold mb-4">✅ Order Placed Successfully!</h1>
      <p className="mb-2">
        Thank you for your order. You chose Cash on Delivery.
      </p>
      <p className="text-sm text-gray-700">
        You will be redirected to home page shortly.
      </p>
    </div>
  );
}
