"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isAuthenticated } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          Prep Rush
        </Link>

        {authenticated ? (
          <div className="flex items-center gap-3">
            <span className="max-w-36 truncate text-sm text-gray-700 sm:max-w-none">
              {user?.name ?? "User"}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

