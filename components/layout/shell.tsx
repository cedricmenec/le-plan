'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from './sidebar'

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // const isLoginPage = pathname === '/login' // Simple check
  // Better to check if it STARTS with /login just in case, but exact match is fine for now based on project structure.
  const isLoginPage = pathname?.startsWith('/login')

  if (isLoginPage) {
    return <main className="h-screen w-screen overflow-auto">{children}</main>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10">
        {children}
      </main>
    </div>
  )
}
