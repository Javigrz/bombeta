import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import {
  getUnsubscribeHeaders,
  getUnsubscribeUrl,
  isUnsubscribed,
} from "@/lib/email-helpers";

const resend = new Resend(process.env.RESEND_API_KEY);

const STRIPE_URL = "https://buy.stripe.com/7sYfZ9dxb79m3eOdph9EI02";

type DripEmail = {
  subject: (name: string) => string;
  day: string;
  body: (name: string) => string;
};

const EMAILS: Record<number, DripEmail> = {
  1: {
    subject: () => "Por qué hago este curso (y por qué no es uno más)",
    day: "Día 2",
    body: (name) => `Hola ${name},

Te voy a contar algo que no suelo contar.

Antes de que existiera ChatGPT, yo ya había fundado empresas de inteligencia artificial. Released y Lero nacieron de la convicción de que la IA iba a cambiar cómo trabajamos. No lo digo para presumir — lo digo porque cuando todo el mundo empezó a hablar de IA en 2023, yo llevaba años metido en esto, cometiendo errores y aprendiendo de ellos.

Hoy, además de mis empresas, lidero las operaciones de IA en BBVA para hipotecas en Italia y Alemania. Un banco de primer nivel, con regulaciones durísimas, donde usamos IA todos los días para tomar mejores decisiones. No es teoría. Es mi día a día.

¿Y por qué hago un curso si ya tengo empresas y un buen trabajo?

Porque veo dos mundos. Por un lado, las empresas grandes que ya están usando IA (aunque la mayoría lo hacen mal). Por otro, personas con talento que no saben ni por dónde empezar y se pierden entre tutoriales de YouTube que no llevan a ningún sitio.

The AI Playbook no es un curso de "aprende a usar ChatGPT". Es un curso donde vas a construir algo real. Un proyecto que funcione. Algo que puedas vender, ofrecer como servicio, o usar para transformar tu empresa.

En 4 semanas. Con mis manos encima.

Si eso te interesa, confirma tu plaza antes de que se llenen:

Confirmar mi plaza (390€): ${STRIPE_URL}

Mañana te mando un caso real que te va a volar la cabeza.

Javi

P.D.: Si tienes dudas, respóndeme a este email directamente. Leo todos los mensajes.`,
  },
  2: {
    subject: () => "2,7 millones en 30 días con IA. Sin saber programar.",
    day: "Día 4",
    body: (name) => `Hola ${name},

Te prometí un caso que te iba a volar la cabeza. Ahí va.

Un chico sin experiencia en moda ni en e-commerce usó ChatGPT, Google Trends y proveedores chinos para montar una marca de calcetines desde cero. Facturó 2,7 millones de dólares en 30 días.

No es clickbait. Es método. Y es exactamente lo que enseño en el curso.

Te desgloso lo que hizo paso a paso:

1. Detectó una tendencia. Pilates estaba creciendo un 10% al año en Google Trends. Eso es demanda validada con datos, no con intuición.

2. Usó IA para encontrar el producto. Scrapeó transcripciones de vídeos de YouTube de creadoras de Pilates, se las metió a ChatGPT y le preguntó: "¿qué producto mencionan todas una y otra vez?" La respuesta: grip socks (calcetines antideslizantes). Había demanda real, pero ninguna marca dominaba ese mercado.

3. No inventó nada. Usó IA para analizar qué estética, qué webs y qué visuales ya funcionaban en ese nicho. Copió lo que convertía y lo adaptó a su marca.

4. Contenido con método. Cada vídeo que publicaba tenía un pattern interrupt en los primeros 3 segundos que disparaba la retención. Cuando un vídeo se hacía viral, targeteaba publicidad directamente a la gente que había visto el vídeo completo. Audiencia caliente, que ya conoce tu producto, con un anuncio directo a compra.

Resultado: 2,7 millones en un mes.

¿Por qué te cuento esto?

Porque esto sigue una regla clásica: busca donde la demanda ya está validada pero la competencia todavía no ha llegado. La IA simplemente te permite encontrarlo antes que nadie.

Y esto es EXACTAMENTE lo que vamos a hacer en el AI Playbook:

- ENTIENDE: aprendes a leer tendencias y validar demanda con datos reales, no con suposiciones.
- USA: aprendes a usar las herramientas — ChatGPT, automatizaciones con n8n, scraping básico — para extraer información que otros no ven.
- CREA: construyes tu propio proyecto — tu versión de los grip socks — y lo presentas al grupo.

No necesitas saber programar. No necesitas tener una idea brillante. Necesitas método y las herramientas correctas. Eso es lo que te doy.

Quiero aprender esto — Confirmar mi plaza: ${STRIPE_URL}

Javi

P.D.: Te queda un email más antes de que abra las plazas al público general. Los que estáis en esta lista tenéis prioridad.`,
  },
  3: {
    subject: () => "Lo que la mayoría se equivoca sobre la IA",
    day: "Día 6",
    body: (name) => `Hola ${name},

Te voy a decir algo que no vas a leer en ningún otro sitio:

El 90% de los cursos de IA te enseñan a escribir prompts. Y eso está bien como punto de partida. Pero es como enseñarte a encender un coche y decirte que ya sabes conducir.

Lo que yo he aprendido construyendo Released y Lero, y trabajando con IA en BBVA, es que la diferencia no está en el prompt. Está en la arquitectura. En saber diseñar el sistema antes de tocar una herramienta.

¿Recuerdas el caso de los grip socks que te conté? El chaval no empezó abriendo ChatGPT a ver qué pasaba. Empezó validando la demanda con datos. Luego analizó la competencia. Luego diseñó el producto. Y LUEGO usó la IA para ejecutar. Arquitectura primero, herramientas después.

Mi regla número 1: no avances al siguiente paso hasta que el anterior esté sólido.

En mi consultoría veo esto constantemente. Empresas que arrancan proyectos de IA sin validar primero. Agencias que empiezan a programar sin diseñar la arquitectura. Y luego el proyecto cuesta el triple y no funciona.

Mi método es diferente: un día de validación regulatoria, una semana de prueba técnica, y diseño completo ANTES de escribir una línea de código.

En el AI Playbook aplicamos esto literalmente. No pasas al módulo de construir (CREA) hasta que entiendas (ENTIENDE) y sepas usar las herramientas (USA). Es paso a paso, sin atajos.

Mañana te mando el último email antes de cerrar plazas. Va a tener el enlace de pago directo.

Si ya tienes claro que quieres entrar, no esperes:

Confirmar mi plaza: ${STRIPE_URL}

Javi

P.D.: Todas las sesiones son en directo por videollamada. Si algún día no puedes, quedan grabadas. Pero te recomiendo venir en directo — la interacción es donde ocurre la magia.`,
  },
  4: {
    subject: () => "Plazas limitadas - The AI Playbook abre próximamente",
    day: "Día 7",
    body: (name) => `Hola ${name},

Voy al grano.

Reservaste tu plaza en The AI Playbook hace una semana. Desde entonces te he contado quién soy, qué puedes conseguir con IA y método, y cómo funciona el curso.

Ahora te toca decidir.

Esto es lo que tienes sobre la mesa:

- 8 sesiones en directo conmigo durante 4 semanas.
- Aprendes a entender, usar y construir con IA de verdad.
- Sales con un proyecto funcional que puedes vender o usar en tu empresa.
- Acceso a las grabaciones de por vida.
- Grupo reducido para que haya interacción real.
- Impartido por alguien que funda empresas de IA y lidera IA en un banco tier-1. No un influencer que descubrió ChatGPT ayer.

Precio: 390€

Empieza próximamente. Las plazas son limitadas y no voy a ampliar el grupo porque quiero que funcione bien.

Confirmar mi plaza — Pagar ahora: ${STRIPE_URL}

Pago seguro. Plazas limitadas.

Si tienes alguna duda que no te he resuelto en estos emails, respóndeme directamente. Te contesto hoy.

Javi

P.D.: No va a haber otra edición hasta dentro de unos meses. Si quieres aprender esto, el momento es ahora.`,
  },
  5: {
    subject: (name: string) => `¿Todo bien, ${name}?`,
    day: "Día 9",
    body: (name) => `Hola ${name},

He visto que reservaste plaza en The AI Playbook pero todavía no la has confirmado.

Sin presión. Pero quiero asegurarme de que no es porque te ha quedado alguna duda sin resolver.

Si es una cuestión de timing, lo entiendo perfectamente. Si es una cuestión de dudas sobre el curso, hablemos. Puedes:

- Responderme a este email con tu duda.
- Reservar 15 minutos conmigo y te lo cuento todo.

Y si simplemente no es para ti, también lo entiendo. Sin resentimientos.

Javi

P.D.: Si finalmente decides entrar, tu plaza sigue disponible aquí: ${STRIPE_URL}`,
  },
};

function buildBody(name: string, body: string, email: string): string {
  return `${body}

---
The AI Playbook · contact@javiggil.com
Para darte de baja: ${getUnsubscribeUrl(email)}`;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, day } = await req.json();

    if (!name || !email || !day) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    const config = EMAILS[Number(day)];
    if (!config) {
      return NextResponse.json({ error: "Email no válido." }, { status: 400 });
    }

    if (await isUnsubscribed(email)) {
      return NextResponse.json({ success: true, skipped: "unsubscribed" });
    }

    const text = buildBody(name, config.body(name), email);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Javi Gil <curso@javiggil.com>",
      to: [email],
      subject: config.subject(name),
      text,
      headers: getUnsubscribeHeaders(email),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
