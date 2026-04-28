import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { trackServerEvent } from '@/lib/analytics-db'
import { SYSTEM_FONT_STACK } from '@/lib/email-helpers'

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = 'jaavii.grz@gmail.com'

interface AdvisoryPayload {
  fullName?: string
  position?: string
  email?: string
  company?: string
  decisionMakers?: string
  aiState?: string
  description?: string
  sessionId?: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function row(label: string, value: string) {
  const safeValue = escapeHtml(value).replace(/\n/g, '<br />')
  return `<tr>
      <td style="padding:10px 14px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.6px;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
      <td style="padding:10px 14px;font-size:15px;color:#1a1a1a;line-height:1.5;">${safeValue}</td>
    </tr>`
}

function adminEmailHtml(data: Required<Omit<AdvisoryPayload, 'sessionId'>>): string {
  const rows = [
    row('Nombre', data.fullName),
    row('Cargo', data.position),
    row('Email', data.email),
    row('Empresa', data.company),
    row('Decisores IA', data.decisionMakers),
    row('Momento actual', data.aiState),
    row('Descripción', data.description),
  ].join('')

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Nueva aplicación · Advisory</title>
</head>
<body style="margin:0;padding:24px;font-family:${SYSTEM_FONT_STACK};font-size:16px;line-height:1.6;color:#1a1a1a;background-color:#ffffff;">
<p style="margin:0 0 16px;font-size:18px;font-weight:600;">Nueva aplicación — Advisory</p>
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid #eaeaea;border-radius:6px;width:100%;max-width:640px;">${rows}</table>
</body>
</html>`
}

export async function POST(req: Request) {
  let payload: AdvisoryPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const fullName = (payload.fullName ?? '').trim()
  const position = (payload.position ?? '').trim()
  const email = (payload.email ?? '').trim()
  const company = (payload.company ?? '').trim()
  const decisionMakers = (payload.decisionMakers ?? '').trim()
  const aiState = (payload.aiState ?? '').trim()
  const description = (payload.description ?? '').trim()

  if (!fullName || !position || !email || !company || !decisionMakers || !aiState || !description) {
    return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
  }

  const html = adminEmailHtml({ fullName, position, email, company, decisionMakers, aiState, description })
  const text = [
    'Nueva aplicación — Advisory',
    '',
    `Nombre: ${fullName}`,
    `Cargo: ${position}`,
    `Email: ${email}`,
    `Empresa: ${company}`,
    `Decisores IA: ${decisionMakers}`,
    `Momento actual: ${aiState}`,
    '',
    'Descripción:',
    description,
  ].join('\n')

  try {
    const result = await resend.emails.send({
      from: 'Javi Gil <curso@javiggil.com>',
      to: [ADMIN_EMAIL],
      replyTo: email,
      subject: `[Advisory] ${company} — ${fullName}`,
      html,
      text,
    })

    if (result.error) {
      console.error('[/api/advisory] resend error:', result.error)
      return NextResponse.json({ error: 'No se pudo enviar el email' }, { status: 502 })
    }
  } catch (err) {
    console.error('[/api/advisory] unexpected error:', err)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }

  await trackServerEvent(payload.sessionId ?? null, 'form_submit', '/advisory', {
    form: 'advisory_application',
    company,
    aiState,
  })

  return NextResponse.json({ ok: true })
}
