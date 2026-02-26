"use client";

import { useState } from "react";

const EMAILS = [
  { day: 1, label: "Día 2 — Tu historia", subject: "Por qué hago este curso (y por qué no es uno más)" },
  { day: 2, label: "Día 4 — El caso de los 2,7M", subject: "2,7 millones en 30 días con IA. Sin saber programar." },
  { day: 3, label: "Día 6 — Lo que te diferencia", subject: "Lo que la mayoría se equivoca sobre la IA" },
  { day: 4, label: "Día 7 — Cierre", subject: "Últimas plazas — The AI Playbook abre el 9 de marzo" },
  { day: 5, label: "Día 9 — Seguimiento personal", subject: "¿Todo bien, [Nombre]?" },
];

type Status = "idle" | "loading" | "success" | "error";

export default function SendEmailPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const selectedEmail = EMAILS.find((e) => e.day === selectedDay);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDay) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, day: selectedDay }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Error desconocido.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSelectedDay(null);
    } catch {
      setErrorMsg("Error de conexión.");
      setStatus("error");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#FF5733",
              marginBottom: 10,
            }}
          >
            The AI Playbook
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "#ffffff",
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            Enviar email de secuencia
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ana García"
              required
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#FF5733"; e.currentTarget.style.outline = "none"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ana@ejemplo.com"
              required
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#FF5733"; e.currentTarget.style.outline = "none"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; }}
            />
          </div>

          {/* Email selector */}
          <div style={{ marginBottom: 32 }}>
            <label style={labelStyle}>Email a enviar</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {EMAILS.map((em) => {
                const isSelected = selectedDay === em.day;
                return (
                  <button
                    key={em.day}
                    type="button"
                    onClick={() => setSelectedDay(em.day)}
                    style={{
                      background: isSelected ? "#1a1a1a" : "transparent",
                      border: `1px solid ${isSelected ? "#FF5733" : "#2a2a2a"}`,
                      borderRadius: 6,
                      padding: "14px 16px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "border-color 0.15s, background 0.15s",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isSelected ? "#FF5733" : "#888",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {em.label}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: isSelected ? "#ccc" : "#555",
                        fontStyle: "italic",
                      }}
                    >
                      {em.subject}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview of what will be sent */}
          {selectedEmail && name && email && (
            <div
              style={{
                marginBottom: 24,
                padding: "14px 16px",
                background: "#161616",
                border: "1px solid #2a2a2a",
                borderRadius: 6,
                fontSize: 13,
                color: "#666",
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: "#444", fontWeight: 600 }}>Enviando a: </span>
              <span style={{ color: "#aaa" }}>{name}</span>
              <span style={{ color: "#444" }}> &lt;{email}&gt;</span>
              <br />
              <span style={{ color: "#444", fontWeight: 600 }}>Asunto: </span>
              <span style={{ color: "#aaa" }}>
                {selectedEmail.subject.replace("[Nombre]", name)}
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading" || !selectedDay || !name || !email}
            style={{
              width: "100%",
              padding: "15px 24px",
              background:
                status === "loading" || !selectedDay || !name || !email
                  ? "#2a2a2a"
                  : "#FF5733",
              color:
                status === "loading" || !selectedDay || !name || !email
                  ? "#555"
                  : "#ffffff",
              border: "none",
              borderRadius: 6,
              fontSize: 15,
              fontWeight: 600,
              cursor:
                status === "loading" || !selectedDay || !name || !email
                  ? "not-allowed"
                  : "pointer",
              transition: "background 0.15s, color 0.15s",
              letterSpacing: "0.02em",
            }}
          >
            {status === "loading" ? "Enviando..." : "Enviar email →"}
          </button>
        </form>

        {/* Feedback */}
        {status === "success" && (
          <div
            style={{
              marginTop: 20,
              padding: "14px 16px",
              background: "#0d1f0d",
              border: "1px solid #1a4a1a",
              borderRadius: 6,
              fontSize: 14,
              color: "#4ade80",
            }}
          >
            ✓ Email enviado correctamente.
          </div>
        )}

        {status === "error" && (
          <div
            style={{
              marginTop: 20,
              padding: "14px 16px",
              background: "#1f0d0d",
              border: "1px solid #4a1a1a",
              borderRadius: 6,
              fontSize: 14,
              color: "#f87171",
            }}
          >
            ✗ {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#555",
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: 6,
  fontSize: 15,
  color: "#ffffff",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
};
