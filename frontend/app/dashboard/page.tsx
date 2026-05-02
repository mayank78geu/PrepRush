"use client";

import AuthGuard from "@/components/layout/AuthGuard";
import api from "@/lib/api";
import type { SessionResponse } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const modeLabel: Record<SessionResponse["mode"], string> = {
  NORMAL: "Normal Revision",
  PREP_RUSH: "PrepRush Mode",
  QA_PRACTICE: "Q&A Practice",
};
const modeBadge: Record<SessionResponse["mode"], string> = {
  NORMAL: "badge-primary",
  PREP_RUSH: "badge-rush",
  QA_PRACTICE: "badge-green",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<SessionResponse[]>("/sessions")
      .then((r) => setSessions(r.data))
      .catch(() => setError("Failed to load sessions."))
      .finally(() => setLoading(false));
  }, []);

  const recentSessions = sessions.slice(0, 5);

  return (
    <AuthGuard>
      <div className="animate-slide-up">
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "4px" }}>
              Hello, {user?.name?.split(" ")[0] ?? "Student"} 👋
            </h1>
            <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
              Ready for your next high-priority revision?
            </p>
          </div>
          <Link href="/onboarding" className="btn-primary">
            ✨ New Session
          </Link>
        </header>

        {/* Mode Cards — Bento Grid */}
        <div className="grid-bento" style={{ marginBottom: "2.5rem" }}>
          {/* Normal Revision */}
          <Link href="/onboarding" style={{ textDecoration: "none" }}>
            <div className="card card-mode" style={{ height: "100%" }}>
              <span className="badge badge-primary" style={{ marginBottom: "12px", display: "inline-block" }}>Focused Study</span>
              <h2 style={{ marginBottom: "10px", fontSize: "1.25rem" }}>Normal Revision</h2>
              <p style={{ color: "var(--text-dim)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "20px" }}>
                Deep dive into a specific topic. AI generates core points and an instant MCQ test.
              </p>
              <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.9rem" }}>Launch Module →</span>
            </div>
          </Link>

          {/* PrepRush Mode */}
          <Link href="/onboarding" style={{ textDecoration: "none" }}>
            <div className="card card-mode card-rush" style={{ height: "100%" }}>
              <span className="badge badge-rush" style={{ marginBottom: "12px", display: "inline-block" }}>Emergency Mode</span>
              <h2 style={{ marginBottom: "10px", fontSize: "1.25rem" }}>PrepRush Mode</h2>
              <p style={{ color: "var(--text-dim)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "20px" }}>
                Short on time? AI picks the highest-weightage topics and builds a survival schedule.
              </p>
              <span style={{ color: "var(--rush)", fontWeight: 700, fontSize: "0.9rem" }}>Activate 24h Plan →</span>
            </div>
          </Link>

          {/* Q&A Practice */}
          <Link href="/onboarding" style={{ textDecoration: "none" }}>
            <div className="card card-mode" style={{ borderColor: "rgba(16, 185, 129, 0.2)", height: "100%" }}>
              <span className="badge badge-green" style={{ marginBottom: "12px", display: "inline-block" }}>Q&A Practice</span>
              <h2 style={{ marginBottom: "10px", fontSize: "1.25rem" }}>AI Evaluation</h2>
              <p style={{ color: "var(--text-dim)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "20px" }}>
                Write your answer and get instant AI feedback with a score and ideal answer.
              </p>
              <span style={{ color: "var(--secondary)", fontWeight: 700, fontSize: "0.9rem" }}>Start Practice →</span>
            </div>
          </Link>
        </div>

        {/* Recent Sessions */}
        <h3 style={{ marginBottom: "16px", fontSize: "1rem", fontWeight: 700 }}>Recent Sessions</h3>

        {loading && (
          <div className="card" style={{ textAlign: "center", padding: "32px", color: "var(--text-dim)" }}>
            Loading sessions...
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              background: "rgba(244, 63, 94, 0.08)",
              border: "1px solid rgba(244, 63, 94, 0.2)",
              borderRadius: "12px",
              padding: "16px 20px",
              color: "#f87171",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && sessions.length === 0 && (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "40px",
              borderStyle: "dashed",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <p style={{ color: "var(--text-dim)", marginBottom: "16px" }}>
              No sessions yet. Start your first revision now!
            </p>
            <Link href="/onboarding" className="btn-primary" style={{ display: "inline-flex" }}>
              ✨ Start First Session
            </Link>
          </div>
        )}

        {!loading && !error && recentSessions.length > 0 && (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {recentSessions.map((session) => {
              const href =
                session.mode === "PREP_RUSH"
                  ? `/session/${session.sessionId}/prep-rush`
                  : session.mode === "QA_PRACTICE"
                  ? `/session/${session.sessionId}/qa`
                  : `/session/${session.sessionId}/normal`;
              return (
                <div key={session.sessionId} className="session-row">
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 700 }}>{session.paperName}</span>
                      <span className={`badge ${modeBadge[session.mode]}`}>
                        {modeLabel[session.mode]}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                      {session.level} · {new Date(session.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <Link href={href} className="btn-outline" style={{ padding: "6px 14px", fontSize: "0.78rem" }}>
                    Revisit
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
