'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ScrollDepthData } from '@/lib/analytics-types'

interface ScrollDepthChartProps {
  data: ScrollDepthData[]
}

export function ScrollDepthChart({ data }: ScrollDepthChartProps) {
  const formatted = data.map((d) => ({
    depth: `${d.depth}%`,
    pct: Number(d.pct),
    usuarios: Number(d.count),
  }))

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
        Profundidad de scroll
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="depth" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', color: '#fff' }}
            formatter={(v: number) => [`${v}%`, '% sesiones']}
          />
          <Bar dataKey="pct" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
