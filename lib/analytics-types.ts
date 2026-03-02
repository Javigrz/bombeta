export type EventType =
  | 'page_view'
  | 'scroll_depth'
  | 'click'
  | 'session_end'
  | 'form_focus'
  | 'form_submit'
  | 'purchase'
  | 'email_sent'

export interface TrackPayload {
  sessionId: string
  eventType: EventType
  page: string
  properties?: Record<string, unknown>
  // Session info (only on first event or page_view)
  landingPage?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  abVariant?: string
}

export interface Session {
  id: string
  created_at: string
  last_seen_at: string
  landing_page: string | null
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  country: string | null
  city: string | null
  device: string | null
  user_agent: string | null
  converted_form: boolean
  converted_purchase: boolean
  converted_product: string | null
  ab_variant: string | null
}

export interface Event {
  id: number
  session_id: string
  created_at: string
  event_type: EventType
  page: string | null
  properties: Record<string, unknown>
}

// Dashboard query result types
export interface DailySessionCount {
  date: string
  count: number
}

export interface FunnelStep {
  step: string
  count: number
}

export interface ScrollDepthData {
  depth: number
  count: number
  pct: number
}

export interface TopPage {
  page: string
  views: number
  avg_scroll: number | null
}

export interface UtmRow {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  sessions: number
  conversions: number
  rate: number
}

export interface PurchaseRow {
  created_at: string
  email: string | null
  product: string | null
  amount: number | null
}

export interface RecentEvent {
  id: number
  created_at: string
  event_type: string
  page: string | null
  properties: Record<string, unknown>
  session_id: string
}
