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
export const REEL_TOKENS: Record<string, { promptId: string; categoryId: CategoryId }> = {
  x9p2r7: { promptId: "013", categoryId: "productividad" },
};

const PROMPT_013_CONTENT = `Quiero comprar este producto.

Busca en internet todos los códigos de descuento, cupones y ofertas disponibles para esta tienda.
Pruébalos uno por uno directamente en la web. Descarta los que no funcionen.
Devuélveme solo el código que dé el mayor descuento, con una captura del precio final aplicado como prueba.

Usa el modo agente para navegar tú mismo.

[link del producto]`;

export const FULL_PROMPTS: Record<string, PromptFull> = {
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
};

export const CATEGORIES: CategoryData[] = [
  {
    id: "productividad",
    name: "Productividad Personal",
    icon: "⚡",
    count: 22,
    prompts: [
      {
        number: "001",
        title: "Humaniza tu IA",
        description:
          "Habla como una persona real. Sin emojis, sin frases de validación. Directo y honesto.",
        source: "Prompt original",
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
        number: "045",
        title: "Activos vs Pasivos",
        description:
          "Qué diferencia lo que te hace más rico de lo que solo te hace gastar más.",
        source: "Robert Kiyosaki · Rich Dad Poor Dad",
        locked: false,
      },
      {
        number: "047",
        title: "Psicología del Dinero",
        description:
          "Las trampas mentales que te hacen tomar malas decisiones con el dinero sin darte cuenta.",
        source: "Morgan Housel · Psychology of Money",
        locked: false,
      },
      {
        number: "049",
        title: "Lean Startup",
        description:
          "Valida tu idea de negocio antes de gastar meses de tiempo y dinero en ella.",
        source: "Eric Ries · The Lean Startup",
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
    count: 15,
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
        title: "+ 4 prompts más",
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
