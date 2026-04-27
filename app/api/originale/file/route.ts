import { NextRequest } from "next/server"
import fs from "fs"
import path from "path"
import { verifyOriginaleToken } from "@/lib/originale-token"

const FILES = {
  pdf: {
    relPath: "private/prompts/111Originale-JaviGil.pdf",
    filename: "111-Originale.pdf",
    contentType: "application/pdf",
  },
  html: {
    relPath: "private/prompts/111_originale.html",
    filename: "111-Originale.html",
    contentType: "text/html; charset=utf-8",
  },
} as const

type FileType = keyof typeof FILES

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("t")
  const type = searchParams.get("type") as FileType | null

  if (!token) {
    return new Response("Missing token", { status: 401 })
  }

  const email = await verifyOriginaleToken(token)
  if (!email) {
    return new Response("Invalid token", { status: 401 })
  }

  if (!type || !(type in FILES)) {
    return new Response("Invalid type", { status: 400 })
  }

  const file = FILES[type]
  const absPath = path.join(process.cwd(), file.relPath)

  let buffer: Buffer
  try {
    buffer = fs.readFileSync(absPath)
  } catch (err) {
    console.error("[originale/file] read error:", err)
    return new Response("File not available", { status: 500 })
  }

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      "Content-Length": String(buffer.byteLength),
      "Cache-Control": "private, no-store",
    },
  })
}
