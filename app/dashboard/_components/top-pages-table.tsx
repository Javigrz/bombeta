import type { TopPage } from '@/lib/analytics-types'

interface TopPagesTableProps {
  data: TopPage[]
}

export function TopPagesTable({ data }: TopPagesTableProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
        Top páginas
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-800">
            <th className="pb-2 font-medium">Página</th>
            <th className="pb-2 font-medium text-right">Vistas</th>
            <th className="pb-2 font-medium text-right">Scroll medio</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.page} className="border-b border-gray-800/50 hover:bg-gray-800/30">
              <td className="py-2 text-white font-mono text-xs">{row.page}</td>
              <td className="py-2 text-right text-gray-300">{Number(row.views).toLocaleString()}</td>
              <td className="py-2 text-right text-gray-300">
                {row.avg_scroll != null ? `${Math.round(Number(row.avg_scroll))}%` : '-'}
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={3} className="py-4 text-center text-gray-500">Sin datos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
