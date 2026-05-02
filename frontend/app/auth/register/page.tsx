"use client";

import { useAuth } from "@/context/AuthContext";
import type { RegisterRequest } from "@/lib/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState<RegisterRequest>({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim())
      return "All fields are required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Please enter a valid email address.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      router.push("/onboarding");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = (err.response?.data as { message?: string } | undefined)?.message;
        setError(message || "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
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
      <div className="card animate-slide-up" style={{ width: "100%", maxWidth: "420px", textAlign: "center" }}>
        <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary)", marginBottom: "1.5rem" }}>
          ⚡ PrepRush
        </div>

        <h2 style={{ marginBottom: "8px", fontSize: "1.4rem" }}>Create your account.</h2>
        <p style={{ color: "var(--text-dim)", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Start acing your exams with AI.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="name" className="input-label">Full Name</label>
            <input
              id="name"
              type="text"
              className="input-field"
              placeholder="Mayank Sharma"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

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
              placeholder="Min. 6 characters"
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
            {submitting ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--text-dim)" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
