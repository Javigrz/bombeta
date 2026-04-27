import { headers } from "next/headers"
import Stripe from "stripe"
import { Resend } from "resend"
import fs from "fs"
import path from "path"
import { trackServerEvent } from "@/lib/analytics-db"
import {
  getUnsubscribeHeaders,
  getUnsubscribeUrl,
  resubscribe,
  SYSTEM_FONT_STACK,
} from "@/lib/email-helpers"
import { signOriginaleToken } from "@/lib/originale-token"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY)

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://javiggil.com"

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
    const product =
      session.metadata?.product ||
      (session.metadata?.Value === "prompts_111" ? "prompts_111" : null)

    if (!email) {
      return new Response("No email found", { status: 200 })
    }

    // Re-opt-in: una nueva compra reactiva la suscripción a marketing.
    await resubscribe(email)

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
      await sendPromptsEmail(email, name ?? "")
      console.log(`Prompts email sent to ${email}`)
      await sendTripwireEmail(email, name ?? "")
      console.log(`Tripwire email sent to ${email}`)
    } else if (product === "prompts_111_v2") {
      await sendOriginaleEmail(email, name ?? "")
      console.log(`Originale email sent to ${email}`)
      await sendOriginaleTripwireEmail(email, name ?? "")
      console.log(`Originale tripwire email sent to ${email}`)
    } else if (product === "one_to_one") {
      await sendOneToOneConfirmationEmail(email, name ?? "")
      console.log(`One-to-one confirmation email sent to ${email}`)
    } else {
      await resend.emails.send({
        from: "Javi Gil <contact@javiggil.com>",
        to: [email],
        subject: "Ya eres parte de The AI Playbook",
        html: buildCourseConfirmationHtml(name ?? "", email),
        text: buildCourseConfirmationText(name ?? "", email),
        headers: getUnsubscribeHeaders(email),
      })
      console.log(`Course confirmation email sent to ${email}`)
    }
  }

  return new Response("OK", { status: 200 })
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function emailFooter(email: string, label = "contact@javiggil.com"): string {
  return `<hr style="border:none;border-top:1px solid #eaeaea;margin:32px 0 16px;" />
<p style="margin:0;font-size:13px;color:#888;">${escapeHtml(label)}<br /><a href="${getUnsubscribeUrl(email)}" style="color:#888;">Darme de baja</a></p>`
}

function emailFooterText(email: string, label = "contact@javiggil.com"): string {
  return `\n\n---\n${label}\nPara darte de baja: ${getUnsubscribeUrl(email)}`
}

function bodyOpen(): string {
  return `<body style="margin:0;padding:24px;font-family:${SYSTEM_FONT_STACK};font-size:16px;line-height:1.7;color:#1a1a1a;background-color:#ffffff;">`
}

function htmlShell(title: string, inner: string): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
</head>
${bodyOpen()}
${inner}
</body>
</html>`
}

// ─── Course confirmation ────────────────────────────────────────────────────

function buildCourseConfirmationHtml(name: string, email: string): string {
  const greeting = name ? `Hola ${escapeHtml(name)},` : "Hola,"
  const inner = `<p style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#FE4629;">The AI Playbook</p>
<p style="margin:0 0 16px;font-size:22px;font-weight:600;">${greeting} Ya eres parte de The AI Playbook.</p>
<p style="margin:0 0 16px;">No tienes que hacer nada más. Nosotros nos ponemos en contacto contigo cuando se acerque la fecha con toda la información y el enlace a la videollamada.</p>
<p style="margin:0 0 16px;">Mientras tanto, si tienes alguna pregunta no dudes en escribirnos a <a href="mailto:contact@javiggil.com" style="color:#FE4629;">contact@javiggil.com</a>.</p>
${emailFooter(email, "The AI Playbook · contact@javiggil.com")}`
  return htmlShell("Ya eres parte de The AI Playbook", inner)
}

function buildCourseConfirmationText(name: string, email: string): string {
  const greeting = name ? `Hola ${name},` : "Hola,"
  return `${greeting}

Ya eres parte de The AI Playbook.

No tienes que hacer nada más. Nosotros nos ponemos en contacto contigo cuando se acerque la fecha con toda la información y el enlace a la videollamada.

Mientras tanto, si tienes alguna pregunta no dudes en escribirnos a contact@javiggil.com${emailFooterText(email, "THE AI PLAYBOOK · contact@javiggil.com")}`
}

// ─── 111 Prompts (legacy) ───────────────────────────────────────────────────

async function sendPromptsEmail(email: string, name: string) {
  const pdfFilePath = path.join(process.cwd(), "private/prompts/111Originale-JaviGil.pdf")
  const pdfContent = fs.readFileSync(pdfFilePath)

  const htmlUrl = `${SITE_URL}/prompts/111_originale.html`
  const greeting = name ? `Hola ${name},` : "Hola,"

  await resend.emails.send({
    from: "Javi Gil <contact@javiggil.com>",
    to: [email],
    subject: "Tus 111 Originale ya están aquí",
    attachments: [
      { filename: "111-Originale-Prompts.pdf", content: pdfContent },
    ],
    html: buildPromptsHtml(greeting, htmlUrl, email),
    text: buildPromptsText(greeting, htmlUrl, email),
    headers: getUnsubscribeHeaders(email),
  })
}

function buildPromptsHtml(greeting: string, htmlUrl: string, email: string): string {
  const inner = `<p style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#FE4629;">111 Originale — Javi Gil</p>
<p style="margin:0 0 16px;font-size:20px;font-weight:600;">${escapeHtml(greeting)}<br />Aquí tienes tus prompts.</p>
<p style="margin:0 0 16px;">Tienes dos formas de acceder al sistema. Ambas con exactamente el mismo contenido. Son tuyas para siempre.</p>
<p style="margin:24px 0 12px;font-weight:600;">Versión interactiva (recomendada)</p>
<p style="margin:0 0 12px;">Es la mejor experiencia: índice lateral, navegación entre categorías y un botón para copiar cada prompt con un clic.</p>
<p style="margin:0 0 16px;"><a href="${htmlUrl}" style="color:#FE4629;font-weight:600;">Abrir los 111 prompts</a> · Funciona en Chrome, Safari y Firefox. Guarda el enlace o añádelo a marcadores.</p>
<p style="margin:24px 0 12px;font-weight:600;">PDF (adjunto)</p>
<p style="margin:0 0 16px;">Adjunto al email para que lo tengas también offline. Útil para hojear los prompts o copiar alguno sin abrir el navegador.</p>
<p style="margin:0 0 16px;">Hay 111 prompts organizados por categorías. Tómate el tiempo que necesites para explorarlos. Todas las formas de usarlos son correctas.</p>
<p style="margin:24px 0 16px;">Un saludo,<br /><strong>Javi</strong></p>
<p style="margin:0 0 0;font-size:14px;color:#666;">¿Tienes alguna duda o no puedes acceder? Escríbenos a <a href="mailto:contact@javiggil.com" style="color:#FE4629;">contact@javiggil.com</a> y te lo solucionamos.</p>
${emailFooter(email, "111 Originale · contact@javiggil.com")}`
  return htmlShell("Tus 111 Originale ya están aquí", inner)
}

function buildPromptsText(greeting: string, htmlUrl: string, email: string): string {
  return `${greeting}

Aquí tienes tus prompts.

Tienes dos formas de acceder al sistema. Ambas con exactamente el mismo contenido. Son tuyas para siempre.

VERSIÓN INTERACTIVA (recomendada)

Es la mejor experiencia: índice lateral, navegación entre categorías y un botón para copiar cada prompt con un clic.

Abrir los 111 prompts: ${htmlUrl}

Funciona en Chrome, Safari y Firefox. Guarda el enlace o añádelo a marcadores.

PDF (adjunto)

Adjunto al email para que lo tengas también offline. Útil para hojear los prompts o copiar alguno sin abrir el navegador.

Hay 111 prompts organizados por categorías. Tómate el tiempo que necesites para explorarlos. Todas las formas de usarlos son correctas.

Un saludo,
Javi

¿Dudas o no puedes acceder? Escríbenos a contact@javiggil.com${emailFooterText(email, "111 Originale · contact@javiggil.com")}`
}

// ─── Tripwire (1:1 upsell tras 111) ─────────────────────────────────────────

async function sendTripwireEmail(email: string, name: string) {
  const greeting = name ? `Hola ${name},` : "Hola,"
  const ONE_TO_ONE_URL = "https://buy.stripe.com/7sY7sDdxbaly02C4SL9EI04"

  await resend.emails.send({
    from: "Javi Gil <contact@javiggil.com>",
    to: [email],
    subject: "Tengo algo más para ti",
    html: buildTripwireHtml(greeting, ONE_TO_ONE_URL, email),
    text: buildTripwireText(greeting, ONE_TO_ONE_URL, email),
    headers: getUnsubscribeHeaders(email),
  })
}

function buildTripwireHtml(greeting: string, oneToOneUrl: string, email: string): string {
  const inner = `<p style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#FE4629;">Sesión 1:1 · Javi Gil</p>
<p style="margin:0 0 16px;">${escapeHtml(greeting)}</p>
<p style="margin:0 0 16px;">Gracias por comprar los 111 prompts. Son una herramienta potente — pero lo que de verdad mueve la aguja es saber aplicarlos a <strong>tu caso concreto</strong>.</p>
<p style="margin:0 0 16px;">Por eso te ofrezco algo que no está disponible en ningún otro sitio: <strong>una hora conmigo, enfocada en ti</strong>.</p>
<p style="margin:24px 0 12px;font-weight:600;">Qué es la sesión 1:1</p>
<p style="margin:0 0 8px;">— Una hora por videollamada — solo tú y yo</p>
<p style="margin:0 0 8px;">— Analizamos qué estás haciendo y a dónde quieres llegar con IA</p>
<p style="margin:0 0 8px;">— Saldrás con un plan claro y pasos definidos para tu situación</p>
<p style="margin:0 0 16px;">— Sin plantillas genéricas — todo adaptado a lo que tú necesitas</p>
<p style="margin:0 0 16px;">Por haber comprado los prompts, tienes acceso a un precio especial con el código secreto:</p>
<p style="margin:0 0 16px;font-size:18px;"><strong>Código de descuento: MISTERY</strong><br /><span style="font-size:13px;color:#666;">Introdúcelo en el checkout de Stripe · Plazas limitadas</span></p>
<p style="margin:0 0 16px;"><a href="${oneToOneUrl}" style="color:#FE4629;font-weight:600;">Reservar mi sesión 1:1 (97€)</a></p>
<p style="margin:24px 0 12px;font-weight:600;">Qué pasa después de comprar</p>
<p style="margin:0 0 8px;">1. Compra tu sesión con el link de arriba (usa el código MISTERY)</p>
<p style="margin:0 0 16px;">2. Reserva tu hueco en el calendario: <a href="https://calendar.app.google/JCXhGkyfqKp1ekRq5" style="color:#FE4629;">calendar.app.google/JCXhGkyfqKp1ekRq5</a></p>
<p style="margin:0 0 16px;">Si quieres saber más antes de decidirte, responde a este email y te cuento.</p>
<p style="margin:0 0 0;">Un saludo,<br /><strong>Javi</strong></p>
${emailFooter(email, "Sesión 1:1 · contact@javiggil.com")}`
  return htmlShell("Tengo algo más para ti", inner)
}

function buildTripwireText(greeting: string, oneToOneUrl: string, email: string): string {
  return `${greeting}

Gracias por comprar los 111 prompts. Son una herramienta potente — pero lo que de verdad mueve la aguja es saber aplicarlos a tu caso concreto.

Por eso te ofrezco algo que no está disponible en ningún otro sitio: una hora conmigo, enfocada en ti.

QUÉ ES LA SESIÓN 1:1

— Una hora por videollamada — solo tú y yo
— Analizamos qué estás haciendo y a dónde quieres llegar con IA
— Saldrás con un plan claro y pasos definidos para tu situación
— Sin plantillas genéricas — todo adaptado a lo que tú necesitas

Por haber comprado los prompts, tienes acceso a un precio especial con el código secreto.

Código de descuento: MISTERY (introdúcelo en el checkout de Stripe)

Reservar mi sesión 1:1: ${oneToOneUrl}
97€ · Una hora contigo · Plazas limitadas

QUÉ PASA DESPUÉS DE COMPRAR

1. Compra tu sesión con el link de arriba (usa el código MISTERY)
2. Reserva tu hueco en el calendario: https://calendar.app.google/JCXhGkyfqKp1ekRq5

Si quieres saber más antes de decidirte, responde a este email y te cuento.

Un saludo,
Javi${emailFooterText(email, "Sesión 1:1 · contact@javiggil.com")}`
}

// ─── 1:1 confirmation ───────────────────────────────────────────────────────

async function sendOneToOneConfirmationEmail(email: string, name: string) {
  const greeting = name ? `Hola ${name},` : "Hola,"

  await resend.emails.send({
    from: "Javi Gil <contact@javiggil.com>",
    to: [email],
    subject: "Tu sesión 1:1 con Javi — reserva tu hueco",
    html: buildOneToOneConfirmationHtml(greeting, email),
    text: buildOneToOneConfirmationText(greeting, email),
    headers: getUnsubscribeHeaders(email),
  })
}

function buildOneToOneConfirmationHtml(greeting: string, email: string): string {
  const inner = `<p style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#FE4629;">Sesión 1:1 · Javi Gil</p>
<p style="margin:0 0 16px;font-size:20px;font-weight:600;">${escapeHtml(greeting)} Ya tienes tu sesión.</p>
<p style="margin:0 0 16px;">Tu compra está confirmada. Ahora solo tienes que reservar el hueco en el calendario para que podamos quedar.</p>
<p style="margin:0 0 16px;"><a href="https://calendar.app.google/JCXhGkyfqKp1ekRq5" style="color:#FE4629;font-weight:600;">Elegir mi fecha y hora</a></p>
<p style="margin:0 0 16px;font-size:14px;color:#666;">Si no ves este email en bandeja de entrada, revisa la carpeta de spam y márcalo como "No es spam".</p>
<p style="margin:0 0 16px;">Nos vemos pronto. Si tienes cualquier duda antes de la sesión, responde a este email.</p>
<p style="margin:0 0 0;">Un saludo,<br /><strong>Javi</strong></p>
${emailFooter(email, "Sesión 1:1 · contact@javiggil.com")}`
  return htmlShell("Tu sesión 1:1", inner)
}

function buildOneToOneConfirmationText(greeting: string, email: string): string {
  return `${greeting}

Ya tienes tu sesión.

Tu compra está confirmada. Ahora solo tienes que reservar el hueco en el calendario para que podamos quedar.

Reserva tu videollamada aquí: https://calendar.app.google/JCXhGkyfqKp1ekRq5

Si no ves este email en bandeja de entrada, revisa la carpeta de spam y márcalo como "No es spam".

Nos vemos pronto. Si tienes cualquier duda antes de la sesión, responde a este email.

Un saludo,
Javi${emailFooterText(email, "Sesión 1:1 · contact@javiggil.com")}`
}

// ─── 111 Originale (producto rediseñado) ────────────────────────────────────

async function sendOriginaleEmail(email: string, name: string) {
  const token = await signOriginaleToken(email)
  const accessUrl = `${SITE_URL}/originale?t=${encodeURIComponent(token)}`
  const greeting = name ? `Hola ${name},` : "Hola,"

  await resend.emails.send({
    from: "Javier Gil <javier.gil@javiggil.com>",
    to: [email],
    subject: "Tu acceso a 111 Originale",
    html: buildOriginaleHtml(greeting, accessUrl, email),
    text: buildOriginaleText(greeting, accessUrl, email),
    headers: getUnsubscribeHeaders(email),
  })
}

function buildOriginaleHtml(greeting: string, accessUrl: string, email: string): string {
  const inner = `<p style="margin:0 0 16px;">${escapeHtml(greeting)}</p>
<p style="margin:0 0 16px;">Gracias por comprar 111 Originale.</p>
<p style="margin:0 0 16px;">Tu acceso está aquí:</p>
<p style="margin:0 0 16px;"><a href="${accessUrl}" style="color:#FE4629;font-weight:600;">Abrir 111 Originale</a></p>
<p style="margin:0 0 16px;">En esa página encuentras el sistema en dos formatos: la versión navegable (HTML interactivo con índice y botón para copiar cada prompt) y la edición editorial en PDF, pensada para leer en e-reader, en el iPad o imprimir y subrayar. Mismo contenido, distinta forma de habitarlo.</p>
<p style="margin:0 0 16px;">Guarda el enlace en marcadores. El acceso es tuyo, para siempre.</p>
<p style="margin:0 0 16px;">Lo que viene a partir de aquí es distinto.</p>
<p style="margin:0 0 16px;">Durante las próximas 12 semanas te voy a enviar un email cada viernes. No son recordatorios del producto. No son instrucciones para usar los prompts. Son otra cosa.</p>
<p style="margin:0 0 16px;">Lo que aprendí dirigiendo IA en uno de los mayores bancos de Europa y construyendo dos startups con IA es que el 90% de lo que pasa en este espacio la gente no lo ve. Lo que ves en redes es el 10% ruidoso.</p>
<p style="margin:0 0 16px;">Los 12 emails son el 90% restante. Técnicas que cambian cómo usas la IA. Herramientas que la mayoría no conoce. Formas de construir con IA que antes costaban 50.000 euros y ahora las puede hacer una persona. Y lo que está pasando en banca con la IA, que es lo que mejor conozco y casi nadie cuenta bien.</p>
<p style="margin:0 0 16px;">No es teoría. Es lo que yo uso y lo que veo usar desde dentro.</p>
<p style="margin:0 0 16px;">Esta primera semana, una sola cosa: entra al sistema, lee la introducción, y empieza Capa 1. Son cinco pasos. Si vas rápido los haces en un día. Si vas despacio, en una semana. Ambos ritmos están bien.</p>
<p style="margin:0 0 16px;">El viernes que viene hablamos del primer territorio que la mayoría no ve: cómo el sitio donde vive un prompt importa más que el prompt en sí.</p>
<p style="margin:0 0 0;">Javi</p>
${emailFooter(email, "111 Originale · javier.gil@javiggil.com")}`
  return htmlShell("Tu acceso a 111 Originale", inner)
}

function buildOriginaleText(greeting: string, accessUrl: string, email: string): string {
  return `${greeting}

Gracias por comprar 111 Originale.

Tu acceso está aquí: ${accessUrl}

En esa página encuentras el sistema en dos formatos: la versión navegable (HTML interactivo con índice y botón para copiar cada prompt) y la edición editorial en PDF, pensada para leer en e-reader, en el iPad o imprimir y subrayar. Mismo contenido, distinta forma de habitarlo.

Guarda el enlace en marcadores. El acceso es tuyo, para siempre.

Lo que viene a partir de aquí es distinto.

Durante las próximas 12 semanas te voy a enviar un email cada viernes. No son recordatorios del producto. No son instrucciones para usar los prompts. Son otra cosa.

Lo que aprendí dirigiendo IA en uno de los mayores bancos de Europa y construyendo dos startups con IA es que el 90% de lo que pasa en este espacio la gente no lo ve. Lo que ves en redes es el 10% ruidoso.

Los 12 emails son el 90% restante. Técnicas que cambian cómo usas la IA. Herramientas que la mayoría no conoce. Formas de construir con IA que antes costaban 50.000 euros y ahora las puede hacer una persona. Y lo que está pasando en banca con la IA, que es lo que mejor conozco y casi nadie cuenta bien.

No es teoría. Es lo que yo uso y lo que veo usar desde dentro.

Esta primera semana, una sola cosa: entra al sistema, lee la introducción, y empieza Capa 1. Son cinco pasos. Si vas rápido los haces en un día. Si vas despacio, en una semana. Ambos ritmos están bien.

El viernes que viene hablamos del primer territorio que la mayoría no ve: cómo el sitio donde vive un prompt importa más que el prompt en sí.

Javi${emailFooterText(email, "111 Originale · javier.gil@javiggil.com")}`
}

// ─── 111 Originale tripwire ─────────────────────────────────────────────────

async function sendOriginaleTripwireEmail(email: string, name: string) {
  const greeting = name ? `Hola ${name},` : "Hola,"
  const ONE_TO_ONE_URL = "https://buy.stripe.com/7sY7sDdxbaly02C4SL9EI04"

  await resend.emails.send({
    from: "Javi Gil <contact@javiggil.com>",
    to: [email],
    subject: "Una cosa más",
    html: buildOriginaleTripwireHtml(greeting, ONE_TO_ONE_URL, email),
    text: buildOriginaleTripwireText(greeting, ONE_TO_ONE_URL, email),
    headers: getUnsubscribeHeaders(email),
  })
}

function buildOriginaleTripwireHtml(greeting: string, url: string, email: string): string {
  const inner = `<p style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#FE4629;">Antes de cerrar</p>
<p style="margin:0 0 16px;font-size:22px;font-weight:600;">Una cosa más.</p>
<p style="margin:0 0 16px;">${escapeHtml(greeting)}</p>
<p style="margin:0 0 16px;">El sistema está diseñado para que funcione por ti solo. La mayoría de gente llega lejos sin ayuda. Pero hay un atajo.</p>
<p style="margin:0 0 16px;">Una sesión 1:1 conmigo. 1 hora. Miramos tu caso real — negocio, rol, cuello de botella específico — y diseñamos cómo aplicar 111 Originale a tu situación. Sin plantillas genéricas.</p>
<p style="margin:0 0 16px;"><strong>Solo para quien ya ha comprado.</strong> Usa el código <strong>MISTERY</strong> en el checkout. Descuento aplicado.</p>
<p style="margin:0 0 16px;"><a href="${url}" style="color:#FE4629;font-weight:600;">Reservar mi sesión</a></p>
<p style="margin:0 0 16px;font-size:14px;color:#666;">Si prefieres, primero mira mi calendario: <a href="https://calendar.app.google/JCXhGkyfqKp1ekRq5" style="color:#FE4629;">calendar.app.google/JCXhGkyfqKp1ekRq5</a></p>
<p style="margin:0 0 16px;font-size:14px;color:#666;">Si no te interesa, ignora este email y disfruta de 111 Originale. Lo tienes todo dentro.</p>
<p style="margin:0 0 0;">— Javi</p>
${emailFooter(email, "111 Originale · contact@javiggil.com")}`
  return htmlShell("Una cosa más", inner)
}

function buildOriginaleTripwireText(greeting: string, url: string, email: string): string {
  return `${greeting}

El sistema está diseñado para que funcione por ti solo. La mayoría de gente llega lejos sin ayuda. Pero hay un atajo.

Una sesión 1:1 conmigo. 1 hora. Miramos tu caso real — negocio, rol, cuello de botella específico — y diseñamos cómo aplicar 111 Originale a tu situación. Sin plantillas genéricas.

Solo para quien ya ha comprado. Usa el código MISTERY en el checkout.

Reserva aquí: ${url}

Mira mi calendario antes si quieres: https://calendar.app.google/JCXhGkyfqKp1ekRq5

Si no te interesa, ignora este email y disfruta de 111 Originale. Lo tienes todo dentro.

— Javi${emailFooterText(email, "111 Originale · contact@javiggil.com")}`
}
