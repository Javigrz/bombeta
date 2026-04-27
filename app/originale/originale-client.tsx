"use client"

import { useEffect, useState } from "react"

const VIDEO_URL = "/prompts2/assets/videos/Solomei-night-pingpong.mp4"
const VIDEO_POSTER = "/prompts2/assets/images/hero-poster.jpg"
const LOGO_111_SVG = "/prompts2/assets/logos/111.svg"

interface Props {
  htmlHref: string
  pdfHref: string
}

export default function OriginaleClient({ htmlHref, pdfHref }: Props) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return null

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />

      <main
        className="fixed inset-0 overflow-hidden bg-[#0A080E] text-[#FAF5EB]"
        style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}
      >
        <section className="relative w-full h-[100svh] overflow-hidden flex flex-col items-center justify-center px-6">
          <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
            <video
              className="w-full h-full object-cover"
              src={VIDEO_URL}
              poster={VIDEO_POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(10,8,14,0.20) 0%, rgba(10,8,14,0.55) 70%, rgba(10,8,14,0.82) 100%)",
              }}
            />
          </div>

          <div
            className="relative z-10 flex flex-col items-center text-center max-w-3xl gap-8 transition-all duration-1000"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.3em] text-[#FAF5EB]/70"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
            >
              Tu acceso
            </p>

            <h1
              className="text-[#FAF5EB] leading-[0.98] font-normal"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(40px, 7vw, 78px)",
                letterSpacing: "-0.025em",
                textShadow: "0 2px 20px rgba(0,0,0,0.35)",
              }}
            >
              <span className="inline-flex items-baseline gap-3">
                <img
                  src={LOGO_111_SVG}
                  alt="111"
                  className="inline-block"
                  style={{ height: "1em", width: "auto", verticalAlign: "baseline" }}
                />
                <em style={{ fontStyle: "italic" }}>Originale</em>
              </span>
              <br />
              está aquí.
            </h1>

            <p
              className="text-[#FAF5EB]/85 max-w-xl"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.6vw, 18px)",
                lineHeight: 1.5,
                textShadow: "0 1px 10px rgba(0,0,0,0.4)",
              }}
            >
              Un sistema. Dos formatos.
              <br />
              Tuyos para siempre.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <a
                href={htmlHref}
                download
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#FE4629] text-[#FAF5EB] hover:bg-[#FAF5EB] hover:text-[#0A080E] transition-colors duration-200"
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Descargar versión navegable
                <span aria-hidden>↓</span>
              </a>
              <a
                href={pdfHref}
                download
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#FAF5EB]/50 text-[#FAF5EB] hover:bg-[#FAF5EB] hover:text-[#0A080E] hover:border-[#FAF5EB] transition-colors duration-200"
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Descargar edición editorial
                <span aria-hidden>↓</span>
              </a>
            </div>

            <p
              className="text-[#FAF5EB]/55 text-xs mt-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
            >
              Mismo contenido. Distinta forma de habitarlo.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
