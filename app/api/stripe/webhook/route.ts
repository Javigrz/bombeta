import { headers } from "next/headers"
import Stripe from "stripe"
import { Resend } from "resend"

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

    if (!email) {
      return new Response("No email found", { status: 200 })
    }

    await resend.emails.send({
      from: "Javi Gil <contact@javiggil.com>",
      to: [email],
      subject: "Ya eres parte de The AI Playbook",
      html: buildConfirmationEmail(name ?? ""),
      text: buildConfirmationEmailText(name ?? ""),
    })

    console.log(`Confirmation email sent to ${email}`)
  }

  return new Response("OK", { status: 200 })
}

function buildConfirmationEmail(name: string) {
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

function buildConfirmationEmailText(name: string) {
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
