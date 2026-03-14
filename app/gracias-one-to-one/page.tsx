"use client"

import { useEffect, useState } from "react"

export default function GraciasOneToOnePage() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#1A0A00] flex flex-col items-center justify-center px-6 py-16">
      <div
        className="flex flex-col items-center text-center max-w-xl gap-10 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)" }}
      >
        {/* Check */}
        <div className="w-16 h-16 rounded-full bg-[#FE4629]/15 border border-[#FE4629]/30 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#FE4629" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Título */}
        <div className="flex flex-col gap-4">
          <h1 className="font-inter text-4xl md:text-5xl text-[#FAF5EB] leading-tight font-semibold">
            Ya tienes tu<br />
            <span className="text-[#FE4629]">sesión 1:1.</span>
          </h1>
        </div>

        {/* SPAM WARNING */}
        <div className="w-full rounded-2xl border-2 border-amber-400/60 bg-amber-400/10 px-6 py-5 flex gap-4 items-start">
          <span className="text-2xl mt-0.5">⚠️</span>
          <div className="flex flex-col gap-1">
            <p className="font-inter font-bold text-amber-300 text-base uppercase tracking-wide">
              Revisa la carpeta de SPAM
            </p>
            <p className="font-inter text-[#FAF5EB]/80 text-sm leading-relaxed">
              Te hemos enviado un email de confirmación con el enlace al calendario. Ábrelo, márcalo como "No es spam" y ya lo tendrás en bandeja de entrada.
            </p>
          </div>
        </div>

        {/* Separador */}
        <div className="w-full h-px bg-[#FAF5EB]/10" />

        {/* CTA calendario */}
        <div className="w-full flex flex-col gap-6 items-center">
          <h2 className="font-inter text-sm font-semibold uppercase tracking-widest text-[#FE4629]/80 text-center">
            Reserva tu hueco
          </h2>

          <p className="font-inter text-[#FAF5EB]/70 text-sm leading-relaxed text-center max-w-sm">
            Elige el día y la hora que mejor te venga. La videollamada dura una hora.
          </p>

          <a
            href="https://calendar.app.google/JCXhGkyfqKp1ekRq5"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-sm flex items-center justify-center gap-2 bg-[#FE4629] hover:bg-[#e03d22] transition-colors text-white font-inter font-semibold text-base rounded-xl px-6 py-4"
          >
            → Elegir mi fecha y hora
          </a>

          {/* Contacto */}
          <div className="rounded-xl border border-[#FAF5EB]/10 bg-[#FAF5EB]/5 px-5 py-4 w-full max-w-sm">
            <p className="font-inter text-[#FAF5EB]/50 text-xs leading-relaxed text-center">
              ¿Tienes alguna duda? Escríbenos a{" "}
              <a href="mailto:contact@javiggil.com" className="text-[#FE4629]/70 hover:text-[#FE4629] transition-colors">
                contact@javiggil.com
              </a>
            </p>
          </div>
        </div>

        {/* Separador */}
        <div className="w-full h-px bg-[#FAF5EB]/10" />

        {/* Footer */}
        <p className="font-inter text-sm text-[#FAF5EB]/30">
          Nos vemos pronto.
        </p>
      </div>
    </div>
  )
}
