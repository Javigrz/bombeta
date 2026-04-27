import { verifyOriginaleToken } from "@/lib/originale-token"
import OriginaleClient from "./originale-client"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: Promise<{ t?: string }>
}

export default async function OriginalePage({ searchParams }: Props) {
  const { t } = await searchParams
  const email = t ? await verifyOriginaleToken(t) : null

  if (!email || !t) {
    return <AccessDenied />
  }

  const tokenParam = encodeURIComponent(t)
  return (
    <OriginaleClient
      htmlHref={`/api/originale/file?type=html&t=${tokenParam}`}
      pdfHref={`/api/originale/file?type=pdf&t=${tokenParam}`}
    />
  )
}

function AccessDenied() {
  return (
    <main
      className="fixed inset-0 overflow-hidden bg-[#0A080E] text-[#FAF5EB] flex items-center justify-center px-6"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&display=swap"
        rel="stylesheet"
      />
      <div className="flex flex-col items-center text-center max-w-md gap-6">
        <p
          className="text-xs uppercase tracking-[0.3em] text-[#FAF5EB]/55"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
        >
          Acceso privado
        </p>
        <h1
          className="text-[#FAF5EB] leading-[1.05] font-normal"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(28px, 5vw, 44px)",
            letterSpacing: "-0.02em",
          }}
        >
          Este enlace no es válido.
        </h1>
        <p className="text-[#FAF5EB]/70 text-sm leading-relaxed">
          Tu acceso a 111 Originale llega por email tras la compra. Si no
          encuentras el correo o el enlace ha caducado, escríbenos a{" "}
          <a
            href="mailto:contact@javiggil.com"
            className="text-[#FE4629] hover:underline"
          >
            contact@javiggil.com
          </a>{" "}
          y te lo enviamos de nuevo.
        </p>
      </div>
    </main>
  )
}
