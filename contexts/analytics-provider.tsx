'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react'
import { nanoid } from 'nanoid'
import type { EventType, TrackPayload } from '@/lib/analytics-types'

const SESSION_KEY = 'analytics_session_id'
const SESSION_TS_KEY = 'analytics_session_ts'
const SESSION_TTL_MS = 30 * 60 * 1000 // 30 min inactivity

interface AnalyticsContextValue {
  track: (eventType: EventType, properties?: Record<string, unknown>) => void
}

const AnalyticsContext = createContext<AnalyticsContextValue>({
  track: () => {},
})

export function useAnalyticsContext() {
  return useContext(AnalyticsContext)
}

function getOrCreateSession(): string {
  if (typeof window === 'undefined') return ''

  const now = Date.now()
  const existing = localStorage.getItem(SESSION_KEY)
  const ts = Number(localStorage.getItem(SESSION_TS_KEY) ?? 0)

  if (existing && now - ts < SESSION_TTL_MS) {
    localStorage.setItem(SESSION_TS_KEY, String(now))
    return existing
  }

  // New session
  const id = nanoid()
  localStorage.setItem(SESSION_KEY, id)
  localStorage.setItem(SESSION_TS_KEY, String(now))
  return id
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search)
  return {
    utmSource: params.get('utm_source') ?? undefined,
    utmMedium: params.get('utm_medium') ?? undefined,
    utmCampaign: params.get('utm_campaign') ?? undefined,
    utmContent: params.get('utm_content') ?? undefined,
    utmTerm: params.get('utm_term') ?? undefined,
  }
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const sessionIdRef = useRef<string>('')
  const [initialized, setInitialized] = useState(false)
  const scrollMilestonesHit = useRef<Set<number>>(new Set())
  const maxScrollRef = useRef(0)

  const sendEvent = useCallback(
    (payload: TrackPayload) => {
      if (!payload.sessionId) return
      navigator.sendBeacon
        ? navigator.sendBeacon('/api/track', JSON.stringify(payload))
        : fetch('/api/track', {
            method: 'POST',
            body: JSON.stringify(payload),
            keepalive: true,
          }).catch(() => {})
    },
    []
  )

  const track = useCallback(
    (eventType: EventType, properties: Record<string, unknown> = {}) => {
      const sid = sessionIdRef.current
      if (!sid) return
      const payload: TrackPayload = {
        sessionId: sid,
        eventType,
        page: window.location.pathname,
        properties,
      }
      sendEvent(payload)
      // Update inactivity timestamp
      localStorage.setItem(SESSION_TS_KEY, String(Date.now()))
    },
    [sendEvent]
  )

  // Initialize session + track first page_view
  useEffect(() => {
    const sid = getOrCreateSession()
    sessionIdRef.current = sid

    const utms = getUtmParams()
    const isNewSession =
      Date.now() - Number(localStorage.getItem(SESSION_TS_KEY) ?? 0) > SESSION_TTL_MS - 1000

    const payload: TrackPayload = {
      sessionId: sid,
      eventType: 'page_view',
      page: window.location.pathname,
      landingPage: window.location.pathname,
      referrer: document.referrer || undefined,
      ...utms,
    }
    sendEvent(payload)
    setInitialized(true)

    // Reset scroll milestones on new page
    scrollMilestonesHit.current = new Set()
    maxScrollRef.current = 0

    return () => {
      // session_end on unmount (page leave) is handled by beforeunload
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scroll depth tracking
  useEffect(() => {
    if (!initialized) return

    const MILESTONES = [25, 50, 75, 90, 100]
    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const scrolled = window.scrollY + window.innerHeight
        const total = document.documentElement.scrollHeight
        const pct = Math.round((scrolled / total) * 100)

        if (pct > maxScrollRef.current) {
          maxScrollRef.current = pct
        }

        for (const milestone of MILESTONES) {
          if (pct >= milestone && !scrollMilestonesHit.current.has(milestone)) {
            scrollMilestonesHit.current.add(milestone)
            track('scroll_depth', { depth: milestone })
          }
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [initialized, track])

  // Click tracking via event delegation
  useEffect(() => {
    if (!initialized) return

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const el = target.closest('a, button, [data-track]') as HTMLElement | null
      if (!el) return

      track('click', {
        tag: el.tagName.toLowerCase(),
        text: el.textContent?.trim().slice(0, 100) ?? '',
        href: el instanceof HTMLAnchorElement ? el.href : undefined,
        id: el.id || undefined,
        dataTrack: el.dataset.track,
      })
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [initialized, track])

  // Session end via beforeunload + sendBeacon
  useEffect(() => {
    if (!initialized) return

    function onUnload() {
      const sid = sessionIdRef.current
      if (!sid) return
      const payload: TrackPayload = {
        sessionId: sid,
        eventType: 'session_end',
        page: window.location.pathname,
        properties: { maxScroll: maxScrollRef.current },
      }
      navigator.sendBeacon('/api/track', JSON.stringify(payload))
    }

    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [initialized])

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
    </AnalyticsContext.Provider>
  )
}
