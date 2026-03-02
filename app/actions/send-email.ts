'use server'

import { Resend } from 'resend'
import { trackServerEvent } from '@/lib/analytics-db'

const resend = new Resend(process.env.RESEND_API_KEY)

const STRIPE_URL = 'https://buy.stripe.com/7sYfZ9dxb79m3eOdph9EI02'

export interface GroupReservationData {
  name: string
  email: string
  sessionId?: string
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

    // 1. Notificación al admin (bloqueante — si falla, devolvemos error)
    const adminEmail = await resend.emails.send({
      from: 'Javi Gil <curso@javiggil.com>',
      to: ['javiergilrodriguez@icloud.com'],
      subject: `🎯 Nueva pre-reserva: ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"><style>
            body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4B0A23 0%, #8B1538 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 16px; background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #FE4629; }
            .label { font-weight: 600; color: #4B0A23; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
            .value { color: #333; font-size: 16px; }
          </style></head>
          <body>
            <div class="header"><h1 style="margin:0;font-size:22px;">Nueva pre-reserva — The AI Playbook</h1></div>
            <div class="content">
              <div class="field"><div class="label">Nombre</div><div class="value">${data.name}</div></div>
              <div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${data.email}" style="color:#FE4629;text-decoration:none;">${data.email}</a></div></div>
            </div>
          </body>
        </html>
      `,
      text: `Nueva pre-reserva — The AI Playbook\n\nNombre: ${data.name}\nEmail: ${data.email}`
    })

    if (adminEmail.error) {
      console.error('Error sending admin notification:', adminEmail.error)
      return { success: false, error: 'Error al enviar el email. Por favor, inténtalo de nuevo.' }
    }

    // 2. Confirmación al usuario (no-bloqueante — si falla, el admin ya fue notificado)
    const userEmail = await resend.emails.send({
      from: 'Javi Gil <curso@javiggil.com>',
      to: [data.email],
      subject: 'Tu plaza para The AI Playbook está pre-reservada',
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"><style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7; color: #222; max-width: 600px; margin: 0 auto; padding: 0; background: #ffffff; }
            .wrapper { padding: 40px 32px; }
            p { margin: 0 0 20px; font-size: 16px; }
            .cta-block { margin: 32px 0; }
            .cta-btn { display: inline-block; background: #FE4629; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; }
            .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee; color: #888; font-size: 14px; }
          </style></head>
          <body>
            <div class="wrapper">
              <p>Hola ${data.name},</p>
              <p><strong>Buena decisión.</strong></p>
              <p>Tu plaza para The AI Playbook está pre-reservada. Las plazas se confirman por orden de pago, así que cuanto antes confirmes, más seguro tienes tu sitio.</p>
              <p>Te cuento rápido qué va a pasar:</p>
              <p>Los próximos días te voy a mandar unos emails donde te explico exactamente qué vamos a hacer en el curso, cómo funciona, y por qué creo que puede cambiar la forma en la que trabajas con IA. No es humo. Es lo que llevo haciendo los últimos años con empresas reales — las mías y las de mis clientes.</p>
              <p>Si ya lo tienes claro y no necesitas más información:</p>
              <div class="cta-block">
                <a href="${STRIPE_URL}" class="cta-btn">→ Confirmar mi plaza ahora (390€)</a>
              </div>
              <p>Si prefieres saber más antes de decidir, no hagas nada. Mañana te cuento más.</p>
              <p>Un saludo,<br><strong>Javi</strong></p>
              <p style="margin-top:8px;color:#666;font-size:14px;"><em>P.D.: El curso empieza el 9 de marzo. 8 sesiones en directo por videollamada, 4 semanas. Plazas limitadas porque es en directo y quiero que haya interacción real.</em></p>
              <div class="footer">The AI Playbook · contact@javiggil.com</div>
            </div>
          </body>
        </html>
      `,
      text: `Hola ${data.name},

Buena decisión.

Tu plaza para The AI Playbook está pre-reservada. Las plazas se confirman por orden de pago, así que cuanto antes confirmes, más seguro tienes tu sitio.

Te cuento rápido qué va a pasar:

Los próximos días te voy a mandar unos emails donde te explico exactamente qué vamos a hacer en el curso, cómo funciona, y por qué creo que puede cambiar la forma en la que trabajas con IA. No es humo. Es lo que llevo haciendo los últimos años con empresas reales — las mías y las de mis clientes.

Si ya lo tienes claro y no necesitas más información:

→ Confirmar mi plaza ahora (390€): ${STRIPE_URL}

Si prefieres saber más antes de decidir, no hagas nada. Mañana te cuento más.

Un saludo,
Javi

P.D.: El curso empieza el 9 de marzo. 8 sesiones en directo por videollamada, 4 semanas. Plazas limitadas porque es en directo y quiero que haya interacción real.`
    })

    if (userEmail.error) {
      console.error('Error sending user confirmation (non-fatal):', userEmail.error)
    }

    // Track form submission in analytics
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
    // Validate form data
    if (!formData.name || !formData.email || !formData.position) {
      return {
        success: false,
        error: 'Todos los campos son obligatorios'
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        error: 'El email no es válido'
      }
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Javi Gil <curso@javiggil.com>',
      to: ['javiergilrodriguez@icloud.com'],
      subject: '🎯 Nueva solicitud de plaza - THE AI PLAYBOOK',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #4B0A23 0%, #8B1538 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .field {
                margin-bottom: 20px;
                background: white;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #FE4629;
              }
              .label {
                font-weight: 600;
                color: #4B0A23;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
              }
              .value {
                color: #333;
                font-size: 16px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #666;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Nueva solicitud de plaza</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nombre</div>
                <div class="value">${formData.name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${formData.email}" style="color: #FE4629; text-decoration: none;">${formData.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Cargo / Empresa</div>
                <div class="value">${formData.position}</div>
              </div>
              <div class="field">
                <div class="label">Idioma preferido</div>
                <div class="value">${formData.language === 'en' ? 'English' : 'Español'}</div>
              </div>
            </div>
            <div class="footer">
              <p>Enviado desde bombetacourse.com</p>
            </div>
          </body>
        </html>
      `,
      text: `
Nueva solicitud de plaza

Nombre: ${formData.name}
Email: ${formData.email}
Cargo/Empresa: ${formData.position}
Idioma: ${formData.language === 'en' ? 'English' : 'Español'}

---
Enviado desde bombetacourse.com
      `.trim()
    })

    if (error) {
      console.error('Error sending email:', error)
      return {
        success: false,
        error: 'Error al enviar el email. Por favor, inténtalo de nuevo.'
      }
    }

    // Track form submission in analytics
    await trackServerEvent(formData.sessionId ?? null, 'form_submit', '/', {
      name: formData.name,
      email: formData.email,
      form: 'main_form',
    })

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: 'Error inesperado. Por favor, inténtalo de nuevo.'
    }
  }
}
