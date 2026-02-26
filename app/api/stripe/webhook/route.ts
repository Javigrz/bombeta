import { headers } from "next/headers"
import Stripe from "stripe"
import { Resend } from "resend"
import fs from "fs"
import path from "path"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature error:", err)
    return new Response("Webhook error", { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const email = session.customer_details?.email
    const name = session.customer_details?.name
    const product = session.metadata?.product

    if (!email) {
      return new Response("No email found", { status: 200 })
    }

    if (product === "prompts_111") {
      // Email con los prompts adjuntos
      await sendPromptsEmail(email, name ?? "")
      console.log(`Prompts email sent to ${email}`)
    } else {
      // Email de confirmación del curso
      await resend.emails.send({
        from: "Javi Gil <contact@javiggil.com>",
        to: [email],
        subject: "Ya eres parte de The AI Playbook",
        html: buildCourseConfirmationEmail(name ?? ""),
        text: buildCourseConfirmationEmailText(name ?? ""),
      })
      console.log(`Course confirmation email sent to ${email}`)
    }
  }

  return new Response("OK", { status: 200 })
}

async function sendPromptsEmail(email: string, name: string) {
  const htmlFilePath = path.join(process.cwd(), "public/prompts/111_originale.html")
  const pdfFilePath = path.join(process.cwd(), "public/prompts/111Originale-JaviGil.pdf")

  const htmlContent = fs.readFileSync(htmlFilePath)
  const pdfContent = fs.readFileSync(pdfFilePath)

  const greeting = name ? `Hola ${name},` : "Hola,"

  await resend.emails.send({
    from: "Javi Gil <contact@javiggil.com>",
    to: [email],
    subject: "Tus 111 Originale ya están aquí",
    attachments: [
      {
        filename: "111-Originale-Prompts.html",
        content: htmlContent,
      },
      {
        filename: "111-Originale-Prompts.pdf",
        content: pdfContent,
      },
    ],
    html: buildPromptsEmail(greeting),
    text: buildPromptsEmailText(greeting),
  })
}

function buildPromptsEmail(greeting: string) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
        line-height: 1.7;
        color: #222222;
        background-color: #ffffff;
        max-width: 600px;
        margin: 0 auto;
        padding: 0;
      }
      .wrapper {
        padding: 48px 40px;
        background: #ffffff;
      }
      .logo {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #FE4629;
        margin-bottom: 40px;
      }
      h1 {
        font-size: 26px;
        font-weight: 700;
        color: #111111;
        margin: 0 0 24px;
        line-height: 1.3;
      }
      p {
        font-size: 16px;
        color: #444444;
        margin: 0 0 20px;
        line-height: 1.7;
      }
      .highlight {
        color: #111111;
        font-weight: 600;
      }
      .instructions-box {
        background: #f8f6f2;
        border-left: 3px solid #FE4629;
        border-radius: 0 8px 8px 0;
        padding: 24px 28px;
        margin: 32px 0;
      }
      .instructions-box p {
        font-size: 15px;
        color: #333333;
        margin: 0 0 14px;
      }
      .instructions-box p:last-child {
        margin-bottom: 0;
      }
      .instructions-title {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #FE4629;
        margin-bottom: 16px;
      }
      .step {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        align-items: flex-start;
      }
      .step-num {
        display: inline-block;
        width: 22px;
        height: 22px;
        background: #FE4629;
        color: #ffffff;
        border-radius: 50%;
        text-align: center;
        font-size: 11px;
        font-weight: 700;
        line-height: 22px;
        flex-shrink: 0;
        margin-top: 1px;
      }
      .step-text {
        font-size: 15px;
        color: #333333;
        line-height: 1.6;
      }
      .spam-note {
        background: #fff8f0;
        border: 1px solid #fde8d8;
        border-radius: 8px;
        padding: 16px 20px;
        margin: 28px 0;
      }
      .spam-note p {
        font-size: 14px;
        color: #666666;
        margin: 0;
      }
      .spam-note a {
        color: #FE4629;
        text-decoration: none;
      }
      .divider {
        border: none;
        border-top: 1px solid #eeeeee;
        margin: 36px 0;
      }
      .footer {
        font-size: 13px;
        color: #999999;
        line-height: 1.6;
      }
      .footer a {
        color: #FE4629;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="logo">111 Originale — Javi Gil</div>

      <h1>${greeting}<br/>Aquí tienes tus prompts.</h1>

      <p>
        Encontrarás <span class="highlight">dos archivos adjuntos</span> en este email:
        el <span class="highlight">111-Originale-Prompts.html</span> (la versión interactiva con índice y navegación)
        y el <span class="highlight">111-Originale-Prompts.pdf</span> (versión de apoyo para leer o copiar desde ahí).
      </p>

      <p>Ambos tienen exactamente el mismo contenido. Son tuyos para siempre.</p>

      <div class="instructions-box">
        <div class="instructions-title">Cómo abrirlos</div>

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="30" valign="top" style="padding-top:2px;">
              <div style="width:22px;height:22px;background:#FE4629;color:#fff;border-radius:50%;text-align:center;font-size:11px;font-weight:700;line-height:22px;">1</div>
            </td>
            <td style="padding-left:12px;font-size:15px;color:#333;line-height:1.6;padding-bottom:16px;">
              <strong>Mejor opción: el archivo .html en un navegador</strong> (Chrome, Safari, Firefox).
              Descárgalo y arrástralo al navegador, o haz doble clic en él. Navegación lateral, copia y pega —
              todo funciona perfecto.
            </td>
          </tr>
          <tr>
            <td width="30" valign="top" style="padding-top:2px;">
              <div style="width:22px;height:22px;background:#FE4629;color:#fff;border-radius:50%;text-align:center;font-size:11px;font-weight:700;line-height:22px;">2</div>
            </td>
            <td style="padding-left:12px;font-size:15px;color:#333;line-height:1.6;padding-bottom:16px;">
              <strong>iPhone:</strong> puedes abrir el .html con Vista Previa, pero dependiendo de la versión
              puede haber problemas al copiar y pegar. Si tienes ordenador cerca, úsalo.
            </td>
          </tr>
          <tr>
            <td width="30" valign="top" style="padding-top:2px;">
              <div style="width:22px;height:22px;background:#FE4629;color:#fff;border-radius:50%;text-align:center;font-size:11px;font-weight:700;line-height:22px;">3</div>
            </td>
            <td style="padding-left:12px;font-size:15px;color:#333;line-height:1.6;">
              <strong>El PDF</strong> es perfecto si quieres hojear los prompts o copiar alguno sin abrir el HTML.
              Funciona en cualquier dispositivo.
            </td>
          </tr>
        </table>
      </div>

      <p>
        Hay 111 prompts organizados por categorías. Tómate el tiempo que necesites para explorarlos.
        No hay ninguna forma correcta de usarlos.
      </p>

      <hr class="divider" />

      <p style="font-size:16px;color:#444;">
        Un saludo,<br/>
        <strong style="color:#111;">Javi</strong>
      </p>

      <hr class="divider" />

      <div class="footer">
        ¿Tienes alguna duda o no has recibido los archivos? Escríbenos a
        <a href="mailto:contact@javiggil.com">contact@javiggil.com</a>
        y te lo solucionamos.<br/><br/>
        111 Originale · <a href="mailto:contact@javiggil.com">contact@javiggil.com</a>
      </div>
    </div>
  </body>
</html>
  `.trim()
}

function buildPromptsEmailText(greeting: string) {
  return `
${greeting}

Aquí tienes tus prompts.

Encontrarás dos archivos adjuntos en este email:
- 111-Originale-Prompts.html (versión interactiva con índice y navegación)
- 111-Originale-Prompts.pdf (versión de apoyo para leer o copiar desde ahí)

Ambos tienen exactamente el mismo contenido. Son tuyos para siempre.

CÓMO ABRIRLOS
--------------

1. Mejor opción: abre el archivo .html en un navegador (Chrome, Safari, Firefox).
   Descárgalo y arrástralo al navegador, o haz doble clic. Navegación, copia y pega —
   todo funciona perfecto.

2. iPhone: puedes abrir el .html con Vista Previa, pero dependiendo de la versión
   puede haber problemas al copiar y pegar. Si tienes ordenador, úsalo.

3. El PDF es perfecto si quieres hojear los prompts o copiar alguno sin abrir el HTML.
   Funciona en cualquier dispositivo.

Hay 111 prompts organizados por categorías. No hay ninguna forma correcta de usarlos.

---

Un saludo,
Javi

¿Dudas? Escríbenos a contact@javiggil.com
  `.trim()
}

function buildCourseConfirmationEmail(name: string) {
  const greeting = name ? `Hola ${name},` : "Hola,"

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #FAF5EB;
            background-color: #1A0A00;
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
          }
          .wrapper {
            background-color: #1A0A00;
            padding: 48px 32px;
          }
          .header {
            margin-bottom: 40px;
          }
          .logo {
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #FE4629;
          }
          h1 {
            font-size: 28px;
            font-weight: 600;
            color: #FAF5EB;
            margin: 32px 0 16px;
            line-height: 1.3;
          }
          h1 span {
            color: #FE4629;
          }
          p {
            font-size: 16px;
            color: #FAF5EB;
            opacity: 0.7;
            margin: 0 0 20px;
          }
          .divider {
            border: none;
            border-top: 1px solid rgba(250, 245, 235, 0.1);
            margin: 36px 0;
          }
          .footer {
            font-size: 13px;
            color: rgba(250, 245, 235, 0.3);
          }
          .footer a {
            color: #FE4629;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <span class="logo">THE AI PLAYBOOK</span>
          </div>

          <h1>${greeting}<br/><span>Ya eres parte de The AI Playbook.</span></h1>

          <p>
            No tienes que hacer nada más. Nosotros nos ponemos en contacto contigo
            cuando se acerque la fecha con toda la información y el enlace a la videollamada.
          </p>

          <p>
            Mientras tanto, si tienes alguna pregunta no dudes en escribirnos.
          </p>

          <hr class="divider" />

          <p class="footer">
            ¿Tienes alguna duda? Escríbenos a
            <a href="mailto:contact@javiggil.com">contact@javiggil.com</a>
          </p>
        </div>
      </body>
    </html>
  `
}

function buildCourseConfirmationEmailText(name: string) {
  const greeting = name ? `Hola ${name},` : "Hola,"
  return `
${greeting}

Ya eres parte de The AI Playbook.

No tienes que hacer nada más. Nosotros nos ponemos en contacto contigo cuando se acerque la fecha con toda la información y el enlace a la videollamada.

Mientras tanto, si tienes alguna pregunta no dudes en escribirnos a contact@javiggil.com

---
THE AI PLAYBOOK
  `.trim()
}
