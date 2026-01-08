'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface FormData {
  name: string
  email: string
  position: string
  language: string
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
      from: 'Javi Gil <onboarding@resend.dev>', // You'll need to verify your domain to use a custom email
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
