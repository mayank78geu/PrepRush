/**
 * MarkdownRenderer
 * Parses Gemini-style markdown output and renders it as clean, styled HTML.
 * Handles: **bold**, *italic*, numbered headings (1. 2. 3.), bullet points (* - •),
 * inline `code`, and nested sub-bullets.
 */

interface Props {
  content: string;
  /** Optional accent color for section heading numbers */
  accentColor?: string;
}

// Split raw text into tokens with type
type Token =
  | { type: "heading"; num: string; text: string }
  | { type: "bullet"; text: string; indent: number }
  | { type: "paragraph"; text: string };

function tokenize(raw: string): Token[] {
  const lines = raw.split("\n");
  const tokens: Token[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Numbered heading: "1.", "2.", etc. at the start of a line
    const headingMatch = trimmed.match(/^(\d+)\.\s+\*\*(.+?)\*\*[:\s]*(.*)/);
    if (headingMatch) {
      const restText = headingMatch[3] ? `${headingMatch[2]}: ${headingMatch[3]}` : headingMatch[2];
      tokens.push({ type: "heading", num: headingMatch[1], text: restText });
      continue;
    }

    // Alternate numbered heading without bold: "1. Some heading text"
    const plainHeading = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (plainHeading && !trimmed.startsWith("* ") && !trimmed.startsWith("- ")) {
      // Check if it looks like a heading (short enough, or followed by colon)
      if (plainHeading[2].endsWith(":") || plainHeading[2].length < 80) {
        tokens.push({ type: "heading", num: plainHeading[1], text: plainHeading[2] });
        continue;
      }
    }

    // Bullet: "* text", "- text", or "• text" (can be indented)
    const bulletMatch = line.match(/^(\s*)[*\-•]\s+(.+)/);
    if (bulletMatch) {
      const indent = Math.floor(bulletMatch[1].length / 2);
      tokens.push({ type: "bullet", text: bulletMatch[2], indent });
      continue;
    }

    // Everything else is a paragraph
    tokens.push({ type: "paragraph", text: trimmed });
  }

  return tokens;
}

/** Parse inline markdown: **bold**, *italic*, `code` */
function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Regex for **bold**, *italic*, `code`
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Plain text before the match
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }

    if (match[0].startsWith("**")) {
      parts.push(<strong key={match.index} style={{ color: "#f1f5f9", fontWeight: 700 }}>{match[2]}</strong>);
    } else if (match[0].startsWith("*")) {
      parts.push(<em key={match.index} style={{ color: "#94a3b8" }}>{match[3]}</em>);
    } else if (match[0].startsWith("`")) {
      parts.push(
        <code
          key={match.index}
          style={{
            background: "rgba(99, 102, 241, 0.15)",
            color: "#a5b4fc",
            padding: "1px 6px",
            borderRadius: "4px",
            fontSize: "0.85em",
            fontFamily: "monospace",
          }}
        >
          {match[4]}
        </code>
      );
    }

    last = match.index + match[0].length;
  }

  // Remaining plain text
  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts.length > 0 ? parts : [text];
}

// We need React for JSX
import React from "react";

export default function MarkdownRenderer({ content, accentColor = "var(--primary)" }: Props) {
  if (!content) return null;

  const tokens = tokenize(content);

  return (
    <div style={{ lineHeight: 1.8, fontSize: "0.9rem", color: "#cbd5e1" }}>
      {tokens.map((token, i) => {
        if (token.type === "heading") {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                marginTop: i === 0 ? 0 : "18px",
                marginBottom: "8px",
              }}
            >
              {/* Number badge */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "22px",
                  height: "22px",
                  background: `${accentColor}22`,
                  color: accentColor,
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                {token.num}
              </span>
              <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.92rem" }}>
                {parseInline(token.text)}
              </span>
            </div>
          );
        }

        if (token.type === "bullet") {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
                marginLeft: `${token.indent * 16 + 32}px`,
                marginBottom: "5px",
              }}
            >
              <span
                style={{
                  color: accentColor,
                  flexShrink: 0,
                  marginTop: "6px",
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: accentColor,
                  opacity: token.indent > 0 ? 0.5 : 0.8,
                  display: "inline-block",
                }}
              />
              <span>{parseInline(token.text)}</span>
            </div>
          );
        }

        // paragraph
        return (
          <p key={i} style={{ marginBottom: "8px" }}>
            {parseInline(token.text)}
          </p>
        );
      })}
    </div>
  );
}
