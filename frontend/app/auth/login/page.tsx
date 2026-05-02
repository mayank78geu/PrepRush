"use client";

import { useAuth } from "@/context/AuthContext";
import type { LoginRequest } from "@/lib/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = (err.response?.data as { message?: string } | undefined)?.message;
        setError(message || "Invalid credentials. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top right, #1e1b4b, var(--bg))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div className="card animate-slide-up" style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
        {/* Logo */}
        <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary)", marginBottom: "1.5rem" }}>
          ⚡ PrepRush
        </div>

        <h2 style={{ marginBottom: "8px", fontSize: "1.4rem" }}>Welcome back.</h2>
        <p style={{ color: "var(--text-dim)", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Sign in to continue your revision.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="email" className="input-label">Email Address</label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="name@university.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label htmlFor="password" className="input-label">Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
          </div>

          {error && (
            <div
              style={{
                background: "rgba(244, 63, 94, 0.1)",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#f87171",
                fontSize: "0.85rem",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Signing in..." : "Sign In to Revise →"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--text-dim)" }}>
          No account?{" "}
          <Link href="/auth/register" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
