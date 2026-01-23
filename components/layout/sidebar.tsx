'use client'

import { LayoutDashboard, Flag, FolderOpen, History, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Sidebar() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <aside className="w-64 bg-white dark:bg-[#15202b] border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col flex-shrink-0 z-20">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-white">Workload</h1>
            <p className="text-slate-400 text-xs font-normal">Productivity Tool</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium group transition-colors"
        >
          <Flag className="h-5 w-5" />
          <span>Missions</span>
        </Link>
        <Link 
          href="/projects" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors"
        >
          <FolderOpen className="h-5 w-5" />
          <span>Projects</span>
        </Link>
        <Link 
          href="#" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors cursor-not-allowed opacity-60"
        >
          <History className="h-5 w-5" />
          <span>History</span>
        </Link>
        <Link 
          href="#" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors cursor-not-allowed opacity-60"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </aside>
  )
}