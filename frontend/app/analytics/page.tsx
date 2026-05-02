"use client";

import AuthGuard from "@/components/layout/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { apiMethods } from "@/lib/api";
import type { AnalyticsResponse } from "@/lib/types";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiMethods.getAnalytics();
        setData(response);
      } catch (err) {
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    void fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AuthGuard>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "var(--text-dim)" }}>
          Loading your analytics...
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div style={{ color: "#f87171", textAlign: "center", marginTop: "2rem" }}>{error}</div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="animate-slide-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "8px", color: "var(--primary)" }}>
            Learning Analytics
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: "0.95rem" }}>
            Track your progress across sessions, quizzes, and Q&A practice.
          </p>
        </div>

        {/* Top Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "2rem",
          }}
        >
          {/* Total Sessions Card */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "1.8rem" }}>📚</span>
            <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", fontWeight: 600 }}>TOTAL SESSIONS</p>
            <p style={{ fontSize: "2rem", fontWeight: 800 }}>{data?.totalSessions}</p>
          </div>

          {/* Quiz Accuracy Card */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "1.8rem" }}>🎯</span>
            <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", fontWeight: 600 }}>QUIZ ACCURACY</p>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)" }}>
              {data?.quizAccuracyPercentage.toFixed(1)}%
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Across {data?.totalQuizzes} questions</p>
          </div>

          {/* Average QA Score Card */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "1.8rem" }}>✍️</span>
            <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", fontWeight: 600 }}>AVG Q&A SCORE</p>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: "var(--secondary)" }}>
              {data?.averageQAScore.toFixed(1)} <span style={{ fontSize: "1rem", color: "var(--text-dim)" }}>/ 10</span>
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Across {data?.totalQAPractice} answers</p>
          </div>
        </div>

        {/* Visual Progress Bars */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Performance Overview</h3>
          
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-dim)" }}>Quiz Accuracy</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>{data?.quizAccuracyPercentage.toFixed(1)}%</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "var(--surface-light)", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  background: "var(--primary)",
                  width: `${data?.quizAccuracyPercentage}%`,
                  transition: "width 1s ease-out",
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-dim)" }}>Avg Q&A Score (out of 10)</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--secondary)" }}>{data?.averageQAScore.toFixed(1)}/10</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "var(--surface-light)", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  background: "var(--secondary)",
                  width: `${(data?.averageQAScore || 0) * 10}%`,
                  transition: "width 1s ease-out",
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="card">
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Recent Activity</h3>
          {data?.recentSessions && data.recentSessions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {data.recentSessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/session/${session.id}/${session.mode === "PREP_RUSH" ? "prep-rush" : session.mode === "QA_PRACTICE" ? "qa" : "normal"}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: "var(--surface-light)",
                    borderRadius: "12px",
                    textDecoration: "none",
                    transition: "var(--transition)",
                  }}
                  className="hover-card"
                >
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-main)", marginBottom: "4px" }}>
                      {session.paperName}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        className={`badge ${
                          session.mode === "PREP_RUSH"
                            ? "badge-rush"
                            : session.mode === "QA_PRACTICE"
                            ? "badge-green"
                            : "badge-primary"
                        }`}
                        style={{ fontSize: "0.7rem", padding: "4px 8px" }}
                      >
                        {session.mode === "PREP_RUSH" ? "PrepRush" : session.mode === "QA_PRACTICE" ? "Q&A" : "Normal"}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                        {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span style={{ color: "var(--text-dim)" }}>→</span>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>No recent activity found. Start a new session!</p>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
