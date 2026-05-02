"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { ImportantPointsResponse, QuizQuestionResponse, QuizResultResponse } from "@/lib/types";
import Link from "next/link";

export default function NormalRevisionPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const sid = parseInt(sessionId as string, 10);

  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pointsData, setPointsData] = useState<ImportantPointsResponse | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestionResponse[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [result, setResult] = useState<QuizResultResponse | null>(null);

  const handleGetPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;
    setLoading(true);
    setError("");
    setPointsData(null);
    setQuestions([]);
    setResult(null);
    try {
      const res = await api.post("/revision/important-points", { sessionId: sid, topicName });
      setPointsData(res.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to fetch important points.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setError("");
    setQuestions([]);
    setResult(null);
    setAnswers({});
    try {
      const res = await api.post("/revision/quiz", {
        sessionId: sid,
        topicName: pointsData?.topicName || topicName,
        numberOfQuestions: 5,
      });
      setQuestions(res.data.questions);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to generate quiz.");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setSubmitLoading(true);
    setError("");
    try {
      const res = await api.post("/revision/quiz/submit", {
        sessionId: sid,
        topicName: pointsData?.topicName || topicName,
        answers: Object.entries(answers).map(([qId, sOpt]) => ({
          questionId: parseInt(qId, 10),
          selectedOption: sOpt,
        })),
      });
      setResult(res.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to submit quiz.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetAll = () => {
    setTopicName("");
    setPointsData(null);
    setQuestions([]);
    setResult(null);
    setAnswers({});
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
          alignItems: "flex-start",
        }}
      >
        <div>
          <span className="badge badge-primary" style={{ marginBottom: "10px", display: "inline-block" }}>
            Normal Revision
          </span>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            {pointsData?.topicName || topicName || "What topic are you revising?"}
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

      {/* Topic Input */}
      {!pointsData && !questions.length && !result && (
        <form onSubmit={handleGetPoints} className="card" style={{ maxWidth: "560px" }}>
          <h3 style={{ marginBottom: "16px", fontWeight: 700 }}>Enter a Topic to Revise</h3>
          <div style={{ marginBottom: "16px" }}>
            <label className="input-label">Topic Name</label>
            <input
              type="text"
              className="input-field"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="e.g. Laws of Motion, French Revolution"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Fetching from AI..." : "✨ Get Key Points"}
          </button>
        </form>
      )}

      {/* Main 2-Col Study View */}
      {pointsData && !result && (
        <div className="grid-2col">
          {/* Left: Explanation */}
          <div>
            <div className="card" style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "var(--text-main)", marginBottom: "20px", fontWeight: 700 }}>
                ⚡ Key Points — {pointsData.topicName}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {pointsData.importantPoints.map((point, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "14px 16px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      lineHeight: 1.6,
                      fontSize: "0.9rem",
                      color: "#cbd5e1",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--primary)",
                        fontWeight: 800,
                        fontSize: "0.8rem",
                        marginTop: "2px",
                        flexShrink: 0,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quiz Zone */}
          <div>
            <div
              style={{
                background: "var(--surface-light)",
                padding: "24px",
                borderRadius: "var(--radius)",
              }}
            >
              {questions.length === 0 ? (
                <>
                  <h3 style={{ marginBottom: "16px", fontWeight: 700 }}>Instant Practice</h3>
                  <p style={{ color: "var(--text-dim)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "20px" }}>
                    Test your understanding with a 5-question AI quiz on <strong style={{ color: "var(--text-main)" }}>{pointsData.topicName}</strong>.
                  </p>
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={quizLoading}
                    className="btn-primary"
                    style={{ width: "100%", justifyContent: "center", opacity: quizLoading ? 0.7 : 1 }}
                  >
                    {quizLoading ? "Generating Quiz..." : "🧠 Take a Quiz"}
                  </button>
                </>
              ) : (
                <>
                  <h3 style={{ marginBottom: "20px", fontWeight: 700 }}>
                    Quiz — {pointsData.topicName}
                  </h3>
                  {questions.map((q, idx) => (
                    <div key={q.id} style={{ marginBottom: "20px" }}>
                      <p
                        style={{
                          fontWeight: 600,
                          marginBottom: "12px",
                          fontSize: "0.9rem",
                          color: "var(--text-main)",
                        }}
                      >
                        Q{idx + 1}. {q.question}
                      </p>
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`quiz-option ${answers[q.id] === oIdx ? "selected" : ""}`}
                          onClick={() => setAnswers((p) => ({ ...p, [q.id]: oIdx }))}
                          style={{ marginBottom: "8px" }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  ))}
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={submitLoading}
                    className="btn-primary"
                    style={{ width: "100%", justifyContent: "center", marginTop: "8px", opacity: submitLoading ? 0.7 : 1 }}
                  >
                    {submitLoading ? "Submitting..." : "Submit Answers"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Result */}
      {result && (
        <div className="card animate-slide-up" style={{ maxWidth: "500px", textAlign: "center" }}>
          <div
            style={{
              fontSize: "3rem",
              fontWeight: 800,
              color: result.score >= result.total * 0.7 ? "var(--secondary)" : "var(--rush)",
              marginBottom: "8px",
            }}
          >
            {result.score}/{result.total}
          </div>
          <p style={{ color: "var(--text-dim)", marginBottom: "24px" }}>
            {result.score >= result.total * 0.7 ? "Excellent work! 🎉" : "Keep practicing! 💪"}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button className="btn-outline" onClick={resetAll}>
              New Topic
            </button>
            <button className="btn-primary" onClick={() => { setResult(null); setQuestions([]); handleGenerateQuiz(); }}>
              Retake Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
