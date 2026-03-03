"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import {
  CategoryData,
  PromptFull,
  STRIPE_URL,
  REVIEW_IMAGES,
  BOOKS,
} from "@/lib/prompts-data";

// ─── Prompt content parser ───────────────────────────────────────────────────
type PromptPart =
  | { type: "text"; content: string }
  | { type: "tag"; content: string }
  | { type: "directive"; content: string }
  | { type: "placeholder"; content: string };

function parsePromptContent(content: string): PromptPart[] {
  const parts: PromptPart[] = [];
  // Matches: XML tags | placeholders [text] | DIRECTIVE LABELS: (all-caps + colon)
  const regex = /(<[^>]+>)|(\[[^\]]+\])|([A-ZÁÉÍÓÚÜÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÜÑ]+)*:)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: content.slice(lastIndex, match.index) });
    }
    if (match[1]) {
      parts.push({ type: "tag", content: match[1] });
    } else if (match[2]) {
      parts.push({ type: "placeholder", content: match[2].slice(1, -1) });
    } else if (match[3]) {
      parts.push({ type: "directive", content: match[3] });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ type: "text", content: content.slice(lastIndex) });
  }
  return parts;
}

// ─── Brand tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#FAF5EB",
  dark: "#4B0A23",
  red: "#FE4629",
  muted: "#8B7355",
  card: "#F3EBD9",
  border: "rgba(75,10,35,0.1)",
  green: "#16a34a",
  greenBg: "#f0fdf4",
  greenBorder: "#bbf7d0",
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface ReelPageProps {
  prompt: PromptFull;
  extraPrompts?: PromptFull[];
  category: CategoryData;
  otherCategories: CategoryData[];
}

// ─── Buy CTA ─────────────────────────────────────────────────────────────────
function BuyCTA({ label = "primary" }: { label?: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 24px",
        borderTop: label === "final" ? `1px solid ${C.border}` : "none",
      }}
    >
      <a
        href={STRIPE_URL}
        style={{
          display: "inline-block",
          background: C.dark,
          color: C.bg,
          padding: "18px 36px",
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textDecoration: "none",
          minHeight: 56,
          lineHeight: "20px",
        }}
      >
        DESBLOQUEA LOS 111 PROMPTS →
      </a>
      <p
        style={{
          marginTop: 10,
          fontSize: 13,
          color: C.muted,
        }}
      >
        11,1€ · 0,10€ por prompt · Acceso para siempre
      </p>
    </div>
  );
}

// ─── Category accordion (other categories) ───────────────────────────────────
function CategoryAccordion({ category }: { category: CategoryData }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 12,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{category.icon}</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>
            {category.name}
          </span>
          <span
            style={{
              fontSize: 12,
              color: C.muted,
              fontWeight: 400,
            }}
          >
            ({category.count})
          </span>
        </span>
        <span
          style={{
            fontSize: 18,
            color: C.muted,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms",
            flexShrink: 0,
          }}
        >
          ↓
        </span>
      </button>

      {open && (
        <div style={{ paddingBottom: 16 }}>
          {category.prompts.map((p) => (
            <div
              key={p.number}
              style={{
                display: "flex",
                gap: 12,
                padding: "10px 0",
                borderTop: `1px solid ${C.border}`,
                opacity: p.locked ? 0.55 : 1,
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 13,
                  color: p.locked ? C.muted : C.red,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  paddingTop: 1,
                }}
              >
                {p.number}
              </span>
              <div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.dark,
                    margin: 0,
                    filter: p.locked && p.description === "" ? "blur(4px)" : "none",
                  }}
                >
                  {p.title}
                </p>
                {p.description && (
                  <p
                    style={{
                      fontSize: 13,
                      color: C.muted,
                      margin: "2px 0 0",
                      lineHeight: 1.5,
                    }}
                  >
                    {p.description}
                  </p>
                )}
                {p.source && (
                  <p
                    style={{
                      fontSize: 11,
                      color: C.red,
                      margin: "4px 0 0",
                      fontWeight: 500,
                    }}
                  >
                    {p.source}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Extra unlocked prompt block ──────────────────────────────────────────────
function ExtraPromptBlock({ prompt }: { prompt: PromptFull }) {
  const [copied, setCopied] = useState(false);
  const placeholderRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const parts = useMemo(() => parsePromptContent(prompt.content), [prompt.content]);

  async function handleCopy() {
    let pIdx = 0;
    const copyText = parts
      .map((part) => {
        if (part.type !== "placeholder") return part.content;
        const el = placeholderRefs.current[pIdx++];
        return el ? (el.textContent?.trim() || part.content) : part.content;
      })
      .join("");
    try {
      await navigator.clipboard.writeText(copyText);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = copyText;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 32px" }}>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, margin: "0 0 8px" }}>
          PROMPT {prompt.number}
        </p>
        <h2 style={{ fontFamily: "var(--font-newsreader), Georgia, serif", fontSize: "clamp(24px, 6vw, 36px)", fontWeight: 400, lineHeight: 1.1, margin: "0 0 12px", color: C.dark }}>
          {prompt.title}
        </h2>
        <p style={{ fontSize: 16, color: C.muted, margin: "0 0 6px", lineHeight: 1.5 }}>
          {prompt.description}
        </p>
        <p style={{ fontSize: 12, color: C.red, fontWeight: 600, margin: "0 0 28px" }}>
          {prompt.source}
        </p>
        <div style={{ background: "#2D0E1E", border: "1px solid rgba(254,70,41,0.2)", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 20px", background: "#3D1A2B", borderBottom: "1px solid rgba(254,70,41,0.15)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(254,70,41,0.55)", letterSpacing: "1px", textTransform: "uppercase" }}>
              ↓ copiar abajo
            </span>
          </div>
          <pre style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: 13, lineHeight: 1.7, color: "#E8DDD4", margin: 0, padding: "20px 20px 16px", whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden" }}>
            {(() => {
              let pIdx = 0;
              return parts.map((part, i) => {
                if (part.type === "text") return <span key={i}>{part.content}</span>;
                if (part.type === "tag") return <span key={i} style={{ color: "#FE4629" }}>{part.content}</span>;
                if (part.type === "directive") return <span key={i} style={{ color: "#FFB299", fontWeight: 500 }}>{part.content}</span>;
                const idx = pIdx++;
                return (
                  <span
                    key={i}
                    ref={(el) => { placeholderRefs.current[idx] = el; }}
                    contentEditable
                    suppressContentEditableWarning
                    className="prompt-placeholder"
                    style={{ display: "inline", background: "rgba(254,70,41,0.2)", border: "1px dashed #FE4629", borderRadius: 4, padding: "2px 8px", color: "#FE4629", fontWeight: 500, cursor: "text", outline: "none", minWidth: 80, fontFamily: "inherit", transition: "all 0.2s" }}
                  >
                    {part.content}
                  </span>
                );
              });
            })()}
          </pre>
        </div>
        <button
          onClick={handleCopy}
          style={{ width: "100%", padding: "16px 24px", background: copied ? C.green : C.red, color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer", minHeight: 56, transition: "background 0.2s" }}
        >
          {copied ? "✓ Prompt copiado" : "COPIAR PROMPT"}
        </button>
      </div>
    </section>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ReelPage({
  prompt,
  extraPrompts = [],
  category,
  otherCategories,
}: ReelPageProps) {
  const [copied, setCopied] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const categorySectionRef = useRef<HTMLDivElement>(null);
  const placeholderRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const parts = useMemo(() => parsePromptContent(prompt.content), [prompt.content]);
  const unlockedNumbers = useMemo(
    () => new Set([prompt.number, ...extraPrompts.map((p) => p.number)]),
    [prompt.number, extraPrompts]
  );

  async function handleCopy() {
    // Build copy text: regular parts as-is, placeholders with their current DOM value
    let pIdx = 0;
    const copyText = parts
      .map((part) => {
        if (part.type !== "placeholder") return part.content;
        const el = placeholderRefs.current[pIdx++];
        return el ? (el.textContent?.trim() || part.content) : part.content;
      })
      .join("");

    try {
      await navigator.clipboard.writeText(copyText);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = copyText;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (!bannerDismissed) {
      setTimeout(() => setShowBanner(true), 500);
    }
    setTimeout(() => setCopied(false), 2000);
  }

  function handleBannerExplore() {
    setShowBanner(false);
    setBannerDismissed(true);
    setTimeout(() => {
      categorySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 320);
  }

  function handleBannerDismiss() {
    setShowBanner(false);
    setBannerDismissed(true);
  }

  const otherCount = category.count - 1;

  const realPrompts = category.prompts.filter((p) => p.description !== "");
  const unlockedPrompt = realPrompts.find((p) => p.number === prompt.number)!;
  const byNumber = Object.fromEntries(realPrompts.map((p) => [p.number, p]));

  // Ordered display list: 5 readable (with desc) + 3 blurred thin (title only), interspersed
  const DISPLAY_ORDER: { number: string; blurred: boolean }[] = [
    { number: "001", blurred: false }, // Humaniza tu IA — clave
    { number: "002", blurred: true  }, // Matriz Eisenhower — thin blur
    { number: "015", blurred: false }, // Negociador de Sueldo
    { number: "007", blurred: false }, // Constructor de Hábitos
    { number: "003", blurred: true  }, // Sprint de Trabajo Profundo — thin blur
    { number: "009", blurred: false }, // La semana laboral de 4 horas
    { number: "017", blurred: true  }, // Antifragile — thin blur
    { number: "013", blurred: false }, // Cazador de cupones
    { number: "019", blurred: false }, // Los 7 Hábitos
  ].filter((d) => !unlockedNumbers.has(d.number) && byNumber[d.number]);

  const shownNumbers = new Set(DISPLAY_ORDER.map((d) => d.number));
  const hiddenCount = category.count - unlockedNumbers.size - shownNumbers.size;

  return (
    <div
      style={{
        background: C.bg,
        color: C.dark,
        minHeight: "100vh",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          padding: "16px 24px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <a href="/" style={{ display: "inline-flex", alignItems: "center" }}>
          <Image
            src="/javigil.svg"
            alt="javiggil"
            width={80}
            height={24}
            style={{ height: 22, width: "auto", opacity: 0.7 }}
          />
        </a>
      </header>

      {/* ── Unlocked prompt block ── */}
      <section
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "40px 24px 32px",
        }}
      >
        {/* Category badge */}
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.red,
            margin: "0 0 12px",
          }}
        >
          {category.icon} {category.name}
        </p>

        {/* Prompt number */}
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.muted,
            margin: "0 0 8px",
          }}
        >
          PROMPT {prompt.number}
        </p>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontSize: "clamp(28px, 7vw, 42px)",
            fontWeight: 400,
            lineHeight: 1.1,
            margin: "0 0 12px",
            color: C.dark,
          }}
        >
          {prompt.title}
        </h1>

        {/* One-liner */}
        <p
          style={{
            fontSize: 16,
            color: C.muted,
            margin: "0 0 6px",
            lineHeight: 1.5,
          }}
        >
          {prompt.description}
        </p>

        {/* Source */}
        <p
          style={{
            fontSize: 12,
            color: C.red,
            fontWeight: 600,
            margin: "0 0 28px",
          }}
        >
          {prompt.source}
        </p>

        {/* Prompt content block */}
        <style>{`
          .prompt-placeholder::before { content: '✎ '; font-size: 10px; opacity: 0.7; }
          .prompt-placeholder:focus { background: rgba(254,70,41,0.35) !important; border-style: solid !important; box-shadow: 0 0 0 2px rgba(254,70,41,0.3) !important; }
        `}</style>
        <div
          style={{
            background: "#2D0E1E",
            border: `1px solid rgba(254,70,41,0.2)`,
            borderRadius: 10,
            marginBottom: 16,
            overflow: "hidden",
          }}
        >
          {/* Code header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 20px", background: "#3D1A2B", borderBottom: "1px solid rgba(254,70,41,0.15)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(254,70,41,0.55)", letterSpacing: "1px", textTransform: "uppercase" }}>
              ↓ copiar abajo
            </span>
          </div>
          <pre
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              fontSize: 13,
              lineHeight: 1.7,
              color: "#E8DDD4",
              margin: 0,
              padding: "20px 20px 16px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowX: "hidden",
            }}
          >
            {(() => {
              let pIdx = 0;
              return parts.map((part, i) => {
                if (part.type === "text") return <span key={i}>{part.content}</span>;
                if (part.type === "tag") return <span key={i} style={{ color: "#FE4629" }}>{part.content}</span>;
                if (part.type === "directive") return <span key={i} style={{ color: "#FFB299", fontWeight: 500 }}>{part.content}</span>;
                const idx = pIdx++;
                return (
                  <span
                    key={i}
                    ref={(el) => { placeholderRefs.current[idx] = el; }}
                    contentEditable
                    suppressContentEditableWarning
                    className="prompt-placeholder"
                    style={{
                      display: "inline",
                      background: "rgba(254,70,41,0.2)",
                      border: "1px dashed #FE4629",
                      borderRadius: 4,
                      padding: "2px 8px",
                      color: "#FE4629",
                      fontWeight: 500,
                      cursor: "text",
                      outline: "none",
                      minWidth: 80,
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                    }}
                  >
                    {part.content}
                  </span>
                );
              });
            })()}
          </pre>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          style={{
            width: "100%",
            padding: "16px 24px",
            background: copied ? C.green : C.red,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.05em",
            cursor: "pointer",
            minHeight: 56,
            transition: "background 0.2s",
          }}
        >
          {copied ? "✓ Prompt copiado" : "COPIAR PROMPT"}
        </button>
      </section>

      {/* ── Extra unlocked prompts ── */}
      {extraPrompts.map((ep) => (
        <ExtraPromptBlock key={ep.number} prompt={ep} />
      ))}

      {/* ── Category section ── */}
      <section
        ref={categorySectionRef}
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "0 24px 40px",
        }}
      >
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 32,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.red,
              margin: "0 0 6px",
            }}
          >
            {category.icon} {category.name}
          </p>
          <p
            style={{
              fontSize: 15,
              color: C.muted,
              margin: "0 0 24px",
            }}
          >
            {category.count} prompts. {category.count} problemas resueltos.
          </p>

          {/* Prompts: unlocked one + limited locked ones */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Unlocked prompt */}
            <div
              style={{
                padding: "14px 16px",
                background: C.greenBg,
                border: `1.5px solid ${C.greenBorder}`,
                borderRadius: 8,
                marginBottom: 4,
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: C.green, paddingTop: 2 }}>✓</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.green, margin: 0 }}>
                    {unlockedPrompt.title}
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.green,
                        background: C.greenBorder,
                        padding: "2px 7px",
                        borderRadius: 100,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {copied ? "COPIADO" : "DESBLOQUEADO"}
                    </span>
                  </p>
                  {unlockedPrompt.description && (
                    <p style={{ fontSize: 13, color: C.muted, margin: "3px 0 0", lineHeight: 1.5 }}>
                      {unlockedPrompt.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Extra unlocked prompts */}
            {extraPrompts.map((ep) => {
              const epPreview = realPrompts.find((p) => p.number === ep.number);
              if (!epPreview) return null;
              return (
                <div
                  key={ep.number}
                  style={{ padding: "14px 16px", background: C.greenBg, border: `1.5px solid ${C.greenBorder}`, borderRadius: 8, marginBottom: 4 }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: C.green, paddingTop: 2 }}>✓</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: C.green, margin: 0 }}>
                        {epPreview.title}
                        <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: C.green, background: C.greenBorder, padding: "2px 7px", borderRadius: 100, letterSpacing: "0.06em" }}>
                          DESBLOQUEADO
                        </span>
                      </p>
                      {epPreview.description && (
                        <p style={{ fontSize: 13, color: C.muted, margin: "3px 0 0", lineHeight: 1.5 }}>{epPreview.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Mixed list: readable + blurred thin rows, interspersed */}
            {DISPLAY_ORDER.map(({ number, blurred }) => {
              const p = byNumber[number];
              if (!p) return null;

              if (blurred) {
                // Thin blurred row — title only, no description
                return (
                  <button
                    key={number}
                    onClick={() => setShowBuyModal(true)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      borderTop: `1px solid ${C.border}`,
                      padding: "10px 0",
                      cursor: "pointer",
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      opacity: 0.5,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.dark,
                        filter: "blur(3px)",
                        userSelect: "none",
                      }}
                    >
                      {p.title}
                    </span>
                  </button>
                );
              }

              // Readable row — title + description + source, clearly visible
              return (
                <button
                  key={number}
                  onClick={() => setShowBuyModal(true)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    borderTop: `1px solid ${C.border}`,
                    padding: "14px 0",
                    cursor: "pointer",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.dark, margin: 0 }}>
                      {p.title}
                    </p>
                    {p.description && (
                      <p style={{ fontSize: 13, color: C.muted, margin: "3px 0 0", lineHeight: 1.5 }}>
                        {p.description}
                      </p>
                    )}
                    {p.source && (
                      <p style={{ fontSize: 11, color: C.red, margin: "4px 0 0", fontWeight: 500 }}>
                        {p.source}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Summary row */}
            {hiddenCount > 0 && (
              <button
                onClick={() => setShowBuyModal(true)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  borderTop: `1px solid ${C.border}`,
                  padding: "14px 0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: 0.55,
                }}
              >
                <span style={{ fontSize: 13, color: C.muted, fontStyle: "italic", filter: "blur(2px)", userSelect: "none" }}>
                  + {hiddenCount} prompts más en {category.name}
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA 1 ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "28px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.muted,
              margin: "0 0 10px",
            }}
          >
            ¿Quieres los {otherCount} restantes de {category.name}?
          </p>
          <p
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "clamp(22px, 5vw, 30px)",
              fontWeight: 400,
              color: C.dark,
              margin: "0 0 20px",
              lineHeight: 1.2,
            }}
          >
            Desbloquea los 111 prompts.{" "}
            <span style={{ color: C.red, fontStyle: "italic" }}>11,1€.</span>
          </p>
          <a
            href={STRIPE_URL}
            style={{
              display: "inline-block",
              background: C.dark,
              color: C.bg,
              padding: "16px 32px",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textDecoration: "none",
              minHeight: 52,
            }}
          >
            DESBLOQUEAR TODO →
          </a>
          <p style={{ fontSize: 12, color: C.muted, margin: "10px 0 0" }}>
            0,10€ por prompt · Acceso para siempre
          </p>
        </div>
      </div>

      {/* ── Other categories ── */}
      <section
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.muted,
            margin: "0 0 6px",
          }}
        >
          Mira lo que hay dentro
        </p>
        <p
          style={{
            fontSize: 22,
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontWeight: 400,
            color: C.dark,
            margin: "0 0 20px",
          }}
        >
          111 prompts. 8 categorías.
        </p>

        <div>
          {otherCategories.map((cat) => (
            <CategoryAccordion key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* ── Reviews ── */}
      <section
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "0 24px 48px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.muted,
            margin: "0 0 20px",
          }}
        >
          Lo que dicen los que ya los tienen
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {REVIEW_IMAGES.map((src, i) => (
            <div
              key={i}
              style={{
                borderRadius: 10,
                overflow: "hidden",
                border: `1px solid ${C.border}`,
              }}
            >
              <Image
                src={src}
                alt={`Review ${i + 1}`}
                width={680}
                height={200}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Books strip ── */}
      <section
        style={{
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          padding: "28px 24px",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.muted,
            margin: "0 0 16px",
            textAlign: "center",
          }}
        >
          Basados en +25 libros y frameworks
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 12px",
            justifyContent: "center",
            maxWidth: 680,
            margin: "0 auto",
          }}
        >
          {BOOKS.map((book) => (
            <span
              key={book}
              style={{
                fontSize: 12,
                color: C.muted,
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 100,
                padding: "5px 12px",
                whiteSpace: "nowrap",
              }}
            >
              {book}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>
        <BuyCTA label="final" />
      </div>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: "24px",
          textAlign: "center",
        }}
      >
        <a href="/" style={{ display: "inline-block", marginBottom: 8 }}>
          <Image
            src="/javigil.svg"
            alt="javiggil"
            width={70}
            height={20}
            style={{ height: 18, width: "auto", opacity: 0.35 }}
          />
        </a>
        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
          © 2026 · @javiggil
        </p>
      </footer>

      {/* ── Buy modal (locked prompt click) ── */}
      {showBuyModal && (
        <div
          onClick={() => setShowBuyModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 400,
              background: C.bg,
              borderRadius: 16,
              padding: "28px 24px 24px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setShowBuyModal(false)}
              style={{
                position: "absolute" as const,
                top: 16,
                right: 16,
                background: "transparent",
                border: "none",
                fontSize: 20,
                color: C.muted,
                cursor: "pointer",
                lineHeight: 1,
              }}
            />

            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.red,
                margin: "0 0 12px",
              }}
            >
              Prompt bloqueado
            </p>

            <p
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontSize: "clamp(22px, 5vw, 28px)",
                fontWeight: 400,
                color: C.dark,
                lineHeight: 1.2,
                margin: "0 0 8px",
              }}
            >
              Desbloquea los{" "}
              <span style={{ color: C.red, fontStyle: "italic" }}>111 prompts</span>.
            </p>

            <p style={{ fontSize: 13, color: C.muted, margin: "0 0 20px", lineHeight: 1.5 }}>
              Acceso inmediato a todas las categorías: productividad, finanzas, marketing, creatividad y más.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
              {[
                "111 prompts listos para copiar",
                "+25 frameworks de libros integrados",
                "Funciona en ChatGPT, Claude y Gemini",
                "Acceso para siempre · Descarga instantánea",
              ].map((f) => (
                <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: C.red, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: C.dark }}>{f}</span>
                </div>
              ))}
            </div>

            <a
              href={STRIPE_URL}
              style={{
                display: "block",
                background: C.dark,
                color: C.bg,
                padding: "16px 24px",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textDecoration: "none",
                textAlign: "center",
                minHeight: 52,
                lineHeight: "20px",
              }}
            >
              DESBLOQUEAR TODO · 11,1€ →
            </a>
            <p style={{ fontSize: 12, color: C.muted, margin: "8px 0 0", textAlign: "center" }}>
              0,10€ por prompt
            </p>

            <button
              onClick={() => setShowBuyModal(false)}
              style={{
                display: "block",
                width: "100%",
                marginTop: 12,
                background: "transparent",
                border: "none",
                fontSize: 13,
                color: C.muted,
                cursor: "pointer",
                padding: "8px 0",
              }}
            >
              Ahora no
            </button>
          </div>
        </div>
      )}

      {/* ── Post-copy banner (centered modal, no overlay) ── */}
      <div
        aria-hidden={!showBanner}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          pointerEvents: showBanner ? "auto" : "none",
          opacity: showBanner ? 1 : 0,
          transform: showBanner ? "scale(1)" : "scale(0.95)",
          transition: "opacity 300ms ease-out, transform 300ms ease-out",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: C.bg,
            border: `2px solid ${C.dark}`,
            boxShadow: "0 24px 64px rgba(75,10,35,0.22)",
            borderRadius: 16,
            padding: "28px 24px 24px",
          }}
        >
          {/* ✓ Prompt copiado */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span
              style={{
                width: 24,
                height: 24,
                background: C.green,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.green, letterSpacing: "0.05em" }}>
              PROMPT COPIADO
            </span>
          </div>

          {/* Main message */}
          <p
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "clamp(22px, 5vw, 28px)",
              fontWeight: 400,
              color: C.dark,
              lineHeight: 1.2,
              margin: "0 0 6px",
            }}
          >
            Este es 1 de {category.count} de{" "}
            <span style={{ color: C.red, fontStyle: "italic" }}>{category.name}</span>.
          </p>

          {/* Sub-line: 1 de 111 */}
          <p style={{ fontSize: 12, color: C.muted, margin: "0 0 22px" }}>
            Y 1 de 111 en total.
          </p>

          {/* Description */}
          <p style={{ fontSize: 14, color: C.muted, margin: "0 0 20px", lineHeight: 1.5 }}>
            Los otros {otherCount} de {category.name} están aquí abajo.
          </p>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleBannerExplore}
              style={{
                flex: 1,
                padding: "14px 16px",
                background: C.dark,
                color: C.bg,
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                minHeight: 48,
              }}
            >
              VER LOS OTROS →
            </button>
            <button
              onClick={handleBannerDismiss}
              style={{
                padding: "14px 16px",
                background: "transparent",
                color: C.muted,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                fontSize: 20,
                cursor: "pointer",
                minHeight: 48,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
