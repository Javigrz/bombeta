import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_CONFIG: Record<
  number,
  { file: string; subject: (name: string) => string; day: string }
> = {
  1: {
    file: "email-01-tu-historia.html",
    subject: () => "Por qué hago este curso (y por qué no es uno más)",
    day: "Día 2",
  },
  2: {
    file: "email-02-caso-2-7-millones.html",
    subject: () => "2,7 millones en 30 días con IA. Sin saber programar.",
    day: "Día 4",
  },
  3: {
    file: "email-03-lo-que-te-diferencia.html",
    subject: () => "Lo que la mayoría se equivoca sobre la IA",
    day: "Día 6",
  },
  4: {
    file: "email-04-cierre.html",
    subject: () => "Últimas plazas — The AI Playbook abre el 9 de marzo",
    day: "Día 7",
  },
  5: {
    file: "email-05-seguimiento-personal.html",
    subject: (name: string) => `¿Todo bien, ${name}?`,
    day: "Día 9",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { name, email, day } = await req.json();

    if (!name || !email || !day) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    const config = EMAIL_CONFIG[Number(day)];
    if (!config) {
      return NextResponse.json({ error: "Email no válido." }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "emails", config.file);
    let html = fs.readFileSync(filePath, "utf-8");

    // Replace placeholder with actual name
    html = html.replace(/\[Nombre\]/g, name);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Javi <javi@javiggil.com>",
      to: [email],
      subject: config.subject(name),
      html,
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
