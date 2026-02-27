"use client"

import { useEffect, useState } from "react"

export default function GraciasPromptPage() {
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
            Los prompts están<br />
            <span className="text-[#FE4629]">en tu email.</span>
          </h1>
        </div>

        {/* SPAM WARNING — protagonista */}
        <div className="w-full rounded-2xl border-2 border-amber-400/60 bg-amber-400/10 px-6 py-5 flex gap-4 items-start">
          <span className="text-2xl mt-0.5">⚠️</span>
          <div className="flex flex-col gap-1">
            <p className="font-inter font-bold text-amber-300 text-base uppercase tracking-wide">
              Revisa la carpeta de SPAM
            </p>
            <p className="font-inter text-[#FAF5EB]/80 text-sm leading-relaxed">
              El email suele acabar ahí. Ábrelo, márcalo como "No es spam" y ya lo tendrás siempre en bandeja de entrada.
            </p>
          </div>
        </div>

        {/* Separador */}
        <div className="w-full h-px bg-[#FAF5EB]/10" />

        {/* Instrucciones */}
        <div className="w-full flex flex-col gap-6 text-left">
          <h2 className="font-inter text-sm font-semibold uppercase tracking-widest text-[#FE4629]/80 text-center">
            Cómo abrir tus prompts
          </h2>

          {/* Item 1 */}
          <div className="flex gap-4 items-start">
            <div className="w-7 h-7 rounded-full bg-[#FE4629]/10 border border-[#FE4629]/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[#FE4629] text-xs font-bold">1</span>
            </div>
            <div>
              <p className="font-inter text-[#FAF5EB]/80 text-sm leading-relaxed">
                <strong className="text-[#FAF5EB]">Mejor opción: abre el archivo .html en un navegador</strong> (Chrome, Safari, Firefox). Descárgalo y arrástralo al navegador, o haz doble clic. Todo funciona perfecto: navegación, copia y pega.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex gap-4 items-start">
            <div className="w-7 h-7 rounded-full bg-[#FE4629]/10 border border-[#FE4629]/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[#FE4629] text-xs font-bold">2</span>
            </div>
            <div>
              <p className="font-inter text-[#FAF5EB]/80 text-sm leading-relaxed">
                <strong className="text-[#FAF5EB]">iPhone:</strong> puedes abrirlo con Vista Previa, pero dependiendo de la versión puede tener problemas al copiar y pegar. Lo mejor es hacerlo desde un ordenador.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-7 h-7 rounded-full bg-[#FE4629]/10 border border-[#FE4629]/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[#FE4629] text-xs font-bold">3</span>
            </div>
            <div>
              <p className="font-inter text-[#FAF5EB]/80 text-sm leading-relaxed">
                También recibes el <strong className="text-[#FAF5EB]">PDF de apoyo</strong> con los mismos prompts. Puedes leerlos y copiarlos desde ahí si prefieres no usar el HTML.
              </p>
            </div>
          </div>

          {/* Contacto si no llega */}
          <div className="rounded-xl border border-[#FAF5EB]/10 bg-[#FAF5EB]/5 px-5 py-4">
            <p className="font-inter text-[#FAF5EB]/50 text-xs leading-relaxed">
              ¿Sigue sin aparecer tras revisar spam? Escríbenos a{" "}
              <a href="mailto:contact@javiggil.com" className="text-[#FE4629]/70 hover:text-[#FE4629] transition-colors">
                contact@javiggil.com
              </a>{" "}
              y te lo reenviamos.
            </p>
          </div>
        </div>

        {/* Separador */}
        <div className="w-full h-px bg-[#FAF5EB]/10" />

        {/* Footer */}
        <p className="font-inter text-sm text-[#FAF5EB]/30">
          Son tuyos para siempre. Úsalos como quieras.
        </p>
      </div>
    </div>
  )
}
