import { NextRequest, NextResponse } from 'next/server'
import { markUnsubscribed } from '@/lib/email-helpers'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://javiggil.com'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getEmailFromUrl(req: NextRequest): string | null {
  const email = req.nextUrl.searchParams.get('email')?.trim().toLowerCase()
  if (!email || !EMAIL_REGEX.test(email)) return null
  return email
}

// GET: link clicado por el usuario en el email. Marca baja y redirige a la
// página de confirmación.
export async function GET(req: NextRequest) {
  const email = getEmailFromUrl(req)
  if (!email) {
    return NextResponse.redirect(`${SITE_URL}/unsubscribe?status=invalid`, 302)
  }

  try {
    await markUnsubscribed(email, 'one_click_link')
    return NextResponse.redirect(
      `${SITE_URL}/unsubscribe?status=ok&email=${encodeURIComponent(email)}`,
      302
    )
  } catch (err) {
    console.error('[unsubscribe] GET error:', err)
    return NextResponse.redirect(`${SITE_URL}/unsubscribe?status=error`, 302)
  }
}

// POST: one-click unsubscribe (RFC 8058). Gmail/Yahoo lo dispararon
// automáticamente desde la cabecera List-Unsubscribe-Post. Tiene que
// responder 200 OK rápido y sin redirección.
export async function POST(req: NextRequest) {
  const email =
    getEmailFromUrl(req) ||
    (await (async () => {
      try {
        const form = await req.formData()
        const raw = form.get('email')
        if (typeof raw !== 'string') return null
        const value = raw.trim().toLowerCase()
        return EMAIL_REGEX.test(value) ? value : null
      } catch {
        return null
      }
    })())

  if (!email) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 })
  }

  try {
    await markUnsubscribed(email, 'one_click_post')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[unsubscribe] POST error:', err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
