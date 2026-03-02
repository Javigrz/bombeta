interface MetricsCardsProps {
  totalSessions: number
  formConversions: number
  purchases: number
  revenue: number
  avgDurationSeconds: number
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-ES').format(n)
}

function fmtDuration(seconds: number) {
  if (seconds < 60) return `${Math.round(seconds)}s`
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`
}

function fmtMoney(n: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)
}

export function MetricsCards({
  totalSessions,
  formConversions,
  purchases,
  revenue,
  avgDurationSeconds,
}: MetricsCardsProps) {
  const formRate = totalSessions > 0 ? ((formConversions / totalSessions) * 100).toFixed(1) : '0'

  const cards = [
    { label: 'Sesiones totales', value: fmt(totalSessions), sub: 'Usuarios únicos' },
    { label: 'Conversiones form', value: `${formRate}%`, sub: `${fmt(formConversions)} envíos` },
    { label: 'Compras · Revenue', value: fmtMoney(revenue), sub: `${fmt(purchases)} compras` },
    { label: 'Duración media', value: fmtDuration(avgDurationSeconds), sub: 'Por sesión' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{card.label}</p>
          <p className="text-3xl font-bold text-white">{card.value}</p>
          <p className="text-sm text-gray-500 mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  )
}
