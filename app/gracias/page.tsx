"use client"

import { useEffect, useState } from "react"

export default function GraciasPage() {
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
        className="flex flex-col items-center text-center max-w-lg gap-10 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)" }}
      >
        {/* Check */}
        <div className="w-16 h-16 rounded-full bg-[#FE4629]/15 border border-[#FE4629]/30 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#FE4629" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Texto */}
        <div className="flex flex-col gap-4">
          <h1
            className="font-inter text-4xl md:text-5xl text-[#FAF5EB] leading-tight font-semibold"
          >
            Ya eres parte de<br />
            <span className="text-[#FE4629]">The AI Playbook.</span>
          </h1>

          <p className="font-inter text-base text-[#FAF5EB]/60 leading-relaxed">
            No tienes que hacer nada más. Nosotros nos ponemos en contacto contigo
            cuando se acerque la fecha con toda la información y el enlace a la videollamada.

            Te hemos enviado un correo de confirmación. Si no lo tienes puedes revisar la carpeta de SPAM.
          </p>
        </div>

        {/* Separador */}
        <div className="w-full h-px bg-[#FAF5EB]/10" />

        {/* Footer suave */}
        <p className="font-inter text-sm text-[#FAF5EB]/30">
          Si tienes cualquier pregunta, escríbenos a{" "}
          <a href="mailto:contact@javiggil.com" className="text-[#FE4629]/70 hover:text-[#FE4629] transition-colors">
            contact@javiggil.com
          </a>
        </p>
      </div>
    </div>
  )
}
