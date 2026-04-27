import { sql } from '@vercel/postgres'

/**
 * SQL schema (run once in Vercel Postgres console):
 *
 *   CREATE TABLE IF NOT EXISTS unsubscribed_emails (
 *     email       TEXT PRIMARY KEY,
 *     created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *     reason      TEXT
 *   );
 *
 * The table stores normalized (lowercased, trimmed) email addresses.
 */

const UNSUBSCRIBE_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://javiggil.com'

const UNSUBSCRIBE_MAILBOX = 'unsubscribe@javiggil.com'

function normalize(email: string): string {
  return email.trim().toLowerCase()
}

export function getUnsubscribeHeaders(email: string): Record<string, string> {
  const encoded = encodeURIComponent(normalize(email))
  return {
    'List-Unsubscribe': `<mailto:${UNSUBSCRIBE_MAILBOX}?subject=unsubscribe>, <${UNSUBSCRIBE_BASE_URL}/api/unsubscribe?email=${encoded}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}

export function getUnsubscribeUrl(email: string): string {
  return `${UNSUBSCRIBE_BASE_URL}/api/unsubscribe?email=${encodeURIComponent(normalize(email))}`
}

export async function isUnsubscribed(email: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT 1 FROM unsubscribed_emails WHERE email = ${normalize(email)} LIMIT 1
    `
    return result.rows.length > 0
  } catch (err) {
    console.error('[unsubscribe] isUnsubscribed error:', err)
    return false
  }
}

export async function markUnsubscribed(email: string, reason?: string): Promise<void> {
  await sql`
    INSERT INTO unsubscribed_emails (email, reason)
    VALUES (${normalize(email)}, ${reason ?? null})
    ON CONFLICT (email) DO NOTHING
  `
}

// Re-opt-in: borra la baja al haber acción afirmativa del usuario (formulario
// o compra). Best-effort — los errores se loguean y se ignoran para no romper
// el flujo principal.
export async function resubscribe(email: string): Promise<void> {
  try {
    await sql`DELETE FROM unsubscribed_emails WHERE email = ${normalize(email)}`
  } catch (err) {
    console.error('[unsubscribe] resubscribe error:', err)
  }
}

export const SYSTEM_FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
