import type { RecentEvent } from '@/lib/analytics-types'

interface RecentEventsProps {
  data: RecentEvent[]
}

const EVENT_COLORS: Record<string, string> = {
  page_view: 'bg-blue-500/20 text-blue-300',
  scroll_depth: 'bg-purple-500/20 text-purple-300',
  click: 'bg-yellow-500/20 text-yellow-300',
  session_end: 'bg-gray-500/20 text-gray-400',
  form_focus: 'bg-cyan-500/20 text-cyan-300',
  form_submit: 'bg-green-500/20 text-green-300',
  purchase: 'bg-orange-500/20 text-orange-300',
  email_sent: 'bg-pink-500/20 text-pink-300',
}

export function RecentEvents({ data }: RecentEventsProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
        Feed de eventos (últimos 50)
      </h2>
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {data.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 py-2 border-b border-gray-800/50 text-sm"
          >
            <span
              className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${EVENT_COLORS[event.event_type] ?? 'bg-gray-700 text-gray-300'}`}
            >
              {event.event_type}
            </span>
            <span className="text-gray-400 text-xs shrink-0 mt-0.5">
              {new Date(event.created_at).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
            <span className="text-gray-500 font-mono text-xs truncate">{event.page ?? ''}</span>
            {Object.keys(event.properties).length > 0 && (
              <span className="text-gray-600 text-xs truncate">
                {JSON.stringify(event.properties)}
              </span>
            )}
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-center text-gray-500 py-4">Sin eventos</p>
        )}
      </div>
    </div>
  )
}
