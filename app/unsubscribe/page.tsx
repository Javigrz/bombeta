"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

type Status = "ok" | "invalid" | "error" | "pending"

function UnsubscribeContent() {
  const params = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return null

  const status = (params.get("status") as Status | null) ?? "ok"
  const email = params.get("email")

  const { title, body } = getCopy(status, email)

  return (
    <div className="min-h-screen bg-[#1A0A00] flex flex-col items-center justify-center px-6 py-16">
      <div
        className="flex flex-col items-center text-center max-w-lg gap-10 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)" }}
      >
        <div className="w-16 h-16 rounded-full bg-[#FE4629]/15 border border-[#FE4629]/30 flex items-center justify-center">
          {status === "ok" ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#FE4629" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 8v5M12 17h.01" stroke="#FE4629" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" stroke="#FE4629" strokeWidth="2" />
            </svg>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-inter text-4xl md:text-5xl text-[#FAF5EB] leading-tight font-semibold">
            {title}
          </h1>
          <p className="font-inter text-base text-[#FAF5EB]/60 leading-relaxed whitespace-pre-line">
            {body}
          </p>
        </div>

        <div className="w-full h-px bg-[#FAF5EB]/10" />

        <p className="font-inter text-sm text-[#FAF5EB]/30">
          Si fue un error o cambias de opinión, escríbenos a{" "}
          <a href="mailto:contact@javiggil.com" className="text-[#FE4629]/70 hover:text-[#FE4629] transition-colors">
            contact@javiggil.com
          </a>
        </p>
      </div>
    </div>
  )
}

function getCopy(status: Status, email: string | null): { title: string; body: string } {
  switch (status) {
    case "ok":
      return {
        title: "Te has dado de baja.",
        body: email
          ? `${email} ya no recibirá más emails del curso.\n\nLas confirmaciones de compra y entregas de producto se siguen enviando porque son notificaciones esenciales.`
          : "Ya no recibirás más emails del curso.\n\nLas confirmaciones de compra y entregas de producto se siguen enviando porque son notificaciones esenciales.",
      }
    case "invalid":
      return {
        title: "Enlace no válido.",
        body: "El enlace no incluye un email reconocible. Si quieres darte de baja, escríbenos a contact@javiggil.com y lo gestionamos manualmente.",
      }
    case "error":
      return {
        title: "Algo ha fallado.",
        body: "No hemos podido procesar tu baja en este momento. Inténtalo de nuevo en unos minutos o escríbenos a contact@javiggil.com.",
      }
    default:
      return {
        title: "Procesando…",
        body: "",
      }
  }
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeContent />
    </Suspense>
  )
}
