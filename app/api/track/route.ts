import { NextRequest, NextResponse } from 'next/server'
import { upsertSession, insertEvent } from '@/lib/analytics-db'
import type { TrackPayload } from '@/lib/analytics-types'

function detectDevice(ua: string): string {
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return 'mobile'
  if (/tablet|ipad/i.test(ua)) return 'tablet'
  return 'desktop'
}

export async function POST(req: NextRequest) {
  try {
    const payload: TrackPayload = await req.json()

    if (!payload.sessionId || !payload.eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const userAgent = req.headers.get('user-agent') ?? ''
    const country = req.headers.get('x-vercel-ip-country') ?? undefined
    const city = req.headers.get('x-vercel-ip-city') ?? undefined
    const device = detectDevice(userAgent)

    await upsertSession(payload, { country, city, device, userAgent })
    await insertEvent(
      payload.sessionId,
      payload.eventType,
      payload.page,
      payload.properties ?? {}
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/track]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
