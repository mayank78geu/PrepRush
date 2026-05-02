"use client";

import AuthGuard from "@/components/layout/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { apiMethods } from "@/lib/api";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";

const ACADEMIC_LEVELS = [
  { value: "School (Class 9–10)", label: "School (Class 9–10)" },
  { value: "School (Class 11–12)", label: "School (Class 11–12)" },
  { value: "Undergraduate", label: "Undergraduate (UG)" },
  { value: "Postgraduate", label: "Postgraduate (PG)" },
  { value: "Competitive Exam", label: "Competitive Exam (UPSC/JEE/NEET…)" },
  { value: "Other", label: "Other" },
];

const ACADEMIC_DETAILS_MAP: Record<string, string[]> = {
  "School (Class 9–10)": ["Class 9", "Class 10"],
  "School (Class 11–12)": ["Class 11 (PCM)", "Class 11 (PCB)", "Class 11 (Commerce)", "Class 12 (PCM)", "Class 12 (PCB)", "Class 12 (Commerce)"],
  "Undergraduate": ["BCA", "BTech / BE", "BSc", "BCom", "BA", "BBA", "Other UG"],
  "Postgraduate": ["MCA", "MTech / ME", "MSc", "MCom", "MA", "MBA", "Other PG"],
  "Competitive Exam": ["UPSC Civil Services", "JEE Main / Advanced", "NEET", "CAT / MBA Entrance", "GATE", "Other"],
  "Other": [],
};

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [academicLevel, setAcademicLevel] = useState(user?.academicLevel ?? "");
  const [academicDetails, setAcademicDetails] = useState(user?.academicDetails ?? "");
  const [customDetails, setCustomDetails] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Sync fields when user loads from context
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setAcademicLevel(user.academicLevel ?? "");
      setAcademicDetails(user.academicDetails ?? "");
    }
  }, [user]);

  const detailOptions = ACADEMIC_DETAILS_MAP[academicLevel] ?? [];
  const isCustomDetails = academicLevel === "Other" || !detailOptions.length;

  const handleLevelChange = (level: string) => {
    setAcademicLevel(level);
    setAcademicDetails(""); // reset when level changes
    setCustomDetails("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Name cannot be empty."); return; }
    setError("");
    setSuccess(false);
    setSaving(true);

    const finalDetails = isCustomDetails ? customDetails.trim() : academicDetails;

    try {
      const updated = await apiMethods.updateProfile({
        name: name.trim(),
        academicLevel,
        academicDetails: finalDetails || undefined,
      });
      setUser(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { message?: string } | undefined)?.message;
        setError(msg || "Failed to save profile.");
      } else {
        setError("Failed to save profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard>
      <div className="animate-slide-up" style={{ maxWidth: "560px" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "4px" }}>My Profile</h1>
          <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
            Save your academic details once — we'll auto-fill them in every session.
          </p>
        </div>

        {/* Avatar Card */}
        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
            background: "linear-gradient(135deg, var(--surface-light), var(--surface))",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.4rem",
              flexShrink: 0,
            }}
          >
            {(user?.name ?? "U")[0].toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 700, marginBottom: "2px" }}>{user?.name}</p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>{user?.email}</p>
            {user?.academicLevel && (
              <span className="badge badge-primary" style={{ marginTop: "6px" }}>
                {user.academicLevel}{user.academicDetails ? ` · ${user.academicDetails}` : ""}
              </span>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="card">
          {/* Name */}
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="name" className="input-label">Full Name</label>
            <input
              id="name"
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          {/* Academic Level */}
          <div style={{ marginBottom: "16px" }}>
            <label className="input-label">Academic Level</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {ACADEMIC_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleLevelChange(level.value)}
                  style={{
                    padding: "12px 10px",
                    borderRadius: "10px",
                    border: `1px solid ${academicLevel === level.value ? "var(--primary)" : "var(--border)"}`,
                    background: academicLevel === level.value ? "rgba(99,102,241,0.12)" : "var(--bg)",
                    color: academicLevel === level.value ? "var(--primary)" : "var(--text-dim)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    transition: "var(--transition)",
                  }}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Academic Details (sub-selection) */}
          {academicLevel && (
            <div style={{ marginBottom: "20px" }}>
              <label className="input-label">
                {isCustomDetails ? "Specify Your Course / Details" : "Your Specific Class / Course"}
              </label>

              {isCustomDetails ? (
                <input
                  type="text"
                  className="input-field"
                  value={isCustomDetails ? customDetails : academicDetails}
                  onChange={(e) => isCustomDetails ? setCustomDetails(e.target.value) : setAcademicDetails(e.target.value)}
                  placeholder="e.g. BCA 3rd Year, Class 11 PCM…"
                />
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {detailOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAcademicDetails(opt)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "20px",
                        border: `1px solid ${academicDetails === opt ? "var(--primary)" : "var(--border)"}`,
                        background: academicDetails === opt ? "rgba(99,102,241,0.12)" : "transparent",
                        color: academicDetails === opt ? "var(--primary)" : "var(--text-dim)",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        transition: "var(--transition)",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Error / Success */}
          {error && (
            <div
              style={{
                background: "rgba(244,63,94,0.1)",
                border: "1px solid rgba(244,63,94,0.3)",
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
          {success && (
            <div
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "var(--secondary)",
                fontSize: "0.85rem",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ✅ Profile saved successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
    </AuthGuard>
  );
}
