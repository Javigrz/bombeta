import type { ReactNode } from 'react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="font-semibold text-lg">Analytics Dashboard</h1>
        <Link
          href="/api/admin/logout"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Cerrar sesión
        </Link>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
