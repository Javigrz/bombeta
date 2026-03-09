import { sql } from '@vercel/postgres'
import type {
  TrackPayload,
  DailySessionCount,
  FunnelStep,
  ScrollDepthData,
  TopPage,
  UtmRow,
  PurchaseRow,
  RecentEvent,
  EventType,
} from './analytics-types'

export async function upsertSession(
  payload: TrackPayload,
  extra: {
    country?: string
    city?: string
    device?: string
    userAgent?: string
  }
) {
  await sql`
    INSERT INTO sessions (
      id, landing_page, referrer,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      country, city, device, user_agent, ab_variant
    ) VALUES (
      ${payload.sessionId},
      ${payload.landingPage ?? null},
      ${payload.referrer ?? null},
      ${payload.utmSource ?? null},
      ${payload.utmMedium ?? null},
      ${payload.utmCampaign ?? null},
      ${payload.utmContent ?? null},
      ${payload.utmTerm ?? null},
      ${extra.country ?? null},
      ${extra.city ?? null},
      ${extra.device ?? null},
      ${extra.userAgent ?? null},
      ${payload.abVariant ?? null}
    )
    ON CONFLICT (id) DO UPDATE SET
      last_seen_at = NOW(),
      country = COALESCE(sessions.country, EXCLUDED.country),
      city = COALESCE(sessions.city, EXCLUDED.city),
      device = COALESCE(sessions.device, EXCLUDED.device),
      user_agent = COALESCE(sessions.user_agent, EXCLUDED.user_agent)
  `
}

export async function insertEvent(
  sessionId: string,
  eventType: EventType,
  page: string,
  properties: Record<string, unknown> = {}
) {
  await sql`
    INSERT INTO events (session_id, event_type, page, properties)
    VALUES (
      ${sessionId},
      ${eventType},
      ${page},
      ${JSON.stringify(properties)}::jsonb
    )
  `
}

export async function markFormConversion(sessionId: string) {
  await sql`
    UPDATE sessions SET converted_form = TRUE WHERE id = ${sessionId}
  `
}

export async function markPurchaseConversion(
  sessionId: string,
  product: string
) {
  await sql`
    UPDATE sessions SET
      converted_purchase = TRUE,
      converted_product = ${product}
    WHERE id = ${sessionId}
  `
}

export async function trackServerEvent(
  sessionId: string | null,
  eventType: EventType,
  page: string,
  properties: Record<string, unknown> = {}
) {
  if (!sessionId) return

  try {
    await sql`
      INSERT INTO sessions (id) VALUES (${sessionId})
      ON CONFLICT (id) DO UPDATE SET last_seen_at = NOW()
    `
    await insertEvent(sessionId, eventType, page, properties)

    if (eventType === 'form_submit') {
      await markFormConversion(sessionId)
    }
    if (eventType === 'purchase') {
      const product = (properties.product as string) ?? ''
      await markPurchaseConversion(sessionId, product)
    }
  } catch (err) {
    console.error('[analytics] trackServerEvent error:', err)
  }
}

// ─── Dashboard queries ──────────────────────────────────────────────────────
// pageFilter: null = todas las páginas, string = solo esa página

export async function getAvailablePages(): Promise<string[]> {
  const result = await sql`
    SELECT page, COUNT(*) AS views
    FROM events
    WHERE event_type = 'page_view' AND page IS NOT NULL
    GROUP BY page
    ORDER BY views DESC
    LIMIT 30
  `
  return result.rows.map((r) => r.page as string)
}

export async function getKpis(pageFilter: string | null = null) {
  const p = pageFilter

  const [sessions, formConversions, purchases, avgDuration] = await Promise.all([
    // Sesiones que visitaron la página (o todas si no hay filtro)
    p
      ? sql`
          SELECT COUNT(DISTINCT session_id) AS total
          FROM events
          WHERE event_type = 'page_view' AND page = ${p}
        `
      : sql`SELECT COUNT(*) AS total FROM sessions`,

    // Conversiones form - de las sesiones que visitaron la página
    p
      ? sql`
          SELECT COUNT(DISTINCT e.session_id) AS total
          FROM events e
          JOIN sessions s ON e.session_id = s.id
          WHERE e.page = ${p} AND s.converted_form = TRUE
        `
      : sql`SELECT COUNT(*) AS total FROM sessions WHERE converted_form = TRUE`,

    // Compras - globales siempre (las compras no tienen página de origen fiable)
    sql`
      SELECT
        COUNT(*) AS total,
        SUM((properties->>'amount')::numeric) AS revenue
      FROM events
      WHERE event_type = 'purchase'
    `,

    // Duración media - sesiones que visitaron la página
    p
      ? sql`
          SELECT AVG(EXTRACT(EPOCH FROM (s.last_seen_at - s.created_at))) AS avg_seconds
          FROM sessions s
          WHERE s.last_seen_at > s.created_at
            AND EXISTS (
              SELECT 1 FROM events e
              WHERE e.session_id = s.id AND e.page = ${p}
            )
        `
      : sql`
          SELECT AVG(EXTRACT(EPOCH FROM (last_seen_at - created_at))) AS avg_seconds
          FROM sessions
          WHERE last_seen_at > created_at
        `,
  ])

  return {
    totalSessions: Number(sessions.rows[0]?.total ?? 0),
    formConversions: Number(formConversions.rows[0]?.total ?? 0),
    purchases: Number(purchases.rows[0]?.total ?? 0),
    revenue: Number(purchases.rows[0]?.revenue ?? 0),
    avgDurationSeconds: Number(avgDuration.rows[0]?.avg_seconds ?? 0),
  }
}

export async function getDailySessions(
  pageFilter: string | null = null,
  days = 30
): Promise<DailySessionCount[]> {
  const p = pageFilter

  const result = p
    ? await sql`
        SELECT
          DATE(created_at) AS date,
          COUNT(DISTINCT session_id) AS count
        FROM events
        WHERE event_type = 'page_view'
          AND page = ${p}
          AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `
    : await sql`
        SELECT
          DATE(created_at) AS date,
          COUNT(*) AS count
        FROM sessions
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `

  return result.rows as DailySessionCount[]
}

export async function getFunnel(pageFilter: string | null = null): Promise<FunnelStep[]> {
  const p = pageFilter

  const result = p
    ? await sql`
        SELECT step, count FROM (
          VALUES
            ('page_view',   (SELECT COUNT(DISTINCT session_id) FROM events WHERE event_type = 'page_view' AND page = ${p})),
            ('form_focus',  (SELECT COUNT(DISTINCT e.session_id) FROM events e WHERE e.event_type = 'form_focus' AND EXISTS (SELECT 1 FROM events e2 WHERE e2.session_id = e.session_id AND e2.page = ${p}))),
            ('form_submit', (SELECT COUNT(DISTINCT e.session_id) FROM events e JOIN sessions s ON e.session_id = s.id WHERE s.converted_form = TRUE AND EXISTS (SELECT 1 FROM events e2 WHERE e2.session_id = e.session_id AND e2.page = ${p}))),
            ('purchase',    (SELECT COUNT(DISTINCT e.session_id) FROM events e JOIN sessions s ON e.session_id = s.id WHERE s.converted_purchase = TRUE AND EXISTS (SELECT 1 FROM events e2 WHERE e2.session_id = e.session_id AND e2.page = ${p})))
        ) AS t(step, count)
      `
    : await sql`
        SELECT step, count FROM (
          VALUES
            ('page_view',    (SELECT COUNT(DISTINCT session_id) FROM events WHERE event_type = 'page_view')),
            ('form_focus',   (SELECT COUNT(DISTINCT session_id) FROM events WHERE event_type = 'form_focus')),
            ('form_submit',  (SELECT COUNT(*) FROM sessions WHERE converted_form = TRUE)),
            ('purchase',     (SELECT COUNT(*) FROM sessions WHERE converted_purchase = TRUE))
        ) AS t(step, count)
      `

  return result.rows as FunnelStep[]
}

export async function getScrollDepth(pageFilter: string | null = null): Promise<ScrollDepthData[]> {
  const p = pageFilter

  const result = p
    ? await sql`
        WITH depths AS (
          SELECT
            (properties->>'depth')::int AS depth,
            COUNT(DISTINCT session_id) AS sessions
          FROM events
          WHERE event_type = 'scroll_depth'
            AND page = ${p}
            AND properties->>'depth' IS NOT NULL
          GROUP BY depth
        ),
        total AS (
          SELECT COUNT(DISTINCT session_id) AS n
          FROM events
          WHERE event_type = 'page_view' AND page = ${p}
        )
        SELECT
          d.depth,
          d.sessions AS count,
          ROUND(d.sessions::numeric / NULLIF(t.n, 0) * 100, 1) AS pct
        FROM depths d, total t
        ORDER BY depth ASC
      `
    : await sql`
        WITH depths AS (
          SELECT
            (properties->>'depth')::int AS depth,
            COUNT(DISTINCT session_id) AS sessions
          FROM events
          WHERE event_type = 'scroll_depth'
            AND properties->>'depth' IS NOT NULL
          GROUP BY depth
        ),
        total AS (SELECT COUNT(DISTINCT session_id) AS n FROM events WHERE event_type = 'page_view')
        SELECT
          d.depth,
          d.sessions AS count,
          ROUND(d.sessions::numeric / NULLIF(t.n, 0) * 100, 1) AS pct
        FROM depths d, total t
        ORDER BY depth ASC
      `

  return result.rows as ScrollDepthData[]
}

export async function getTopPages(): Promise<TopPage[]> {
  const result = await sql`
    SELECT
      page,
      COUNT(*) AS views,
      AVG((properties->>'depth')::numeric) AS avg_scroll
    FROM events
    WHERE event_type = 'page_view'
      AND page IS NOT NULL
    GROUP BY page
    ORDER BY views DESC
    LIMIT 20
  `
  return result.rows as TopPage[]
}

export async function getUtmStats(pageFilter: string | null = null): Promise<UtmRow[]> {
  const p = pageFilter

  const result = p
    ? await sql`
        SELECT
          s.utm_source,
          s.utm_medium,
          s.utm_campaign,
          COUNT(*) AS sessions,
          SUM(CASE WHEN s.converted_form THEN 1 ELSE 0 END) AS conversions,
          ROUND(
            SUM(CASE WHEN s.converted_form THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0) * 100,
            1
          ) AS rate
        FROM sessions s
        WHERE EXISTS (
          SELECT 1 FROM events e WHERE e.session_id = s.id AND e.page = ${p}
        )
        GROUP BY s.utm_source, s.utm_medium, s.utm_campaign
        ORDER BY sessions DESC
        LIMIT 20
      `
    : await sql`
        SELECT
          utm_source,
          utm_medium,
          utm_campaign,
          COUNT(*) AS sessions,
          SUM(CASE WHEN converted_form THEN 1 ELSE 0 END) AS conversions,
          ROUND(
            SUM(CASE WHEN converted_form THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0) * 100,
            1
          ) AS rate
        FROM sessions
        GROUP BY utm_source, utm_medium, utm_campaign
        ORDER BY sessions DESC
        LIMIT 20
      `

  return result.rows as UtmRow[]
}

export async function getRecentPurchases(): Promise<PurchaseRow[]> {
  const result = await sql`
    SELECT
      e.created_at,
      e.properties->>'email' AS email,
      e.properties->>'product' AS product,
      (e.properties->>'amount')::numeric AS amount
    FROM events e
    WHERE e.event_type = 'purchase'
    ORDER BY e.created_at DESC
    LIMIT 20
  `
  return result.rows as PurchaseRow[]
}

export async function getRecentEvents(pageFilter: string | null = null): Promise<RecentEvent[]> {
  const p = pageFilter

  const result = p
    ? await sql`
        SELECT id, created_at, event_type, page, properties, session_id
        FROM events
        WHERE page = ${p}
        ORDER BY created_at DESC
        LIMIT 50
      `
    : await sql`
        SELECT id, created_at, event_type, page, properties, session_id
        FROM events
        ORDER BY created_at DESC
        LIMIT 50
      `

  return result.rows as RecentEvent[]
}
