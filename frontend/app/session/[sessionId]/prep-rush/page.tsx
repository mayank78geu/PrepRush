"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiMethods } from "@/lib/api";
import { PrepRushResponse, TopicDetailResponse } from "@/lib/types";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

export default function PrepRushPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = parseInt(params.sessionId as string, 10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prepRushData, setPrepRushData] = useState<PrepRushResponse | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [topicDetail, setTopicDetail] = useState<TopicDetailResponse | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiMethods.generatePrepRush({ sessionId });
        setPrepRushData(data);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        setError(e.response?.data?.message || "Failed to generate PrepRush plan.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sessionId]);

  const handleSelectTopic = async (topic: string) => {
    setSelectedTopic(topic);
    setTopicDetail(null);
    setLoadingDetail(true);
    try {
      const data = await apiMethods.getTopicDetail({ sessionId, topicName: topic });
      setTopicDetail(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to fetch topic details.");
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="animate-slide-up">
      {/* Session Header */}
      <div
        style={{
          background: "linear-gradient(to right, #2d0a12, transparent)",
          padding: "28px 32px",
          borderRadius: "var(--radius)",
          border: "1px solid rgba(244, 63, 94, 0.25)",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <span className="badge badge-rush" style={{ marginBottom: "10px", display: "inline-block" }}>
            🔥 Emergency Mode Active
          </span>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>PrepRush Survival Plan</h1>
          <p style={{ color: "var(--text-dim)", fontSize: "0.88rem", marginTop: "4px" }}>
            AI-curated high-priority topics and 24-hour revision schedule.
          </p>
        </div>
        <button
          className="btn-outline"
          onClick={() => router.push("/dashboard")}
          style={{ fontSize: "0.85rem", padding: "8px 16px" }}
        >
          End Session
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(244, 63, 94, 0.1)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            borderRadius: "10px",
            padding: "14px 18px",
            color: "#f87171",
            fontSize: "0.88rem",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "40px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "3px solid var(--rush)",
              borderTopColor: "transparent",
              animation: "spin 0.8s linear infinite",
              flexShrink: 0,
            }}
          />
          <div>
            <p style={{ fontWeight: 700 }}>Generating your 24-hour survival plan...</p>
            <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
              AI is analyzing high-priority topics for your exam.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && prepRushData && (
        <div className="grid-3col">
          {/* Topics Sidebar */}
          <div>
            <div className="card" style={{ borderColor: "rgba(244, 63, 94, 0.2)", padding: "0" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border)",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  color: "var(--rush)",
                }}
              >
                🎯 High-Priority Topics
              </div>
              {prepRushData.importantTopics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectTopic(topic)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "14px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: selectedTopic === topic ? "rgba(244, 63, 94, 0.08)" : "transparent",
                    borderLeft: selectedTopic === topic ? "3px solid var(--rush)" : "3px solid transparent",
                    borderBottom: i < prepRushData.importantTopics.length - 1 ? "1px solid var(--border)" : "none",
                    cursor: "pointer",
                    transition: "var(--transition)",
                    color: selectedTopic === topic ? "var(--text-main)" : "var(--text-dim)",
                    fontSize: "0.88rem",
                    fontWeight: selectedTopic === topic ? 700 : 500,
                  }}
                >
                  <span
                    style={{
                      color: "var(--rush)",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      flexShrink: 0,
                      opacity: 0.7,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Revision Plan Timeline */}
          <div>
            <div className="card" style={{ borderColor: "rgba(244, 63, 94, 0.15)" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                📅 24-Hour Revision Plan
              </h3>
              {Object.entries(prepRushData.revisionPlan).map(([timeSlot, topics]) => (
                <div
                  key={timeSlot}
                  style={{
                    marginBottom: "16px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "var(--rush)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "8px",
                    }}
                  >
                    {timeSlot}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {topics.map((topic, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "4px 10px",
                          background: "rgba(244, 63, 94, 0.08)",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--text-dim)",
                          cursor: "pointer",
                          border: "1px solid rgba(244, 63, 94, 0.15)",
                          transition: "var(--transition)",
                        }}
                        onClick={() => handleSelectTopic(topic)}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Detail */}
          <div>
            {!selectedTopic && (
              <div
                className="card"
                style={{
                  textAlign: "center",
                  padding: "40px 24px",
                  borderStyle: "dashed",
                  borderColor: "rgba(255,255,255,0.08)",
                  color: "var(--text-dim)",
                  fontSize: "0.88rem",
                }}
              >
                <p style={{ fontSize: "1.5rem", marginBottom: "12px" }}>👈</p>
                <p>Click any topic to see a deep explanation, real-world example, and exam writing strategy.</p>
              </div>
            )}

            {loadingDetail && (
              <div className="card" style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "3px solid var(--primary)",
                    borderTopColor: "transparent",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>
            )}

            {topicDetail && !loadingDetail && (
              <div className="animate-slide-up">
                <div className="card" style={{ marginBottom: "16px", borderColor: "rgba(99, 102, 241, 0.2)" }}>
                  <h3 style={{ fontWeight: 800, marginBottom: "16px" }}>{topicDetail.topicName}</h3>

                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                      💡 Explanation
                    </p>
                    <MarkdownRenderer content={topicDetail.explanation} accentColor="var(--primary)" />
                  </div>

                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.06)",
                      borderLeft: "4px solid var(--secondary)",
                      padding: "16px",
                      borderRadius: "0 10px 10px 0",
                      marginBottom: "16px",
                    }}
                  >
                    <p style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                      🚀 Real-World Example
                    </p>
                    <MarkdownRenderer content={topicDetail.realWorldExample} accentColor="var(--secondary)" />
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "10px",
                      padding: "16px",
                    }}
                  >
                    <p style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                      📝 Exam Writing Strategy
                    </p>
                    <MarkdownRenderer content={topicDetail.idealAnswerFormat} accentColor="var(--primary)" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
