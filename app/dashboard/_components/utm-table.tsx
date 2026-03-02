import type { UtmRow } from '@/lib/analytics-types'

interface UtmTableProps {
  data: UtmRow[]
}

export function UtmTable({ data }: UtmTableProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
        Fuentes de tráfico
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-800">
            <th className="pb-2 font-medium">Fuente</th>
            <th className="pb-2 font-medium">Medium</th>
            <th className="pb-2 font-medium">Campaña</th>
            <th className="pb-2 font-medium text-right">Sesiones</th>
            <th className="pb-2 font-medium text-right">Conv. %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
              <td className="py-2 text-white">{row.utm_source ?? '(directo)'}</td>
              <td className="py-2 text-gray-400">{row.utm_medium ?? '—'}</td>
              <td className="py-2 text-gray-400 text-xs font-mono">{row.utm_campaign ?? '—'}</td>
              <td className="py-2 text-right text-gray-300">{Number(row.sessions).toLocaleString()}</td>
              <td className="py-2 text-right">
                <span className={Number(row.rate) > 0 ? 'text-green-400' : 'text-gray-500'}>
                  {Number(row.rate).toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-500">Sin datos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
