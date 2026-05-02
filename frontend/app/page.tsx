"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top right, #1e1b4b 0%, var(--bg) 60%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.2rem 5%",
          borderBottom: "1px solid var(--border)",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--primary)", flexShrink: 0 }}>
          ⚡ PrepRush
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Link href="/auth/login" className="btn-outline" style={{ padding: "9px 16px", fontSize: "0.85rem" }}>
            Sign In
          </Link>
          <Link href="/auth/register" className="btn-primary" style={{ padding: "9px 16px", fontSize: "0.85rem" }}>
            Get Started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "clamp(2rem, 5vw, 4rem) 5%",
        }}
      >
        {/* Badge */}
        <div
          className="badge badge-primary animate-slide-up"
          style={{ marginBottom: "1.5rem", fontSize: "0.72rem", padding: "6px 14px" }}
        >
          ✨ AI-Powered Exam Prep
        </div>

        {/* Headline */}
        <h1
          className="animate-slide-up delay-100"
          style={{
            fontSize: "clamp(2rem, 7vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: "800px",
            marginBottom: "1.25rem",
          }}
        >
          Master your exams.
          <br />
          <span style={{ color: "var(--primary)" }}>AI-Accelerated</span> Revision.
        </h1>

        {/* Subtitle */}
        <p
          className="animate-slide-up delay-200"
          style={{
            fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
            color: "var(--text-dim)",
            maxWidth: "520px",
            lineHeight: 1.7,
            marginBottom: "2rem",
            padding: "0 1rem",
          }}
        >
          Enter a topic, choose your exam level, and get AI-generated core concepts, smart quizzes, and a 24-hour emergency prep plan.
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-slide-up delay-300"
          style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link href="/auth/register" className="btn-primary" style={{ fontSize: "1rem", padding: "13px 28px" }}>
            Start Revising Free →
          </Link>
          <Link href="/auth/login" className="btn-outline" style={{ fontSize: "1rem", padding: "13px 28px" }}>
            Sign In
          </Link>
        </div>

        {/* Feature Cards */}
        <div
          className="animate-slide-up delay-400"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginTop: "clamp(3rem, 6vw, 5rem)",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          {[
            {
              icon: "📚",
              badge: "Focused Study",
              badgeClass: "badge-primary",
              title: "Normal Revision",
              desc: "Deep dive into any topic. Get core concepts, real-world examples, and an instant MCQ test.",
            },
            {
              icon: "⚡",
              badge: "Emergency Mode",
              badgeClass: "badge-rush",
              title: "PrepRush Mode",
              desc: "Short on time? AI picks the highest-weightage topics and builds a 24-hour survival schedule.",
            },
            {
              icon: "🎯",
              badge: "Q&A Practice",
              badgeClass: "badge-green",
              title: "AI Evaluation",
              desc: "Write your answer and get instant AI feedback with a score and ideal answer comparison.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="card"
              style={{ textAlign: "left" }}
            >
              <span style={{ fontSize: "1.8rem" }}>{f.icon}</span>
              <span className={`badge ${f.badgeClass}`} style={{ display: "block", width: "fit-content", margin: "10px 0 8px" }}>
                {f.badge}
              </span>
              <h3 style={{ fontWeight: 700, marginBottom: "6px", fontSize: "1rem" }}>{f.title}</h3>
              <p style={{ color: "var(--text-dim)", fontSize: "0.86rem", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "1.25rem",
          borderTop: "1px solid var(--border)",
          color: "var(--text-dim)",
          fontSize: "0.8rem",
        }}
      >
        PrepRush © 2025 · AI-Powered Exam Preparation
      </footer>
    </div>
  );
}
