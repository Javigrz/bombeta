'use server'

import { Resend } from 'resend'
import { trackServerEvent } from '@/lib/analytics-db'
import {
  getUnsubscribeHeaders,
  getUnsubscribeUrl,
  SYSTEM_FONT_STACK,
} from '@/lib/email-helpers'

const resend = new Resend(process.env.RESEND_API_KEY)

const STRIPE_URL = 'https://buy.stripe.com/7sYfZ9dxb79m3eOdph9EI02'
const ADMIN_EMAIL = 'javiergilrodriguez@icloud.com'

export interface GroupReservationData {
  name: string
  email: string
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

function adminNotificationHtml(name: string, email: string, extraRows: Array<[string, string]> = []): string {
  const rows = [['Nombre', name], ['Email', email], ...extraRows]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(label)}</td><td style="padding:8px 12px;font-size:16px;color:#1a1a1a;">${escapeHtml(value)}</td></tr>`
    )
    .join('')

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Nueva pre-reserva</title>
</head>
<body style="margin:0;padding:24px;font-family:${SYSTEM_FONT_STACK};font-size:16px;line-height:1.6;color:#1a1a1a;background-color:#ffffff;">
<p style="margin:0 0 16px;font-size:18px;font-weight:600;">Nueva pre-reserva — The AI Playbook</p>
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid #eaeaea;border-radius:6px;">${rows}</table>
</body>
</html>`
}

export async function sendGroupReservationEmails(data: GroupReservationData) {
  try {
    if (!data.name || !data.email) {
      return { success: false, error: 'Todos los campos son obligatorios' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return { success: false, error: 'El email no es válido' }
    }

    // 1. Notificación al admin (bloqueante)
    const adminEmail = await resend.emails.send({
      from: 'Javi Gil <curso@javiggil.com>',
      to: [ADMIN_EMAIL],
      subject: `Nueva pre-reserva: ${data.name}`,
      html: adminNotificationHtml(data.name, data.email),
      text: `Nueva pre-reserva — The AI Playbook\n\nNombre: ${data.name}\nEmail: ${data.email}`,
    })

    if (adminEmail.error) {
      console.error('Error sending admin notification:', adminEmail.error)
      return { success: false, error: 'Error al enviar el email. Por favor, inténtalo de nuevo.' }
    }

    // 2. Confirmación al usuario (no-bloqueante)
    const userText = `Hola ${data.name},

Buena decisión.

Tu plaza para The AI Playbook está pre-reservada. Las plazas se confirman por orden de pago, así que cuanto antes confirmes, más seguro tienes tu sitio.

Te cuento rápido qué va a pasar:

Los próximos días te voy a mandar unos emails donde te explico exactamente qué vamos a hacer en el curso, cómo funciona, y por qué creo que puede cambiar la forma en la que trabajas con IA. No es humo. Es lo que llevo haciendo los últimos años con empresas reales — las mías y las de mis clientes.

Si ya lo tienes claro y no necesitas más información:

Confirmar mi plaza ahora (390€): ${STRIPE_URL}

Si prefieres saber más antes de decidir, no hagas nada. Mañana te cuento más.

Un saludo,
Javi

P.D.: El curso empieza próximamente. 8 sesiones en directo por videollamada, 4 semanas. Plazas limitadas porque es en directo y quiero que haya interacción real.

---
The AI Playbook · contact@javiggil.com
Para darte de baja: ${getUnsubscribeUrl(data.email)}`

    const userHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Tu plaza está pre-reservada</title>
</head>
<body style="margin:0;padding:24px;font-family:${SYSTEM_FONT_STACK};font-size:16px;line-height:1.7;color:#1a1a1a;background-color:#ffffff;">
<p style="margin:0 0 16px;">Hola ${escapeHtml(data.name)},</p>
<p style="margin:0 0 16px;"><strong>Buena decisión.</strong></p>
<p style="margin:0 0 16px;">Tu plaza para The AI Playbook está pre-reservada. Las plazas se confirman por orden de pago, así que cuanto antes confirmes, más seguro tienes tu sitio.</p>
<p style="margin:0 0 16px;">Te cuento rápido qué va a pasar:</p>
<p style="margin:0 0 16px;">Los próximos días te voy a mandar unos emails donde te explico exactamente qué vamos a hacer en el curso, cómo funciona, y por qué creo que puede cambiar la forma en la que trabajas con IA. No es humo. Es lo que llevo haciendo los últimos años con empresas reales — las mías y las de mis clientes.</p>
<p style="margin:0 0 16px;">Si ya lo tienes claro y no necesitas más información:</p>
<p style="margin:0 0 24px;"><a href="${STRIPE_URL}" style="color:#FE4629;font-weight:600;">Confirmar mi plaza ahora (390€)</a></p>
<p style="margin:0 0 16px;">Si prefieres saber más antes de decidir, no hagas nada. Mañana te cuento más.</p>
<p style="margin:0 0 16px;">Un saludo,<br /><strong>Javi</strong></p>
<p style="margin:24px 0 0;font-size:14px;color:#666;"><em>P.D.: El curso empieza próximamente. 8 sesiones en directo por videollamada, 4 semanas. Plazas limitadas porque es en directo y quiero que haya interacción real.</em></p>
<hr style="border:none;border-top:1px solid #eaeaea;margin:32px 0 16px;" />
<p style="margin:0;font-size:13px;color:#888;">The AI Playbook · contact@javiggil.com<br /><a href="${getUnsubscribeUrl(data.email)}" style="color:#888;">Darme de baja</a></p>
</body>
</html>`

    const userEmail = await resend.emails.send({
      from: 'Javi Gil <curso@javiggil.com>',
      to: [data.email],
      subject: 'Tu plaza para The AI Playbook está pre-reservada',
      html: userHtml,
      text: userText,
      headers: getUnsubscribeHeaders(data.email),
    })

    if (userEmail.error) {
      console.error('Error sending user confirmation (non-fatal):', userEmail.error)
    }

    await trackServerEvent(data.sessionId ?? null, 'form_submit', '/', {
      name: data.name,
      email: data.email,
      form: 'group_reservation',
    })

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Error inesperado. Por favor, inténtalo de nuevo.' }
  }
}

export interface FormData {
  name: string
  email: string
  position: string
  language: string
  sessionId?: string
}

export async function sendFormEmail(formData: FormData) {
  try {
    if (!formData.name || !formData.email || !formData.position) {
      return { success: false, error: 'Todos los campos son obligatorios' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return { success: false, error: 'El email no es válido' }
    }

    const language = formData.language === 'en' ? 'English' : 'Español'

    const { data, error } = await resend.emails.send({
      from: 'Javi Gil <curso@javiggil.com>',
      to: [ADMIN_EMAIL],
      subject: 'Nueva solicitud de plaza — THE AI PLAYBOOK',
      html: adminNotificationHtml(formData.name, formData.email, [
        ['Cargo / Empresa', formData.position],
        ['Idioma', language],
      ]),
      text: `Nueva solicitud de plaza\n\nNombre: ${formData.name}\nEmail: ${formData.email}\nCargo/Empresa: ${formData.position}\nIdioma: ${language}\n\n---\nEnviado desde bombetacourse.com`,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error: 'Error al enviar el email. Por favor, inténtalo de nuevo.' }
    }

    await trackServerEvent(formData.sessionId ?? null, 'form_submit', '/', {
      name: formData.name,
      email: formData.email,
      form: 'main_form',
    })

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Error inesperado. Por favor, inténtalo de nuevo.' }
  }
}
