import { headers } from "next/headers"
import Stripe from "stripe"
import { Resend } from "resend"
import fs from "fs"
import path from "path"
import { trackServerEvent } from "@/lib/analytics-db"

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
    // Soporta tanto metadata correcta {product: "prompts_111"}
    // como el formato incorrecto que guardó Stripe {Key: "product", Value: "prompts_111"}
    const product =
      session.metadata?.product ||
      (session.metadata?.Value === "prompts_111" ? "prompts_111" : null)

    if (!email) {
      return new Response("No email found", { status: 200 })
    }

    // Track purchase in analytics. client_reference_id is used as fallback
    // so pre-built Stripe Payment Links (que no permiten inyectar metadata
    // desde el cliente) igual puedan atribuir la compra a la sesión.
    const analyticsSessionId =
      session.metadata?.analytics_session_id ??
      session.client_reference_id ??
      null
    const amountTotal = session.amount_total ? session.amount_total / 100 : null
    await trackServerEvent(analyticsSessionId, 'purchase', '/', {
      email,
      product: product ?? 'course',
      amount: amountTotal,
      stripeSessionId: session.id,
    })

    if (product === "prompts_111") {
      // Email 1: entrega de los prompts
      await sendPromptsEmail(email, name ?? "")
      console.log(`Prompts email sent to ${email}`)
      // Email 2: tripwire - upsell sesión 1:1
      await sendTripwireEmail(email, name ?? "")
      console.log(`Tripwire email sent to ${email}`)
    } else if (product === "prompts_111_v2") {
      // 111 Originale (nueva landing /prompts2, nuevo diseño de producto)
      await sendOriginaleEmail(email, name ?? "")
      console.log(`Originale email sent to ${email}`)
      await sendOriginaleTripwireEmail(email, name ?? "")
      console.log(`Originale tripwire email sent to ${email}`)
    } else if (product === "one_to_one") {
      // Email de confirmación de la sesión 1:1
      await sendOneToOneConfirmationEmail(email, name ?? "")
      console.log(`One-to-one confirmation email sent to ${email}`)
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
      <div class="logo">111 Originale - Javi Gil</div>

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
              Descárgalo y arrástralo al navegador, o haz doble clic en él. Navegación lateral, copia y pega -
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
        Todas las formas de usarlos son correctas.
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
   Descárgalo y arrástralo al navegador, o haz doble clic. Navegación, copia y pega -
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

async function sendTripwireEmail(email: string, name: string) {
  const greeting = name ? `Hola ${name},` : "Hola,"
  const ONE_TO_ONE_URL = "https://buy.stripe.com/7sY7sDdxbaly02C4SL9EI04"

  await resend.emails.send({
    from: "Javi Gil <contact@javiggil.com>",
    to: [email],
    subject: "Tengo algo más para ti",
    html: buildTripwireEmailHtml(greeting, ONE_TO_ONE_URL),
    text: buildTripwireEmailText(greeting, ONE_TO_ONE_URL),
  })
}

function buildTripwireEmailHtml(greeting: string, oneToOneUrl: string) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
        line-height: 1.8;
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
      .label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #FE4629;
        margin-bottom: 32px;
      }
      p {
        font-size: 16px;
        color: #333333;
        margin: 0 0 22px;
        line-height: 1.8;
      }
      .code-block {
        background: #fff8f0;
        border: 2px dashed #FE4629;
        border-radius: 10px;
        padding: 20px 24px;
        margin: 32px 0;
        text-align: center;
      }
      .code-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #999999;
        margin-bottom: 8px;
      }
      .code-value {
        font-size: 28px;
        font-weight: 800;
        letter-spacing: 0.1em;
        color: #FE4629;
        font-family: 'Courier New', monospace;
      }
      .code-note {
        font-size: 13px;
        color: #888888;
        margin-top: 8px;
      }
      .what-is {
        background: #f9f7f4;
        border-radius: 10px;
        padding: 24px 28px;
        margin: 32px 0;
      }
      .what-is-title {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #111;
        margin-bottom: 16px;
      }
      .what-is p {
        font-size: 15px;
        color: #444;
        margin: 0 0 10px;
      }
      .what-is p:last-child { margin-bottom: 0; }
      .steps-box {
        background: #f9f7f4;
        border-radius: 10px;
        padding: 24px 28px;
        margin: 32px 0;
      }
      .steps-title {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #111;
        margin-bottom: 16px;
      }
      .cta-wrap {
        text-align: center;
        margin: 36px 0 28px;
      }
      .cta-btn {
        display: inline-block;
        background: #FE4629;
        color: #ffffff !important;
        text-decoration: none;
        padding: 16px 36px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 16px;
        letter-spacing: 0.02em;
      }
      .cta-sub {
        font-size: 13px;
        color: #999999;
        margin-top: 12px;
        margin-bottom: 0;
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
      .footer a { color: #FE4629; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="label">Sesión 1:1 · Javi Gil</div>

      <p>${greeting}</p>

      <p>
        Gracias por comprar los 111 prompts. Son una herramienta potente —
        pero lo que de verdad mueve la aguja es saber aplicarlos a <strong>tu caso concreto</strong>.
      </p>

      <p>
        Por eso te ofrezco algo que no está disponible en ningún otro sitio:
        <strong>una hora conmigo, enfocada en ti</strong>.
      </p>

      <div class="what-is">
        <div class="what-is-title">Qué es la sesión 1:1</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="20" valign="top" style="color:#FE4629;font-weight:700;font-size:15px;padding-bottom:10px;">✓</td><td style="font-size:15px;color:#333;line-height:1.7;padding-bottom:10px;padding-left:8px;">Una hora por videollamada — solo tú y yo</td></tr>
          <tr><td width="20" valign="top" style="color:#FE4629;font-weight:700;font-size:15px;padding-bottom:10px;">✓</td><td style="font-size:15px;color:#333;line-height:1.7;padding-bottom:10px;padding-left:8px;">Analizamos qué estás haciendo y a dónde quieres llegar con IA</td></tr>
          <tr><td width="20" valign="top" style="color:#FE4629;font-weight:700;font-size:15px;padding-bottom:10px;">✓</td><td style="font-size:15px;color:#333;line-height:1.7;padding-bottom:10px;padding-left:8px;">Saldrás con un plan claro y pasos definidos para tu situación</td></tr>
          <tr><td width="20" valign="top" style="color:#FE4629;font-weight:700;font-size:15px;">✓</td><td style="font-size:15px;color:#333;line-height:1.7;padding-left:8px;">Sin plantillas genéricas — todo adaptado a lo que tú necesitas</td></tr>
        </table>
      </div>

      <p>
        Por haber comprado los prompts, tienes acceso a un precio especial con el código secreto:
      </p>

      <div class="code-block">
        <div class="code-label">Tu código de descuento</div>
        <div class="code-value">MISTERY</div>
        <div class="code-note">Introdúcelo en el checkout de Stripe · Plazas limitadas</div>
      </div>

      <div class="cta-wrap">
        <a href="${oneToOneUrl}" class="cta-btn">→ Reservar mi sesión 1:1</a>
        <p class="cta-sub">97€ · Una hora contigo · Plazas limitadas</p>
      </div>

      <div class="steps-box">
        <div class="steps-title">Qué pasa después de comprar</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="30" valign="top" style="padding-top:2px;">
              <div style="width:22px;height:22px;background:#FE4629;color:#fff;border-radius:50%;text-align:center;font-size:11px;font-weight:700;line-height:22px;">1</div>
            </td>
            <td style="padding-left:12px;font-size:15px;color:#333;line-height:1.6;padding-bottom:14px;">
              Compra tu sesión con el link de arriba (usa el código MISTERY)
            </td>
          </tr>
          <tr>
            <td width="30" valign="top" style="padding-top:2px;">
              <div style="width:22px;height:22px;background:#FE4629;color:#fff;border-radius:50%;text-align:center;font-size:11px;font-weight:700;line-height:22px;">2</div>
            </td>
            <td style="padding-left:12px;font-size:15px;color:#333;line-height:1.6;">
              Reserva tu hueco en el calendario: <a href="https://calendar.app.google/JCXhGkyfqKp1ekRq5" style="color:#FE4629;text-decoration:none;font-weight:600;">calendar.app.google/JCXhGkyfqKp1ekRq5</a>
            </td>
          </tr>
        </table>
      </div>

      <p>
        Si quieres saber más antes de decidirte, responde a este email y te cuento.
      </p>

      <p>
        Un saludo,<br/>
        <strong>Javi</strong>
      </p>

      <hr class="divider" />

      <div class="footer">
        Sesión 1:1 · <a href="mailto:contact@javiggil.com">contact@javiggil.com</a>
      </div>
    </div>
  </body>
</html>
  `.trim()
}

function buildTripwireEmailText(greeting: string, oneToOneUrl: string) {
  return `
${greeting}

Gracias por comprar los 111 prompts. Son una herramienta potente — pero lo que de verdad mueve la aguja es saber aplicarlos a tu caso concreto.

Por eso te ofrezco algo que no está disponible en ningún otro sitio: una hora conmigo, enfocada en ti.

QUÉ ES LA SESIÓN 1:1
----------------------
✓ Una hora por videollamada — solo tú y yo
✓ Analizamos qué estás haciendo y a dónde quieres llegar con IA
✓ Saldrás con un plan claro y pasos definidos para tu situación
✓ Sin plantillas genéricas — todo adaptado a lo que tú necesitas

Por haber comprado los prompts, tienes acceso a un precio especial con el código secreto.

TU CÓDIGO DE DESCUENTO: MISTERY
(Introdúcelo en el checkout de Stripe)

→ Reservar mi sesión 1:1: ${oneToOneUrl}
97€ · Una hora contigo · Plazas limitadas

QUÉ PASA DESPUÉS DE COMPRAR
-----------------------------
1. Compra tu sesión con el link de arriba (usa el código MISTERY)
2. Reserva tu hueco en el calendario: https://calendar.app.google/JCXhGkyfqKp1ekRq5

Si quieres saber más antes de decidirte, responde a este email y te cuento.

Un saludo,
Javi

---
Sesión 1:1 · contact@javiggil.com
  `.trim()
}

async function sendOneToOneConfirmationEmail(email: string, name: string) {
  const greeting = name ? `Hola ${name},` : "Hola,"

  await resend.emails.send({
    from: "Javi Gil <contact@javiggil.com>",
    to: [email],
    subject: "Tu sesión 1:1 con Javi — reserva tu hueco",
    html: buildOneToOneConfirmationEmailHtml(greeting),
    text: buildOneToOneConfirmationEmailText(greeting),
  })
}

function buildOneToOneConfirmationEmailHtml(greeting: string) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
      .logo {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #FE4629;
        margin-bottom: 40px;
      }
      h1 {
        font-size: 28px;
        font-weight: 600;
        color: #FAF5EB;
        margin: 32px 0 16px;
        line-height: 1.3;
      }
      h1 span { color: #FE4629; }
      p {
        font-size: 16px;
        color: #FAF5EB;
        opacity: 0.7;
        margin: 0 0 20px;
      }
      .calendar-box {
        background: rgba(254, 70, 41, 0.08);
        border: 1px solid rgba(254, 70, 41, 0.3);
        border-radius: 10px;
        padding: 24px 28px;
        margin: 32px 0;
        text-align: center;
      }
      .calendar-label {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(250, 245, 235, 0.5);
        margin-bottom: 16px;
      }
      .cta-btn {
        display: inline-block;
        background: #FE4629;
        color: #ffffff !important;
        text-decoration: none;
        padding: 14px 32px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 15px;
        letter-spacing: 0.02em;
      }
      .spam-note {
        background: rgba(250, 245, 235, 0.05);
        border: 1px solid rgba(250, 245, 235, 0.1);
        border-radius: 8px;
        padding: 16px 20px;
        margin: 28px 0;
      }
      .spam-note p {
        font-size: 14px;
        color: rgba(250, 245, 235, 0.5);
        margin: 0;
        opacity: 1;
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
      <div class="logo">SESIÓN 1:1 · JAVI GIL</div>

      <h1>${greeting}<br/><span>Ya tienes tu sesión.</span></h1>

      <p>
        Tu compra está confirmada. Ahora solo tienes que reservar el hueco en el calendario
        para que podamos quedar.
      </p>

      <div class="calendar-box">
        <div class="calendar-label">Reserva tu videollamada</div>
        <a href="https://calendar.app.google/JCXhGkyfqKp1ekRq5" class="cta-btn">→ Elegir mi fecha y hora</a>
      </div>

      <div class="spam-note">
        <p>
          ⚠️ Si no ves este email en bandeja de entrada, revisa la carpeta de spam y márcalo como "No es spam".
        </p>
      </div>

      <p>
        Nos vemos pronto. Si tienes cualquier duda antes de la sesión, responde a este email.
      </p>

      <hr class="divider" />

      <p style="font-size:16px;opacity:0.9;">
        Un saludo,<br/>
        <strong style="color:#FAF5EB;">Javi</strong>
      </p>

      <hr class="divider" />

      <div class="footer">
        ¿Tienes alguna duda? Escríbenos a
        <a href="mailto:contact@javiggil.com">contact@javiggil.com</a>
      </div>
    </div>
  </body>
</html>
  `.trim()
}

function buildOneToOneConfirmationEmailText(greeting: string) {
  return `
${greeting}

Ya tienes tu sesión.

Tu compra está confirmada. Ahora solo tienes que reservar el hueco en el calendario para que podamos quedar.

→ Reserva tu videollamada aquí: https://calendar.app.google/JCXhGkyfqKp1ekRq5

Si no ves este email en bandeja de entrada, revisa la carpeta de spam y márcalo como "No es spam".

Nos vemos pronto. Si tienes cualquier duda antes de la sesión, responde a este email.

---

Un saludo,
Javi

¿Dudas? Escríbenos a contact@javiggil.com
  `.trim()
}

// ===== 111 Originale (producto rediseñado — /prompts2) =====
// Paleta y tono editorial nuevos: cream #FAF5EB, dark #4B0A23, red #FE4629,
// Playfair Display para titulares, DM Sans para texto.

async function sendOriginaleEmail(email: string, name: string) {
  // Si los archivos nuevos del producto no están subidos a
  // public/prompts2/product/ todavía, caemos a los actuales para no romper
  // el envío. El usuario reemplazará los paths cuando los tenga listos.
  const newHtmlPath = path.join(process.cwd(), "public/prompts2/product/111-Originale.html")
  const newPdfPath = path.join(process.cwd(), "public/prompts2/product/111-Originale.pdf")
  const legacyHtmlPath = path.join(process.cwd(), "public/prompts/111_originale.html")
  const legacyPdfPath = path.join(process.cwd(), "public/prompts/111Originale-JaviGil.pdf")

  const htmlFilePath = fs.existsSync(newHtmlPath) ? newHtmlPath : legacyHtmlPath
  const pdfFilePath = fs.existsSync(newPdfPath) ? newPdfPath : legacyPdfPath

  const htmlContent = fs.readFileSync(htmlFilePath)
  const pdfContent = fs.readFileSync(pdfFilePath)

  const greeting = name ? `Hola ${name},` : "Hola,"

  await resend.emails.send({
    from: "Javi Gil <contact@javiggil.com>",
    to: [email],
    subject: "111 Originale está dentro",
    attachments: [
      { filename: "111-Originale.html", content: htmlContent },
      { filename: "111-Originale.pdf", content: pdfContent },
    ],
    html: buildOriginaleEmailHtml(greeting),
    text: buildOriginaleEmailText(greeting),
  })
}

function buildOriginaleEmailHtml(greeting: string) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>111 Originale está dentro</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#FAF5EB;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;color:#4B0A23;line-height:1.65;">
  <div style="max-width:560px;margin:0 auto;padding:48px 28px;">

    <div style="text-align:center;margin-bottom:36px;">
      <p style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#8B7355;margin:0;">Ciento once piezas</p>
      <h1 style="font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:36px;line-height:1.15;color:#4B0A23;margin:16px 0 0;">111 Originale<br/><span style="font-style:italic;color:#FE4629;">ya está dentro.</span></h1>
    </div>

    <p style="font-size:16px;margin:0 0 18px;">${greeting}</p>

    <p style="font-size:16px;margin:0 0 18px;">Gracias por confiar. Aquí tienes tu acceso a 111 Originale, el sistema completo. Llega en dos formatos adjuntos a este email:</p>

    <div style="border-left:2px solid #FE4629;padding:4px 0 4px 18px;margin:0 0 24px;">
      <p style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:17px;color:#4B0A23;margin:0;">No es un curso. Es una arquitectura.</p>
    </div>

    <div style="background:#F3EBD9;border:1px solid rgba(75,10,35,0.08);border-radius:4px;padding:22px 24px;margin:0 0 28px;">
      <p style="font-family:'Playfair Display',Georgia,serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#FE4629;margin:0 0 14px;">Aviso importante</p>
      <p style="font-size:14.5px;margin:0;"><strong style="color:#4B0A23;">Revisa la carpeta de spam si no lo ves en bandeja de entrada.</strong> Ábrelo, márcalo como "no es spam" y ya lo tendrás siempre a mano.</p>
    </div>

    <h2 style="font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:22px;color:#4B0A23;margin:32px 0 18px;">Cómo abrirlo</h2>

    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 14px;">
      <tr>
        <td style="width:28px;vertical-align:top;padding-top:2px;"><span style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;border-radius:50%;background:#FE4629;color:#FAF5EB;font-size:13px;font-weight:700;">1</span></td>
        <td style="padding-left:14px;"><p style="font-size:15px;margin:0;"><strong>El archivo .html</strong> es la forma principal. Descárgalo, ábrelo en tu navegador (Chrome, Safari, Firefox) y tendrás la arquitectura entera, navegable, lista para usar.</p></td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 14px;">
      <tr>
        <td style="width:28px;vertical-align:top;padding-top:2px;"><span style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;border-radius:50%;background:#FE4629;color:#FAF5EB;font-size:13px;font-weight:700;">2</span></td>
        <td style="padding-left:14px;"><p style="font-size:15px;margin:0;"><strong>En iPhone</strong>, Vista Previa funciona pero a veces falla al copiar. Si te pasa, ábrelo en un ordenador.</p></td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 28px;">
      <tr>
        <td style="width:28px;vertical-align:top;padding-top:2px;"><span style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;border-radius:50%;background:#FE4629;color:#FAF5EB;font-size:13px;font-weight:700;">3</span></td>
        <td style="padding-left:14px;"><p style="font-size:15px;margin:0;"><strong>El PDF adjunto</strong> es tu respaldo. Lee y copia desde ahí si prefieres.</p></td>
      </tr>
    </table>

    <div style="border-top:1px solid rgba(75,10,35,0.12);padding-top:24px;margin:32px 0 0;">
      <p style="font-size:14.5px;margin:0 0 12px;">Pago único. Acceso para siempre. Las actualizaciones futuras del sistema también te llegan sin coste.</p>
      <p style="font-size:14.5px;margin:0;">Si algo no llega o no abre, contesta a este email o escribe a <a href="mailto:contact@javiggil.com" style="color:#FE4629;text-decoration:none;">contact@javiggil.com</a> y lo resolvemos.</p>
    </div>

    <p style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:15px;color:#8B7355;margin:36px 0 0;text-align:center;">— Javi</p>

  </div>
</body>
</html>
  `.trim()
}

function buildOriginaleEmailText(greeting: string) {
  return `
${greeting}

Gracias por confiar. Aquí tienes tu acceso a 111 Originale, el sistema completo. Llega en dos formatos adjuntos:

No es un curso. Es una arquitectura.

IMPORTANTE: Revisa la carpeta de spam si no lo ves en bandeja de entrada. Márcalo como "no es spam" para tenerlo siempre a mano.

CÓMO ABRIRLO

1. El archivo .html es la forma principal. Descárgalo, ábrelo en tu navegador (Chrome, Safari, Firefox) y tendrás la arquitectura entera, navegable.

2. En iPhone, Vista Previa funciona pero a veces falla al copiar. Si te pasa, ábrelo en un ordenador.

3. El PDF adjunto es tu respaldo. Lee y copia desde ahí si prefieres.

Pago único. Acceso para siempre. Las actualizaciones futuras del sistema también te llegan sin coste.

Si algo no llega o no abre, contesta a este email o escribe a contact@javiggil.com.

— Javi
  `.trim()
}

async function sendOriginaleTripwireEmail(email: string, name: string) {
  const greeting = name ? `Hola ${name},` : "Hola,"
  const ONE_TO_ONE_URL = "https://buy.stripe.com/7sY7sDdxbaly02C4SL9EI04"

  await resend.emails.send({
    from: "Javi Gil <contact@javiggil.com>",
    to: [email],
    subject: "Una cosa más",
    html: buildOriginaleTripwireEmailHtml(greeting, ONE_TO_ONE_URL),
    text: buildOriginaleTripwireEmailText(greeting, ONE_TO_ONE_URL),
  })
}

function buildOriginaleTripwireEmailHtml(greeting: string, url: string) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Una cosa más</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#FAF5EB;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;color:#4B0A23;line-height:1.65;">
  <div style="max-width:560px;margin:0 auto;padding:48px 28px;">

    <div style="text-align:center;margin-bottom:30px;">
      <p style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#8B7355;margin:0;">Antes de cerrar</p>
      <h1 style="font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:32px;line-height:1.2;color:#4B0A23;margin:14px 0 0;">Una cosa <span style="font-style:italic;color:#FE4629;">más</span>.</h1>
    </div>

    <p style="font-size:16px;margin:0 0 18px;">${greeting}</p>

    <p style="font-size:16px;margin:0 0 16px;">El sistema está diseñado para que funcione por ti solo. La mayoría de gente llega lejos sin ayuda. Pero hay un atajo.</p>

    <p style="font-size:16px;margin:0 0 16px;">Una sesión 1:1 conmigo. 45 minutos. Miramos tu caso real — negocio, rol, cuello de botella específico — y diseñamos cómo aplicar 111 Originale a tu situación. Sin plantillas genéricas.</p>

    <div style="background:#F3EBD9;border:1px solid rgba(75,10,35,0.08);border-radius:4px;padding:22px 24px;margin:24px 0;">
      <p style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:17px;color:#4B0A23;margin:0 0 10px;">Solo para quien ya ha comprado.</p>
      <p style="font-size:14.5px;margin:0;">Usa el código <strong style="font-family:'JetBrains Mono',monospace;background:#4B0A23;color:#FAF5EB;padding:2px 8px;border-radius:3px;">MISTERY</strong> en el checkout. Descuento aplicado.</p>
    </div>

    <div style="text-align:center;margin:32px 0 24px;">
      <a href="${url}" style="display:inline-block;background:#FE4629;color:#FAF5EB;padding:16px 36px;text-decoration:none;font-family:'DM Sans',sans-serif;font-weight:700;font-size:14px;letter-spacing:1.5px;text-transform:uppercase;border-radius:2px;">Reservar mi sesión →</a>
    </div>

    <p style="font-size:14.5px;color:#8B7355;margin:0 0 24px;text-align:center;">Si prefieres, primero mira mi calendario: <a href="https://calendar.app.google/JCXhGkyfqKp1ekRq5" style="color:#FE4629;text-decoration:none;">calendar.app.google/JCXhGkyfqKp1ekRq5</a></p>

    <div style="border-top:1px solid rgba(75,10,35,0.12);padding-top:20px;margin:24px 0 0;">
      <p style="font-size:14px;color:#8B7355;margin:0;">Si no te interesa, ignora este email y disfruta de 111 Originale. Lo tienes todo dentro.</p>
    </div>

    <p style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:15px;color:#8B7355;margin:30px 0 0;text-align:center;">— Javi</p>

  </div>
</body>
</html>
  `.trim()
}

function buildOriginaleTripwireEmailText(greeting: string, url: string) {
  return `
${greeting}

El sistema está diseñado para que funcione por ti solo. La mayoría de gente llega lejos sin ayuda. Pero hay un atajo.

Una sesión 1:1 conmigo. 45 minutos. Miramos tu caso real — negocio, rol, cuello de botella específico — y diseñamos cómo aplicar 111 Originale a tu situación. Sin plantillas genéricas.

Solo para quien ya ha comprado. Usa el código MISTERY en el checkout.

Reserva aquí: ${url}

Mira mi calendario antes si quieres: https://calendar.app.google/JCXhGkyfqKp1ekRq5

Si no te interesa, ignora este email y disfruta de 111 Originale. Lo tienes todo dentro.

— Javi
  `.trim()
}
