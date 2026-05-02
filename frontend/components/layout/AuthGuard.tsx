"use client";

import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.replace("/auth/login");
    }
  }, [loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}

