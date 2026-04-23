"use client"

import { useEffect, useState } from "react"

export default function Gracias2Page() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return null

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-[#FAF5EB] text-[#4B0A23] flex flex-col items-center justify-center px-6 py-20">
        <div
          className="flex flex-col items-center text-center max-w-xl gap-10 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            fontFamily: "'DM Sans', -apple-system, sans-serif",
          }}
        >
          {/* Overline */}
          <p
            className="text-xs uppercase tracking-[0.25em] text-[#8B7355]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
          >
            Ciento once piezas
          </p>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl leading-[1.1] font-medium -mt-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            111 Originale<br />
            <span className="italic text-[#FE4629]">está en tu email.</span>
          </h1>

          {/* Check mark */}
          <div className="w-14 h-14 rounded-full bg-[#FE4629]/10 border border-[#FE4629]/30 flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 13l4 4L19 7"
                stroke="#FE4629"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Pull quote */}
          <p
            className="text-lg italic border-l-2 border-[#FE4629] pl-5 text-left self-stretch"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            No es un curso. Es una arquitectura.
          </p>

          {/* Spam warning */}
          <div className="w-full rounded bg-[#F3EBD9] border border-[#4B0A23]/10 px-6 py-5 text-left">
            <p
              className="text-xs uppercase tracking-[0.2em] text-[#FE4629] mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Aviso importante
            </p>
            <p className="text-sm leading-relaxed">
              <strong className="text-[#4B0A23]">Revisa la carpeta de spam</strong> si no lo ves en bandeja
              de entrada. Ábrelo, márcalo como "no es spam" y ya lo tendrás siempre a mano.
            </p>
          </div>

          {/* Separator */}
          <div className="w-16 h-px bg-[#4B0A23]/15" />

          {/* Instructions */}
          <div className="w-full flex flex-col gap-6 text-left">
            <h2
              className="text-2xl font-medium text-center"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Cómo abrirlo
            </h2>

            <Step number={1}>
              <strong className="text-[#4B0A23]">El archivo .html</strong> es la forma principal.
              Descárgalo, ábrelo en tu navegador (Chrome, Safari, Firefox) y tendrás la arquitectura
              entera, navegable, lista para usar.
            </Step>

            <Step number={2}>
              <strong className="text-[#4B0A23]">En iPhone</strong>, Vista Previa funciona pero a
              veces falla al copiar. Si te pasa, ábrelo en un ordenador.
            </Step>

            <Step number={3}>
              <strong className="text-[#4B0A23]">El PDF adjunto</strong> es tu respaldo. Lee y copia
              desde ahí si prefieres.
            </Step>

            <div className="rounded border border-[#4B0A23]/10 bg-[#FAF5EB] px-5 py-4 mt-2">
              <p className="text-xs text-[#8B7355] leading-relaxed">
                ¿Sigue sin aparecer tras revisar spam? Escribe a{" "}
                <a
                  href="mailto:contact@javiggil.com"
                  className="text-[#FE4629] hover:underline"
                >
                  contact@javiggil.com
                </a>{" "}
                y te lo reenviamos.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="w-16 h-px bg-[#4B0A23]/15" />
          <p
            className="text-sm italic text-[#8B7355]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Un pago. Para siempre. Las actualizaciones también te llegan.
          </p>
        </div>
      </div>
    </>
  )
}

function Step({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-7 h-7 rounded-full bg-[#FE4629] flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[#FAF5EB] text-xs font-bold">{number}</span>
      </div>
      <p className="text-sm leading-relaxed text-[#4B0A23]/90">{children}</p>
    </div>
  )
}
