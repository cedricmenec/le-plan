import { Button } from '@/components/ui/button'
import { Filter, Plus, Flag } from 'lucide-react'

export function DashboardHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 text-slate-500 mb-1">
          <Flag className="h-4 w-4" />
          <span className="text-xs font-semibold tracking-wider uppercase">Overview</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Active Missions</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track progress and manage your active workload.</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2">
          <Filter className="h-5 w-5" />
          Filter
        </Button>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          Quick Add Mission
        </Button>
      </div>
    </header>
  )
}