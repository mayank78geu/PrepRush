"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiMethods } from "@/lib/api";
import { QAQuestionResponse, QAEvaluationResponse } from "@/lib/types";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "var(--secondary)",
  medium: "#f59e0b",
  hard: "var(--rush)",
};

export default function QAPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = parseInt(params.sessionId as string, 10);

  const [topicName, setTopicName] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [questionData, setQuestionData] = useState<QAQuestionResponse | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [loadingEval, setLoadingEval] = useState(false);
  const [evalData, setEvalData] = useState<QAEvaluationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;
    setLoadingQuestion(true);
    setError(null);
    setEvalData(null);
    setUserAnswer("");
    try {
      const data = await apiMethods.getQAQuestion({ sessionId, topicName, difficulty });
      setQuestionData(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to generate question.");
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!questionData || !userAnswer.trim()) return;
    setLoadingEval(true);
    setError(null);
    try {
      const data = await apiMethods.evaluateQAAnswer({
        sessionId,
        topicName,
        question: questionData.question,
        userAnswer,
      });
      setEvalData(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to evaluate answer.");
    } finally {
      setLoadingEval(false);
    }
  };

  const handleNextQuestion = () => {
    setQuestionData(null);
    setEvalData(null);
    setUserAnswer("");
  };

  return (
    <div className="animate-slide-up">
      {/* Session Header */}
      <div
        style={{
          background: "linear-gradient(to right, var(--surface), transparent)",
          padding: "28px 32px",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span className="badge badge-green" style={{ marginBottom: "10px", display: "inline-block" }}>
            Q&A Practice
          </span>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            {topicName || "AI-Powered Q&A"}
          </h1>
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

      {/* Topic Setup */}
      {!questionData && (
        <form onSubmit={handleGetQuestion} className="card" style={{ maxWidth: "600px" }}>
          <h3 style={{ marginBottom: "16px", fontWeight: 700 }}>What would you like to practice?</h3>

          <div style={{ marginBottom: "16px" }}>
            <label className="input-label">Topic Name</label>
            <input
              type="text"
              className="input-field"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="e.g. Object Oriented Programming, Indian Constitution"
              required
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label className="input-label">Difficulty</label>
            <div style={{ display: "flex", gap: "10px" }}>
              {["easy", "medium", "hard"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    border: `1px solid ${difficulty === level ? DIFFICULTY_COLORS[level] : "var(--border)"}`,
                    background: difficulty === level ? `${DIFFICULTY_COLORS[level]}22` : "var(--bg)",
                    color: difficulty === level ? DIFFICULTY_COLORS[level] : "var(--text-dim)",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textTransform: "capitalize",
                    transition: "var(--transition)",
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingQuestion || !topicName.trim()}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", opacity: loadingQuestion ? 0.7 : 1 }}
          >
            {loadingQuestion ? "Generating Question..." : "🎯 Start Practice →"}
          </button>
        </form>
      )}

      {/* Question + Answer */}
      {questionData && !evalData && (
        <div style={{ maxWidth: "700px" }}>
          {/* Question Card */}
          <div
            className="card"
            style={{
              marginBottom: "20px",
              borderColor: `${DIFFICULTY_COLORS[questionData.difficulty] || "var(--border)"}44`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {topicName}
              </span>
              <span
                style={{
                  background: `${DIFFICULTY_COLORS[questionData.difficulty] || "#6366f1"}22`,
                  color: DIFFICULTY_COLORS[questionData.difficulty] || "var(--primary)",
                  padding: "3px 10px",
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                {questionData.difficulty}
              </span>
            </div>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, fontWeight: 500 }}>
              {questionData.question}
            </p>
          </div>

          {/* Answer Area */}
          <div className="card">
            <h3 style={{ marginBottom: "12px", fontWeight: 700 }}>Your Answer</h3>
            <textarea
              className="input-field"
              rows={6}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Write a detailed answer here. Use keywords, give examples if possible..."
              style={{ resize: "vertical", marginBottom: "16px" }}
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={loadingEval || !userAnswer.trim()}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", opacity: loadingEval ? 0.7 : 1 }}
            >
              {loadingEval ? "AI is evaluating..." : "Get AI Feedback →"}
            </button>
          </div>
        </div>
      )}

      {/* Feedback Card */}
      {evalData && (
        <div style={{ maxWidth: "700px" }} className="animate-slide-up">
          {/* Score */}
          <div
            className="card"
            style={{
              textAlign: "center",
              marginBottom: "16px",
              borderColor: evalData.score >= 7 ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)",
            }}
          >
            <div
              style={{
                fontSize: "3.5rem",
                fontWeight: 800,
                color: evalData.score >= 7 ? "var(--secondary)" : evalData.score >= 5 ? "#f59e0b" : "var(--rush)",
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              {evalData.score}/10
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
              {evalData.score >= 8 ? "Excellent answer! 🎉" : evalData.score >= 5 ? "Good effort! 💪" : "Keep practicing! 📚"}
            </p>
          </div>

          {/* Feedback */}
          <div className="card" style={{ marginBottom: "16px" }}>
            <h3
              style={{
                marginBottom: "12px",
                fontWeight: 700,
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              🤖 AI Feedback
            </h3>
            <MarkdownRenderer content={evalData.feedback} accentColor="var(--primary)" />
          </div>

          {/* Ideal Answer */}
          <div
            className="card"
            style={{
              borderLeft: "4px solid var(--secondary)",
              borderRadius: "0 var(--radius) var(--radius) 0",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                marginBottom: "12px",
                fontWeight: 700,
                color: "var(--secondary)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ✅ Ideal Answer
            </h3>
            <MarkdownRenderer content={evalData.idealAnswer} accentColor="var(--secondary)" />
          </div>

          <button
            onClick={handleNextQuestion}
            className="btn-outline"
            style={{ fontSize: "0.9rem" }}
          >
            Try Another Question →
          </button>
        </div>
      )}
    </div>
  );
}
