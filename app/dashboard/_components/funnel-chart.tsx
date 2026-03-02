'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { FunnelStep } from '@/lib/analytics-types'

const STEP_LABELS: Record<string, string> = {
  page_view: 'Visitas',
  form_focus: 'Form Start',
  form_submit: 'Form Submit',
  purchase: 'Compra',
}

interface FunnelChartProps {
  data: FunnelStep[]
}

export function FunnelChart({ data }: FunnelChartProps) {
  const formatted = data.map((d) => ({
    step: STEP_LABELS[d.step] ?? d.step,
    count: Number(d.count),
  }))

  const max = formatted[0]?.count ?? 1

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
        Funnel de conversión
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={formatted} layout="vertical">
          <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="step"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            width={90}
          />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', color: '#fff' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {formatted.map((entry, index) => (
              <Cell
                key={index}
                fill={`hsl(${25 - index * 5}, ${90 - index * 10}%, ${55 - index * 5}%)`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {/* Conversion rates */}
      <div className="mt-4 flex flex-wrap gap-3">
        {formatted.map((step, i) => {
          const rate = i === 0 ? 100 : Math.round((step.count / max) * 100)
          return (
            <span key={step.step} className="text-xs text-gray-400">
              {step.step}: <span className="text-white font-medium">{rate}%</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
