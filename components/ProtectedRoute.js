"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || (role && user.role !== role)) {
        router.push("/login"); // guest বা non-admin redirect
      }
    }
  }, [user, loading, role, router]);

  if (loading) return <div>Loading...</div>; // spinner বা loading message
  if (!user || (role && user.role !== role)) return null; // redirect wait

  return <>{children}</>;
}
