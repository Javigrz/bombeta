import type { PurchaseRow } from '@/lib/analytics-types'

interface PurchasesTableProps {
  data: PurchaseRow[]
}

export function PurchasesTable({ data }: PurchasesTableProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
        Compras recientes
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-800">
            <th className="pb-2 font-medium">Fecha</th>
            <th className="pb-2 font-medium">Email</th>
            <th className="pb-2 font-medium">Producto</th>
            <th className="pb-2 font-medium text-right">Importe</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
              <td className="py-2 text-gray-400 text-xs">
                {new Date(row.created_at).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="py-2 text-white">{row.email ?? '—'}</td>
              <td className="py-2 text-gray-300">{row.product ?? '—'}</td>
              <td className="py-2 text-right text-green-400 font-medium">
                {row.amount != null
                  ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(row.amount))
                  : '—'}
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-center text-gray-500">Sin compras</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
