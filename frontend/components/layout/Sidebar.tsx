"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onClose?: () => void;
  onLogout?: () => void;
}

export default function Sidebar({ onClose, onLogout }: Props) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside
      style={{
        width: "100%",
        height: "100vh",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflowY: "auto",
      }}
    >
      <div>
        {/* Logo row — with close button on mobile */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary)" }}>
            ⚡ PrepRush
          </div>
          {/* Close button (only meaningful on mobile, hidden by CSS on desktop) */}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "6px 8px",
                cursor: "pointer",
                color: "var(--text-dim)",
                lineHeight: 1,
                display: "flex",
              }}
              aria-label="Close menu"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Nav Links */}
        <nav>
          <Link
            href="/dashboard"
            className={`nav-link${pathname === "/dashboard" ? " active" : ""}`}
            onClick={onClose}
          >
            🏠 <span>Dashboard</span>
          </Link>
          <Link
            href="/onboarding"
            className={`nav-link${pathname === "/onboarding" ? " active" : ""}`}
            onClick={onClose}
          >
            ✨ <span>New Session</span>
          </Link>
          <Link
            href="/analytics"
            className={`nav-link${pathname === "/analytics" ? " active" : ""}`}
            onClick={onClose}
          >
            📈 <span>Analytics</span>
          </Link>
          <Link
            href="/profile"
            className={`nav-link${pathname === "/profile" ? " active" : ""}`}
            onClick={onClose}
          >
            👤 <span>Profile</span>
          </Link>
        </nav>
      </div>

      {/* User info + logout */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.85rem",
                flexShrink: 0,
              }}
            >
              {(user.name ?? "U")[0].toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontWeight: 700, fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name}
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </p>
              {user.academicLevel && (
                <span style={{ fontSize: "0.68rem", color: "var(--primary)", fontWeight: 600 }}>
                  {user.academicLevel}{user.academicDetails ? ` · ${user.academicDetails}` : ""}
                </span>
              )}
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="btn-outline"
          style={{ width: "100%", justifyContent: "center", padding: "10px 16px", fontSize: "0.85rem" }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
