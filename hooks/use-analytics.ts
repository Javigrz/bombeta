import { useAnalyticsContext } from '@/contexts/analytics-provider'

export function useAnalytics() {
  return useAnalyticsContext()
}
