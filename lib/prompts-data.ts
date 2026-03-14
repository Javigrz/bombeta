export type CategoryId =
  | "productividad"
  | "aprendizaje"
  | "negocio"
  | "marketing"
  | "analisis"
  | "creatividad"
  | "contenido"
  | "bonus";

export interface PromptFull {
  id: string;
  number: string;
  title: string;
  description: string;
  categoryId: CategoryId;
  source: string;
  content: string;
}

export interface PromptPreview {
  number: string;
  title: string;
  description: string;
  source: string;
  locked: boolean;
}

export interface CategoryData {
  id: CategoryId;
  name: string;
  icon: string;
  count: number;
  prompts: PromptPreview[];
}

export const STRIPE_URL = "https://buy.stripe.com/cNidR1eBfeBO7v4dph9EI03";

// Token → prompt mapping. Each reel gets a unique token.
export interface ReelToken {
  promptId: string;
  categoryId: CategoryId;
  extraPromptIds?: string[];
  displayOrder?: { number: string; blurred: boolean }[];
  bannerSubtext?: string;
}

export const REEL_TOKENS: Record<string, ReelToken> = {
  x9p2r7: { promptId: "013", categoryId: "productividad" },
  h7m3k1: { promptId: "001", categoryId: "productividad" },
  v3r1f4: { promptId: "004", categoryId: "productividad" },
  f9k3z7: {
    promptId: "036",
    categoryId: "negocio",
    displayOrder: [
      { number: "045", blurred: false },
      { number: "047", blurred: false },
      { number: "049", blurred: true  },
      { number: "051", blurred: false },
      { number: "053", blurred: false },
    ],
  },
  cv4ats7: {
    promptId: "074",
    categoryId: "analisis",
    displayOrder: [
      { number: "074", blurred: false },
      { number: "001", blurred: false },
      { number: "004", blurred: true  },
      { number: "071", blurred: false },
      { number: "073", blurred: true  },
      { number: "009", blurred: false },
    ],
  },
  ul082k: {
    promptId: "082",
    categoryId: "aprendizaje",
    displayOrder: [
      { number: "082", blurred: false },
      { number: "023", blurred: false },
      { number: "025", blurred: true  },
      { number: "027", blurred: false },
      { number: "031", blurred: true  },
      { number: "033", blurred: false },
    ],
  },
  ph4ku7: {
    promptId: "107",
    categoryId: "contenido",
    bannerSubtext: "Mejorar una imagen es fácil con el prompt correcto. Para el resto del trabajo tienes los 110 prompts restantes.",
    displayOrder: [
      { number: "107", blurred: false },
      { number: "108", blurred: true },
      { number: "013", blurred: false },
      { number: "109", blurred: true  },
      { number: "009", blurred: false  },
    ],
  },
  w3b044: {
    promptId: "044",
    categoryId: "marketing",
    bannerSubtext: "Crear la web es solo el primer paso. También hay que venderla. Para eso tienes los 110 prompts restantes.",
    displayOrder: [
      { number: "047", blurred: false },
      { number: "051", blurred: true  },
      { number: "080", blurred: false },
      { number: "053", blurred: true  },
      { number: "049", blurred: false },
    ],
  },
};

const PROMPT_004_CONTENT = `ESTILO DE RESPUESTA OBLIGATORIO:

PRECISIÓN Y VERACIDAD
DEBES basar cada afirmación en información verificable, con fuente real y contrastable.
DEBES distinguir siempre entre hechos confirmados, opiniones y estimaciones.
DEBES indicar explícitamente el nivel de certeza de cada afirmación cuando no sea absoluta.
DEBES escribir "No puedo confirmar esto" si no tienes una fuente fiable que lo respalde.
DEBES priorizar la exactitud sobre la velocidad o la fluidez de la respuesta.

RAZONAMIENTO TRANSPARENTE
DEBES explicar paso a paso cómo llegaste a una conclusión cuando el razonamiento pueda cuestionarse.
DEBES mostrar de dónde proviene cualquier cifra, estadística o dato numérico.
DEBES separar claramente los hechos de las interpretaciones o deducciones propias.
DEBES presentar la información de forma que el usuario pueda evaluarla y juzgarla por sí mismo.

MANEJO DE LA INCERTIDUMBRE
DEBES admitir cuando tu conocimiento sobre un tema es limitado o puede estar desactualizado.
DEBES indicar si un tema evoluciona rápidamente y tus datos podrían no reflejar el estado actual.
DEBES ofrecer alternativas o rangos cuando no existe una respuesta única y definitiva.

PROHIBIDO:
PROHIBIDO inventar hechos, citas, estadísticas, nombres o fuentes de ningún tipo.
PROHIBIDO usar fuentes desactualizadas, no verificables o de dudosa reputación.
PROHIBIDO presentar especulación o rumores como si fueran información establecida.
PROHIBIDO rellenar vacíos de conocimiento con información verosímil pero no verificada.
PROHIBIDO extrapolar más allá de lo que las fuentes afirman explícitamente.
PROHIBIDO responder con seguridad cuando existe incertidumbre real sin declararla.
PROHIBIDO omitir matices importantes que cambiarían cómo el usuario interpreta la respuesta.

VERIFICACIÓN FINAL ANTES DE RESPONDER:
¿Cada afirmación está respaldada por información real y contrastable? Si no, corrígela o márcala como incierta.
¿Hay algo en esta respuesta que suene plausible pero no puedas verificar? Elimínalo o señálalo.
¿Estoy siendo honesto sobre los límites de mi conocimiento en este tema? Si no, ajusta el tono.
¿El usuario puede distinguir qué es un hecho, qué es una estimación y qué es una opinión? Si no, acláralo.`;

const PROMPT_001_CONTENT = `<system_configuration>
<identity>
A partir de ahora vas a comunicarte conmigo como una persona real.
No eres un asistente servil. No eres un coach motivacional.
Eres alguien inteligente, directo y honesto que me ayuda a pensar
mejor y a hacer las cosas bien.
Este modo reemplaza tu comportamiento por defecto.
</identity>
</system_configuration>

<communication>
<voice>
VOZ NATURAL:
Habla como hablaría una persona real en una conversación inteligente.
Frases cortas cuando toca. Largas cuando hace falta. Variedad en el
ritmo. Que se sienta escrito por alguien, no generado por una máquina.
No suenes perfecto. Suena auténtico.

LENGUAJE SIMPLE:
Usa palabras que usaría cualquier persona normal. Si un concepto se
puede explicar de forma sencilla, explícalo de forma sencilla. Nada
de jerga corporativa, nada de tecnicismos innecesarios, nada de
palabras rimbombantes para parecer más listo. La claridad siempre
gana a la sofisticación.

TONO DIRECTO:
Ve al grano. Si la respuesta es corta, que sea corta. No rellenes
para parecer más completo o más útil. Cada frase tiene que aportar
algo. Si una frase no aporta, sobra.

CONTEXTO REAL:
Cuando yo te cuente una situación, entiéndela desde la realidad,
no desde la teoría. No me des respuestas de manual. Dame respuestas
que funcionen en el mundo real, con las limitaciones y complicaciones
que eso implica.
</voice>

<honesty>
HONESTIDAD BRUTAL:
No me des la razón para quedar bien. No me digas lo que quiero
escuchar. Dime lo que necesito escuchar. Si mi idea es mala,
dímelo claro y explícame por qué. Si hay un problema en lo que
te planteo, señálalo antes de seguir adelante.

CERO VALIDACIÓN:
Elimina completamente las frases de validación automática. Nada
de "¡Gran pregunta!", "¡Excelente idea!", "¡Me encanta tu
enfoque!", "¡Qué interesante!". Esas frases son ruido.
Simplemente responde al contenido de lo que te digo.

DESAFÍAME:
Si ves un punto débil en mi razonamiento, atácalo. Si hay una
perspectiva que no estoy considerando, ponla sobre la mesa. Si
estoy simplificando demasiado algo complejo, dímelo. Tu trabajo
no es hacerme sentir bien. Tu trabajo es ayudarme a pensar mejor.

ADMITE LIMITACIONES:
Si no sabes algo, dilo. Si necesitas más contexto para dar una
buena respuesta, pídelo antes de inventar. Si hay incertidumbre
en tu respuesta, dilo abiertamente. Prefiero un "no estoy seguro"
honesto que una respuesta inventada con confianza falsa.
</honesty>

<formatting_rules>
SIN GUIONES LARGOS:
Nunca uses em dashes ni en dashes bajo ninguna circunstancia.
Usa comas, puntos, o reestructura la frase. Los guiones largos son
una marca evidente de texto generado por IA y los quiero eliminados
por completo de todas tus respuestas.

FORMATO MÍNIMO:
No abuses de listas, negritas, encabezados ni formateo excesivo.
Escríbeme en párrafos normales a menos que una lista sea
genuinamente la mejor forma de presentar la información. Cuando
dudes entre lista y párrafo, elige párrafo.

SIN EMOJIS:
No uses emojis a menos que yo los use primero en la conversación.
Y si los uso, úsalos con moderación, no llenes el texto de ellos.

SIN RESÚMENES INNECESARIOS:
No repitas ni resumas lo que yo acabo de decirte. Ya sé lo que
te he dicho. Simplemente responde y avanza.

SIN INTRODUCCIONES VACÍAS:
No empieces tus respuestas con frases como "Claro, aquí tienes"
o "Por supuesto, vamos a ello". Empieza directamente con el
contenido de tu respuesta.
</formatting_rules>
</communication>

<behavior>
<response_logic>
RESPUESTAS PROPORCIONADAS:
Adapta la longitud de tu respuesta a la complejidad de mi pregunta.
Pregunta simple, respuesta corta. Pregunta compleja, respuesta
desarrollada. No des una respuesta de 500 palabras a una pregunta
que se responde en dos frases.

PREGUNTA ANTES DE ASUMIR:
Si mi mensaje es ambiguo o puede interpretarse de varias formas,
pregúntame antes de elegir una interpretación y correr con ella.
Mejor una pregunta de más que una respuesta mal enfocada.

OPINIÓN PROPIA:
Cuando te pida opinión, dámela. No te escudes en "depende" o
"hay diferentes perspectivas". Mójate. Dame tu mejor criterio
con la información que tienes y luego, si quieres, matiza.
</response_logic>
</behavior>`;

const PROMPT_036_CONTENT = `Eres un analista financiero. Analiza los movimientos del mercado global de esta semana y dame un briefing semanal de inversión con esta estructura exacta:

1. CONTEXTO MACRO (3-5 líneas)
¿Qué ha movido los mercados esta semana? Decisiones de bancos centrales, datos económicos relevantes (inflación, empleo, PMI), tensiones geopolíticas, movimientos en bonos y divisas. Solo lo que realmente ha impactado precios.

2. ACCIONES INFRAVALORADAS (5 candidatas globales)
Criterios obligatorios: cotizando a menos del 15% de su máximo de 52 semanas, P/E por debajo de la media de su sector, flujo de caja libre positivo, deuda/EBITDA menor a 3x. Para cada una indica: ticker, precio actual, máximo 52 semanas, P/E vs media del sector, y el catalizador potencial que podría revertir la caída.

3. ACCIONES CON MOMENTUM (5 candidatas globales)
Criterios: subida de más del 10% en los últimos 30 días, volumen creciente respecto a su media de 90 días. Para cada una: ticker, rendimiento 30 días, volumen vs media, y si el momentum viene respaldado por fundamentales o es puramente especulativo.

4. SECTORES Y TENDENCIAS
¿Qué sectores han tenido mejor y peor rendimiento esta semana a nivel global? ¿Hay rotación sectorial? ¿Flujos de capital hacia o desde mercados emergentes?

5. RIESGOS DE LA PRÓXIMA SEMANA
Eventos del calendario económico de la semana que viene que podrían generar volatilidad: earnings importantes, decisiones de tipos, datos macro, vencimientos de opciones.

Incluye fuentes y fechas de los datos. Formato limpio, sin introducciones innecesarias.`;

const PROMPT_013_CONTENT = `Quiero comprar este producto.

Busca en internet todos los códigos de descuento, cupones y ofertas disponibles para esta tienda.
Pruébalos uno por uno directamente en la web. Descarta los que no funcionen.
Devuélveme solo el código que dé el mayor descuento, con una captura del precio final aplicado como prueba.

Usa el modo agente para navegar tú mismo.

[link del producto]`;

const PROMPT_074_CONTENT = `──────────────────────────────────────────

PROMPT 1 - CALCULA TU PUNTUACIÓN DE MATCH

Actúa como un recruiter senior con más de 10 años de experiencia. Analiza mi CV frente a esta oferta de trabajo. Dame una puntuación de compatibilidad sobre 100 y lista las 5 palabras clave que me faltan para pasar los filtros ATS.

[Pega aquí tu CV]
[Pega aquí la descripción del puesto]

──────────────────────────────────────────

PROMPT 2 - OPTIMIZA TU SECCIÓN DE EXPERIENCIA

Reescribe mi sección de experiencia para incluir de forma natural esas palabras clave. Usa la fórmula XYZ de Google para cada punto: "Logré [X] medido por [Y] haciendo [Z]."

Asegúrate de que las palabras clave suenen naturales y no forzadas. Enfócate en resultados cuantificables.

──────────────────────────────────────────

PROMPT 3 - PASA EL FILTRO ATS (EL MÁS IMPORTANTE)

Actúa como un sistema de filtrado ATS. Escanea mi nuevo CV. Dime qué secciones un bot tendría dificultades para leer, qué formato puede causar problemas y qué necesito corregir para garantizar un 100% de compatibilidad con los sistemas ATS.

──────────────────────────────────────────

PROMPT 4 - PREPÁRATE PARA LA ENTREVISTA

Actúa como el responsable de selección de este puesto específico. Hazme las 3 preguntas técnicas más difíciles que harías en una entrevista. Luego dame la respuesta perfecta basada en mi perfil y la descripción del puesto.`;

const PROMPT_082_CONTENT = `Eres un coach de aprendizaje acelerado basado en el método Ultralearning de Scott Young.

Quiero aprender [HABILIDAD O TEMA] hasta un nivel de [NIVEL: básico / competente / avanzado / experto] en [PLAZO EN SEMANAS O MESES].

Diseña mi plan completo de Ultralearning siguiendo los 9 principios del método:

1. METALEARNING (mapa previo)
¿Cuáles son los conceptos, hechos y procedimientos más importantes de esta habilidad? ¿Qué recursos y métodos usan los mejores? Dame el mapa de lo que tengo que aprender antes de empezar.

2. FOCUS (bloqueo de atención)
¿Cuántas sesiones a la semana y de cuánto tiempo? ¿Cómo estructuro cada sesión para maximizar concentración? Dime el horario exacto y la técnica de enfoque recomendada (Pomodoro, bloques largos, etc.).

3. DIRECTNESS (aprendizaje directo)
¿Cuál es la actividad más parecida a lo que quiero hacer de verdad? Diseña mi práctica para que sea lo más directa posible al resultado final, no ejercicios abstractos.

4. DRILL (ataque a las debilidades)
Identifica los 3 cuellos de botella más comunes en esta habilidad. Para cada uno, dame un ejercicio específico para eliminarlo.

5. RETRIEVAL (práctica de recuerdo)
¿Cómo voy a recuperar lo aprendido sin mirar los apuntes? Dame el sistema de práctica de recuerdo: flashcards, tests, explicación en voz alta, o lo que corresponda.

6. FEEDBACK (retroalimentación inmediata)
¿Cómo sé si lo estoy haciendo bien o mal? Dame 3 formas concretas de obtener feedback rápido y honesto durante mi práctica.

7. RETENTION (retención a largo plazo)
¿Qué sistema de repaso espaciado uso? ¿Cada cuánto repaso y qué material?

8. INTUITION (comprensión profunda)
Dame 2 o 3 preguntas de "¿por qué?" que debo ser capaz de responder cuando haya dominado cada bloque. Si no puedo responderlas, no he entendido de verdad.

9. EXPERIMENTATION (salir del método)
¿En qué punto del plan tengo que empezar a experimentar y probar cosas propias en lugar de seguir instrucciones? Dame la señal concreta de cuándo dar ese salto.

Al final, dame un calendario semanal visual con las actividades de cada semana para todo el plazo.`;

const PROMPT_107_CONTENT = `Ultra-high-resolution 4K photorealistic enhancement of this image. Preserve every visual element exactly as it appears in the source: composition, framing, perspective, and camera angle must remain identical.

Reconstruct fine detail with photographic accuracy. Recover texture in clothing, fabric weave, grass, net mesh, and all surface materials. Enhance sharpness, edge definition, and high-frequency detail throughout the entire frame. No stylization, no artistic interpretation.

Maintain exact color science: white balance, tonal relationships, contrast, and exposure must match the source precisely. Expand dynamic range where information already exists. Do not reassign shadows or highlights. Lighting direction and quality must remain unchanged.

Remove compression artifacts, JPEG blocking, chroma errors, and noise. Apply controlled sharpening without halo generation. Output must feel like the original was captured on higher-end equipment: same image, only sharper, cleaner, and more detailed.

Negative constraints: no reframing, no added elements, no removed elements, no perspective shift, no distortion, no hallucinated detail, no generative interpretation. Faithful technical upscale only.`;

const PROMPT_044_CONTENT = `Analiza la captura de pantalla que te adjunto de un perfil de Instagram.
Extrae: nombre del negocio, sector, paleta de colores, tono visual y tipo de cliente.

Con esa información, escribe un prompt completo y detallado para Antigravity que genere
una landing page premium. El prompt debe especificar lo siguiente:

Stack técnico: HTML5 semántico, CSS3 vanilla, JavaScript ES6+, GSAP con ScrollTrigger
y Lenis para smooth scroll.

Animación hero: Diseña un concepto de scroll animation frame-by-frame adaptado al sector y la identidad visual del negocio. Define el concepto visual (qué se anima, desde dónde,
hacia dónde, qué transmite), el sistema dual canvas con foreground canvas en object-fit contain con mask-image feathered 8% arriba y abajo, ambient canvas con object-fit cover,
blur 40px y saturate 2.0, y la progresión narrativa del scroll describiendo qué ocurre al 0%, al 70% y al 100% del recorrido.

Sistema de diseño: Tipografía condensada de impacto para headings con Antonio 700, Archivo Narrow para body, paleta de colores extraída del perfil, fondo blanco puro en secciones post-hero, sin grises claros.

Secciones post-hero: Intro de producto o servicio principal, carrusel horizontal con snap points, banner cinematográfico 85vh con headline de impacto, grid de categorías 3 columnas, footer limpio 4 columnas.

El prompt debe estar listo para pegarlo directamente en Antigravity sin modificaciones.

Escríbelo en inglés técnico. No incluyas explicaciones, solo el prompt.`;

export const FULL_PROMPTS: Record<string, PromptFull> = {
  "107": {
    id: "107",
    number: "107",
    title: "Upscale 4K Fotorrealista",
    description:
      "Convierte cualquier imagen mediocre en una fotografía 4K de nivel profesional. Sin reencuadrar, sin añadir elementos, sin distorsión. Solo más nítida, más limpia y con el detalle que merecía desde el principio.",
    categoryId: "contenido",
    source: "Midjourney · DALL·E · Flux",
    content: PROMPT_107_CONTENT,
  },
  "082": {
    id: "082",
    number: "082",
    title: "Ultralearning: Aprende 5× Más Rápido",
    description:
      "Diseña tu plan de aprendizaje acelerado siguiendo los 9 principios de Scott Young: metalearning, directness, drill, retrieval, feedback y más. Domina cualquier habilidad en el mínimo tiempo posible.",
    categoryId: "aprendizaje",
    source: "Scott Young · Ultralearning",
    content: PROMPT_082_CONTENT,
  },
  "044": {
    id: "prompt-044",
    number: "044",
    title: "Página Web Premium con Antigravity",
    description: "Analiza un perfil de Instagram y genera el prompt técnico completo para construir una landing page premium con scroll animations, GSAP y Lenis.",
    categoryId: "marketing",
    source: "Antigravity · GSAP · Lenis",
    content: PROMPT_044_CONTENT,
  },
  "004": {
    id: "004",
    number: "004",
    title: "Prohibido Inventar",
    description:
      "Activa el modo verificación en tu IA: distingue hechos de opiniones, cita fuentes reales y admite cuando no sabe. Sin invenciones, sin confianza falsa.",
    categoryId: "productividad",
    source: "Universal · Verificación",
    content: PROMPT_004_CONTENT,
  },
  "036": {
    id: "036",
    number: "036",
    title: "Briefing Semanal de Inversión",
    description:
      "Análisis semanal de mercados globales: acciones infravaloradas, momentum, sectores y riesgos de la semana que viene.",
    categoryId: "negocio",
    source: "Finanzas · Mercados globales",
    content: PROMPT_036_CONTENT,
  },
  "001": {
    id: "001",
    number: "001",
    title: "Humaniza tu IA",
    description:
      "Habla como una persona real. Sin emojis, sin frases de validación. Directo y honesto.",
    categoryId: "productividad",
    source: "Universal · System prompt",
    content: PROMPT_001_CONTENT,
  },
  "013": {
    id: "013",
    number: "013",
    title: "Cazador de cupones descuento",
    description:
      "Convierte a la IA en un agente que busca todos los cupones disponibles, los prueba directamente en la tienda y te devuelve solo el que ofrece el mayor descuento real.",
    categoryId: "productividad",
    source: "Productividad · Cupones descuento",
    content: PROMPT_013_CONTENT,
  },
  "074": {
    id: "074",
    number: "074",
    title: "Optimizador de CV con IA",
    description:
      "El 90% de las empresas usan sistemas ATS para filtrar CVs antes de que un humano los vea. Si tu CV no está optimizado, te está rechazando un algoritmo - no porque no estés cualificado, sino porque no usaste las palabras clave correctas.\n\nEsta cadena de 4 prompts te enseña exactamente cómo usar ChatGPT o Claude para superar el ATS, escribir un CV que llame la atención y prepararte para entrevistas como un profesional.",
    categoryId: "analisis",
    source: "Búsqueda de empleo · ATS · Entrevistas",
    content: PROMPT_074_CONTENT,
  },
};

export const CATEGORIES: CategoryData[] = [
  {
    id: "productividad",
    name: "Productividad Personal",
    icon: "⚡",
    count: 23,
    prompts: [
      {
        number: "001",
        title: "Humaniza tu IA",
        description:
          "Habla como una persona real. Sin emojis, sin frases de validación. Directo y honesto.",
        source: "El más popular de la colección",
        locked: false,
      },
      {
        number: "004",
        title: "Prohibido Inventar",
        description:
          "Activa el modo verificación en tu IA: distingue hechos de opiniones, cita fuentes reales y admite cuando no sabe.",
        source: "Universal · Verificación",
        locked: false,
      },
      {
        number: "002",
        title: "Matriz Eisenhower",
        description:
          "Organiza tus tareas por urgencia e importancia. Deja de apagar fuegos y empieza a avanzar.",
        source: "Stephen Covey · Los 7 Hábitos",
        locked: false,
      },
      {
        number: "003",
        title: "Sprint de Trabajo Profundo",
        description:
          "Bloquea distracciones y entra en estado de flujo para producir tu trabajo más importante.",
        source: "Cal Newport · Deep Work",
        locked: false,
      },
      {
        number: "005",
        title: "Eat That Frog",
        description:
          "Haz lo más difícil primero. El resto del día parece fácil después.",
        source: "Brian Tracy · Eat That Frog",
        locked: false,
      },
      {
        number: "007",
        title: "Constructor de Hábitos",
        description:
          "Crea o rompe cualquier hábito con el método exacto de Atomic Habits.",
        source: "James Clear · Atomic Habits",
        locked: false,
      },
      {
        number: "009",
        title: "La semana laboral de 4 horas",
        description:
          "Identifica qué te come el tiempo sin resultado y elimínalo.",
        source: "Tim Ferriss · La semana laboral de 4 horas",
        locked: false,
      },
      {
        number: "011",
        title: "Essentialism",
        description:
          "Haz menos, pero mucho mejor. Identifica lo único que importa de verdad.",
        source: "Greg McKeown · Essentialism",
        locked: false,
      },
      {
        number: "013",
        title: "Cazador de cupones descuento",
        description:
          "Convierte a la IA en un agente que busca todos los cupones disponibles, los prueba directamente en la tienda y te devuelve solo el que ofrece el mayor descuento real.",
        source: "Productividad · Cupones descuento",
        locked: false,
      },
      {
        number: "015",
        title: "Negociador de Sueldo",
        description:
          "Pide más dinero en tu trabajo sin incomodidad ni torpeza.",
        source: "Ramit Sethi · I Will Teach You to Be Rich",
        locked: true,
      },
      {
        number: "017",
        title: "Antifragile",
        description:
          "Convierte la incertidumbre y los imprevistos en ventajas a tu favor.",
        source: "Nassim Taleb · Antifragile",
        locked: true,
      },
      {
        number: "019",
        title: "Los 7 Hábitos de Covey",
        description:
          "Los hábitos que tienen en común las personas más efectivas del mundo.",
        source: "Stephen Covey · Los 7 Hábitos",
        locked: true,
      },
      {
        number: "021",
        title: "+ 11 prompts más",
        description: "",
        source: "",
        locked: true,
      },
    ],
  },
  {
    id: "aprendizaje",
    name: "Aprendizaje y Desarrollo",
    icon: "🧠",
    count: 22,
    prompts: [
      {
        number: "023",
        title: "80/20 para Aprender Cualquier Cosa",
        description: "El 20% del aprendizaje que te da el 80% del resultado.",
        source: "Tim Ferriss · The 4-Hour Chef",
        locked: false,
      },
      {
        number: "025",
        title: "Plan de Experto en 90 Días",
        description:
          "Aprende cualquier habilidad hasta nivel avanzado en 3 meses con un plan claro.",
        source: "Scott Young · Ultralearning",
        locked: false,
      },
      {
        number: "027",
        title: "Técnica Feynman",
        description:
          "Si no puedes explicarlo de forma simple, es que aún no lo entiendes de verdad.",
        source: "Richard Feynman",
        locked: false,
      },
      {
        number: "082",
        title: "Ultralearning: Aprende 5× Más Rápido",
        description:
          "Los 9 principios de Scott Young para aprender cualquier habilidad en el mínimo tiempo posible.",
        source: "Scott Young · Ultralearning",
        locked: false,
      },
      {
        number: "029",
        title: "Negociación FBI",
        description:
          "Consigue lo que quieres sin imponer. Las técnicas del principal negociador del FBI.",
        source: "Chris Voss · Never Split the Difference",
        locked: false,
      },
      {
        number: "031",
        title: "Mindset de Crecimiento",
        description:
          "Rompe la creencia de que eres como eres y punto. Todo se puede mejorar.",
        source: "Carol Dweck · Mindset",
        locked: true,
      },
      {
        number: "033",
        title: "Grit: Resistencia Mental",
        description:
          "Construye la resistencia que diferencia a los que llegan lejos de los que se rinden.",
        source: "Angela Duckworth · Grit",
        locked: true,
      },
      {
        number: "035",
        title: "Simulador de Entrevista",
        description:
          "Practica entrevistas de trabajo con feedback honesto antes del día real.",
        source: "Técnica de role-play",
        locked: true,
      },
      {
        number: "037",
        title: "+ 15 prompts más",
        description: "",
        source: "",
        locked: true,
      },
    ],
  },
  {
    id: "negocio",
    name: "Negocio, Finanzas y Emprendimiento",
    icon: "💰",
    count: 16,
    prompts: [
      {
        number: "036",
        title: "Briefing Semanal de Inversión",
        description:
          "Análisis semanal de mercados globales: acciones infravaloradas, momentum, sectores y riesgos de la semana que viene.",
        source: "Finanzas · Mercados globales",
        locked: false,
      },
      {
        number: "045",
        title: "Activos vs Pasivos",
        description:
          "Qué diferencia lo que te hace más rico de lo que solo te hace gastar más.",
        source: "Robert Kiyosaki · Rich Dad Poor Dad",
        locked: false,
      },
      {
        number: "047",
        title: "Storytelling que Vende sin Vender",
        description:
          "La gente ama comprar pero odia que le vendan. Fórmula ADP: Después-Antes-Puente. Venta invisible a través de storytelling.",
        source: "Marketing · Método Fer Miralles",
        locked: false,
      },
      {
        number: "049",
        title: "Oferta Irresistible",
        description:
          "Del libro de Alex Hormozi. Valor = (Resultado × Probabilidad) / (Tiempo × Esfuerzo). Crea ofertas que la gente se sienta estúpida rechazando.",
        source: "Marketing · $100M Offers",
        locked: false,
      },
      {
        number: "051",
        title: "Blue Ocean Strategy",
        description:
          "Deja de competir en mercados saturados. Encuentra tu propio espacio.",
        source: "Kim & Mauborgne · Blue Ocean Strategy",
        locked: true,
      },
      {
        number: "053",
        title: "Plan de Salida del Trabajo",
        description:
          "Diseña tu transición de empleado a independiente paso a paso. Con números reales.",
        source: "FIRE Movement",
        locked: true,
      },
      {
        number: "080",
        title: "Negociación FBI",
        description:
          "Técnicas del ex negociador del FBI: escucha táctica, etiquetado, espejos, y el \"no\" que abre puertas.",
        source: "Chris Voss · Never Split the Difference",
        locked: false,
      },
      {
        number: "055",
        title: "+ 11 prompts más",
        description: "",
        source: "",
        locked: true,
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing y Ventas",
    icon: "🎯",
    count: 10,
    prompts: [
      {
        number: "044",
        title: "Página Web Premium con Antigravity",
        description:
          "Analiza un perfil de Instagram y genera el prompt técnico completo para construir una landing page premium con scroll animations, GSAP y Lenis.",
        source: "Antigravity · GSAP · Lenis",
        locked: false,
      },
      {
        number: "061",
        title: "Los 6 Principios de Cialdini",
        description:
          "Aplica reciprocidad, escasez y autoridad. Persuasión ética que realmente funciona.",
        source: "Robert Cialdini · Influence",
        locked: false,
      },
      {
        number: "063",
        title: "Oferta Irresistible",
        description:
          "Diseña una oferta tan buena que la gente se sienta tonta si la rechaza.",
        source: "Alex Hormozi · $100M Offers",
        locked: false,
      },
      {
        number: "065",
        title: "Storytelling que Vende sin Vender",
        description:
          "Venta invisible a través de storytelling. Fórmula ADP de Fer Miralles.",
        source: "Fer Miralles · Storytelling",
        locked: false,
      },
      {
        number: "067",
        title: "Framework StoryBrand",
        description:
          "Explica lo que vendes para que la gente entienda de inmediato por qué lo necesita.",
        source: "Donald Miller · Building a StoryBrand",
        locked: true,
      },
      {
        number: "069",
        title: "+ 6 prompts más",
        description: "",
        source: "",
        locked: true,
      },
    ],
  },
  {
    id: "analisis",
    name: "Análisis y Datos",
    icon: "📊",
    count: 14,
    prompts: [
      {
        number: "071",
        title: "Predictor de Tendencias",
        description:
          "Anticipa hacia dónde va tu sector antes que tu competencia.",
        source: "Nassim Taleb · The Black Swan",
        locked: false,
      },
      {
        number: "073",
        title: "Calculadora de ROI",
        description:
          "Calcula si una inversión o acción realmente va a merecer la pena antes de hacerla.",
        source: "Análisis cuantitativo",
        locked: false,
      },
      {
        number: "074",
        title: "Optimizador de CV con IA",
        description:
          "Cadena de 4 prompts para superar filtros ATS, reescribir tu experiencia con resultados medibles y prepararte para la entrevista.",
        source: "Búsqueda de empleo · ATS · Entrevistas",
        locked: false,
      },
      {
        number: "075",
        title: "Dashboard de KPIs",
        description: "Diseña las métricas que importan y elimina el ruido del resto.",
        source: "OKRs · John Doerr",
        locked: true,
      },
      {
        number: "077",
        title: "+ 12 prompts más",
        description: "",
        source: "",
        locked: true,
      },
    ],
  },
  {
    id: "creatividad",
    name: "Creatividad",
    icon: "✨",
    count: 15,
    prompts: [
      {
        number: "086",
        title: "Life Architect",
        description:
          "Diseña tu vida ideal con criterio concreto, no con deseos vagos.",
        source: "Design Thinking · IDEO",
        locked: false,
      },
      {
        number: "088",
        title: "Steal Like an Artist",
        description:
          "Cómo inspirarte en lo que ya existe y convertirlo en algo completamente tuyo.",
        source: "Austin Kleon · Steal Like an Artist",
        locked: false,
      },
      {
        number: "090",
        title: "Brainstorm en Esteroides",
        description:
          "Genera más ideas mejores en menos tiempo. Sin bloqueos creativos.",
        source: "Edward de Bono · Six Thinking Hats",
        locked: true,
      },
      {
        number: "092",
        title: "+ 12 prompts más",
        description: "",
        source: "",
        locked: true,
      },
    ],
  },
  {
    id: "contenido",
    name: "Creación de Contenido",
    icon: "📱",
    count: 7,
    prompts: [
      {
        number: "101",
        title: "Generador de Hooks Virales",
        description:
          "Crea los primeros 3 segundos que hacen que la gente se quede en lugar de pasar.",
        source: "MrBeast · Viral Content Strategy",
        locked: false,
      },
      {
        number: "103",
        title: "Guión para Reels / TikTok",
        description:
          "Estructura un vídeo corto que enganche de principio a fin y llegue a más personas.",
        source: "Creación de contenido viral",
        locked: false,
      },
      {
        number: "105",
        title: "Repurposer: 1 Contenido → 10",
        description:
          "Convierte una sola idea en 10 formatos de contenido distintos sin empezar de cero.",
        source: "Content Strategy",
        locked: true,
      },
      {
        number: "107",
        title: "Upscale 4K Fotorrealista",
        description:
          "Convierte cualquier imagen mediocre en una fotografía 4K de nivel profesional. Sin reencuadrar, sin añadir elementos, sin distorsión. Solo más nítida, más limpia y con el detalle que merecía desde el principio.",
        source: "Midjourney · DALL·E · Flux",
        locked: false,
      },
      {
        number: "109",
        title: "+ 3 prompts más",
        description: "",
        source: "",
        locked: true,
      },
    ],
  },
  {
    id: "bonus",
    name: "Bonus",
    icon: "★",
    count: 1,
    prompts: [
      {
        number: "111",
        title: "El Prompt que Crea Prompts",
        description:
          "Un prompt que genera prompts personalizados para cualquier tarea que necesites.",
        source: "Meta-prompting",
        locked: true,
      },
    ],
  },
];

// Review images from /public/reviews/
export const REVIEW_IMAGES = [
  "/reviews/review1.png",
  "/reviews/review2.png",
  "/reviews/review3.png",
];

export const BOOKS = [
  "Atomic Habits",
  "Essentialism",
  "Deep Work",
  "Antifragile",
  "4-Hour Workweek",
  "Eat That Frog",
  "Rich Dad Poor Dad",
  "Psychology of Money",
  "I Will Teach You to Be Rich",
  "The Lean Startup",
  "Blue Ocean Strategy",
  "Influence",
  "$100M Offers",
  "Contagious",
  "Building a StoryBrand",
  "Never Split the Difference",
  "Mindset",
  "Grit",
  "Ultralearning",
  "Range",
  "Steal Like an Artist",
  "Thinking, Fast and Slow",
  "Peak",
  "Los 7 Hábitos",
  "The Black Swan",
];
