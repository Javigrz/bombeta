'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

interface PageFilterProps {
  pages: string[]
  active: string | null
}

export function PageFilter({ pages, active }: PageFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setFilter = useCallback(
    (page: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (page) {
        params.set('page', page)
      } else {
        params.delete('page')
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500 uppercase tracking-wider mr-1">Página:</span>
      <button
        onClick={() => setFilter(null)}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          active === null
            ? 'bg-orange-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
      >
        Todas
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setFilter(page)}
          className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
            active === page
              ? 'bg-orange-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  )
}
