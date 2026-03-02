import {
  getKpis,
  getDailySessions,
  getFunnel,
  getScrollDepth,
  getTopPages,
  getUtmStats,
  getRecentPurchases,
  getRecentEvents,
  getAvailablePages,
} from '@/lib/analytics-db'
import { MetricsCards } from './_components/metrics-cards'
import { SessionsChart } from './_components/sessions-chart'
import { FunnelChart } from './_components/funnel-chart'
import { ScrollDepthChart } from './_components/scroll-depth-chart'
import { TopPagesTable } from './_components/top-pages-table'
import { UtmTable } from './_components/utm-table'
import { PurchasesTable } from './_components/purchases-table'
import { RecentEvents } from './_components/recent-events'
import { PageFilter } from './_components/page-filter'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams
  const pageFilter = params.page ?? null

  const [
    kpis,
    dailySessions,
    funnel,
    scrollDepth,
    topPages,
    utmStats,
    purchases,
    recentEvents,
    availablePages,
  ] = await Promise.all([
    getKpis(pageFilter),
    getDailySessions(pageFilter),
    getFunnel(pageFilter),
    getScrollDepth(pageFilter),
    getTopPages(),
    getUtmStats(pageFilter),
    getRecentPurchases(),
    getRecentEvents(pageFilter),
    getAvailablePages(),
  ])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Filtro de página */}
      <div className="bg-gray-900 rounded-xl px-5 py-3 border border-gray-800">
        <PageFilter pages={availablePages} active={pageFilter} />
      </div>

      {pageFilter && (
        <p className="text-sm text-gray-400">
          Filtrando por página:{' '}
          <span className="text-orange-400 font-mono">{pageFilter}</span>
        </p>
      )}

      <MetricsCards
        totalSessions={kpis.totalSessions}
        formConversions={kpis.formConversions}
        purchases={kpis.purchases}
        revenue={kpis.revenue}
        avgDurationSeconds={kpis.avgDurationSeconds}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SessionsChart data={dailySessions} />
        <FunnelChart data={funnel} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScrollDepthChart data={scrollDepth} />
        <TopPagesTable data={topPages} />
      </div>

      <UtmTable data={utmStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PurchasesTable data={purchases} />
        <RecentEvents data={recentEvents} />
      </div>
    </div>
  )
}
