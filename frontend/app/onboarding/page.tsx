"use client";

import AuthGuard from "@/components/layout/AuthGuard";
import api from "@/lib/api";
import type { CreateSessionRequest, SessionResponse } from "@/lib/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const LEVEL_OPTIONS = [
  "Class 10/12 Board",
  "Undergraduate (BCA/BTech)",
  "Competitive (UPSC/JEE/NEET)",
  "Postgraduate",
  "Other",
] as const;

/** Map profile academicLevel → session level string */
function profileLevelToSession(level: string): string {
  if (level.includes("9") || level.includes("10")) return "Class 10/12 Board";
  if (level.includes("11") || level.includes("12")) return "Class 10/12 Board";
  if (level === "Undergraduate") return "Undergraduate (BCA/BTech)";
  if (level === "Postgraduate") return "Postgraduate";
  if (level === "Competitive Exam") return "Competitive (UPSC/JEE/NEET)";
  return "Other";
}

type ModeOption = "NORMAL" | "PREP_RUSH" | "QA_PRACTICE";

const MODES: {
  value: ModeOption;
  label: string;
  desc: string;
  badge: string;
  badgeClass: string;
  color: string;
}[] = [
  {
    value: "NORMAL",
    label: "Normal Revision",
    desc: "Deep dive into a topic. AI generates core points + instant MCQ test.",
    badge: "Focused Study",
    badgeClass: "badge-primary",
    color: "var(--primary)",
  },
  {
    value: "PREP_RUSH",
    label: "PrepRush Mode",
    desc: "Short on time? AI picks top topics and builds a 24h survival schedule.",
    badge: "Emergency Mode",
    badgeClass: "badge-rush",
    color: "var(--rush)",
  },
  {
    value: "QA_PRACTICE",
    label: "Q&A Practice",
    desc: "Write answers and get instant AI feedback with a score and ideal answer.",
    badge: "AI Evaluation",
    badgeClass: "badge-green",
    color: "var(--secondary)",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Whether the user has a saved profile level we can use silently
  const hasProfileLevel = Boolean(user?.academicLevel);

  const [form, setForm] = useState<CreateSessionRequest>({
    paperName: "",
    level: LEVEL_OPTIONS[0],
    mode: "NORMAL",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Silently set level from profile — user won't even see this field
  useEffect(() => {
    if (user?.academicLevel) {
      setForm((p) => ({ ...p, level: profileLevelToSession(user.academicLevel!) }));
    }
  }, [user?.academicLevel]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.paperName.trim()) {
      setError("Please enter a subject or exam name.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const response = await api.post<SessionResponse>("/sessions", {
        ...form,
        paperName: form.paperName.trim(),
      });
      const { sessionId } = response.data;
      const path =
        form.mode === "PREP_RUSH"
          ? `/session/${sessionId}/prep-rush`
          : form.mode === "QA_PRACTICE"
          ? `/session/${sessionId}/qa`
          : `/session/${sessionId}/normal`;
      router.push(path);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { message?: string } | undefined)?.message;
        setError(msg || "Failed to start session. Please try again.");
      } else {
        setError("Failed to start session. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMode = MODES.find((m) => m.value === form.mode)!;

  return (
    <AuthGuard>
      <div className="animate-slide-up" style={{ maxWidth: "560px", margin: "2rem auto" }}>

        {/* Page header */}
        <h2 style={{ marginBottom: "4px", fontSize: "1.5rem", fontWeight: 800, color: selectedMode.color }}>
          New Study Session
        </h2>
        <p style={{ color: "var(--text-dim)", marginBottom: "1.75rem", fontSize: "0.9rem" }}>
          Pick a mode and tell us what you're studying — that's all.
        </p>

        {/* ── Mode Selector ── */}
        <div className="grid-modes" style={{ marginBottom: "20px" }}>
          {MODES.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => setForm((p) => ({ ...p, mode: mode.value }))}
              style={{
                background: form.mode === mode.value ? "var(--surface-light)" : "var(--surface)",
                border: `1px solid ${form.mode === mode.value ? mode.color : "var(--border)"}`,
                borderRadius: "12px",
                padding: "16px 12px",
                cursor: "pointer",
                textAlign: "left",
                transition: "var(--transition)",
                color: "var(--text-main)",
                boxShadow: form.mode === mode.value ? `0 0 20px ${mode.color}22` : "none",
              }}
            >
              <span className={`badge ${mode.badgeClass}`} style={{ marginBottom: "8px", display: "inline-block" }}>
                {mode.badge}
              </span>
              <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "4px" }}>{mode.label}</p>
              <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", lineHeight: 1.5 }}>{mode.desc}</p>
            </button>
          ))}
        </div>

        {/* ── Main Form ── */}
        <form onSubmit={handleSubmit} className="card">

          {/* Subject / Exam Name — the ONLY required input */}
          <div style={{ marginBottom: hasProfileLevel ? "0" : "16px" }}>
            <label htmlFor="paperName" className="input-label">
              Subject / Exam Name
            </label>
            <input
              id="paperName"
              type="text"
              className="input-field"
              placeholder="e.g. UPSC Modern History, Class 12 Physics, BCA OS"
              value={form.paperName}
              onChange={(e) => setForm((p) => ({ ...p, paperName: e.target.value }))}
            />
          </div>

          {/* ── Level field: ONLY shown if no profile level ── */}
          {!hasProfileLevel ? (
            <div style={{ marginBottom: "8px", marginTop: "16px" }}>
              <label htmlFor="level" className="input-label">
                Academic Level
                <span style={{ color: "#f59e0b", fontSize: "0.75rem", marginLeft: "8px", fontWeight: 500 }}>
                  (Save this in your{" "}
                  <Link href="/profile" style={{ color: "#f59e0b", textDecoration: "underline" }}>
                    Profile
                  </Link>{" "}
                  to skip this forever)
                </span>
              </label>
              <select
                id="level"
                className="input-field"
                value={form.level}
                onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}
                style={{ cursor: "pointer" }}
              >
                {LEVEL_OPTIONS.map((l) => (
                  <option key={l} value={l} style={{ background: "var(--bg)" }}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            /* Silent confirmation — not a form field, just a tiny note */
            <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "10px" }}>
              🎓 Level auto-set from your profile:{" "}
              <strong style={{ color: "var(--primary)" }}>
                {user?.academicLevel}{user?.academicDetails ? ` · ${user.academicDetails}` : ""}
              </strong>
              {" · "}
              <Link href="/profile" style={{ color: "var(--text-dim)", textDecoration: "underline" }}>
                Change
              </Link>
            </p>
          )}

          {/* Error */}
          {error && (
            <div
              style={{
                background: "rgba(244, 63, 94, 0.1)",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#f87171",
                fontSize: "0.85rem",
                marginTop: "16px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={form.mode === "PREP_RUSH" ? "btn-rush" : "btn-primary"}
            style={{ width: "100%", justifyContent: "center", marginTop: "20px", opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Generating AI Material..." : "✨ Generate AI Material"}
          </button>
        </form>
      </div>
    </AuthGuard>
  );
}
