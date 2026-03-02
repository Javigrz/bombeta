import Link from 'next/link'

interface PageFilterProps {
  pages: string[]
  active: string | null
}

export function PageFilter({ pages, active }: PageFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500 uppercase tracking-wider mr-1">Página:</span>
      <Link
        href="/dashboard"
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          active === null
            ? 'bg-orange-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
      >
        Todas
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={`/dashboard?page=${encodeURIComponent(page)}`}
          className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
            active === page
              ? 'bg-orange-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          {page}
        </Link>
      ))}
    </div>
  )
}
