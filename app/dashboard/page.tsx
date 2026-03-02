import {
  getKpis,
  getDailySessions,
  getFunnel,
  getScrollDepth,
  getTopPages,
  getUtmStats,
  getRecentPurchases,
  getRecentEvents,
} from '@/lib/analytics-db'
import { MetricsCards } from './_components/metrics-cards'
import { SessionsChart } from './_components/sessions-chart'
import { FunnelChart } from './_components/funnel-chart'
import { ScrollDepthChart } from './_components/scroll-depth-chart'
import { TopPagesTable } from './_components/top-pages-table'
import { UtmTable } from './_components/utm-table'
import { PurchasesTable } from './_components/purchases-table'
import { RecentEvents } from './_components/recent-events'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const [kpis, dailySessions, funnel, scrollDepth, topPages, utmStats, purchases, recentEvents] =
    await Promise.all([
      getKpis(),
      getDailySessions(),
      getFunnel(),
      getScrollDepth(),
      getTopPages(),
      getUtmStats(),
      getRecentPurchases(),
      getRecentEvents(),
    ])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
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
