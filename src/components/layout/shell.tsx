import { useLocation } from 'react-router-dom'
import { Sidebar } from './sidebar'

export function Shell({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10">
        {children}
      </main>
    </div>
  )
}