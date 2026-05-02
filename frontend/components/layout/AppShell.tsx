"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  if (isPublic) return <>{children}</>;

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      {/* ── Sidebar (desktop: fixed / mobile: drawer) ── */}
      <div className={`app-sidebar${sidebarOpen ? " sidebar-open" : ""}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </div>

      {/* ── Dark overlay when sidebar is open on mobile ── */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " overlay-open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Right side: mobile topbar + main content ── */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect y="2" width="18" height="2" rx="1" fill="currentColor"/>
              <rect y="8" width="18" height="2" rx="1" fill="currentColor"/>
              <rect y="14" width="18" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>

          <Link href="/dashboard" style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--primary)", textDecoration: "none" }}>
            ⚡ PrepRush
          </Link>

          <Link
            href="/onboarding"
            className="btn-primary"
            style={{ padding: "8px 14px", fontSize: "0.8rem" }}
          >
            + New
          </Link>
        </div>

        {/* Page content */}
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}
