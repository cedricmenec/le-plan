'use client'

import { LayoutDashboard, Flag, FolderOpen, History, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const navItems = [
    { href: '/', label: 'Missions', icon: Flag },
    { href: '/projects', label: 'Projects', icon: FolderOpen },
    { href: '#', label: 'History', icon: History, disabled: true },
    { href: '#', label: 'Settings', icon: Settings, disabled: true },
  ]

  return (
    <aside className="w-64 bg-white dark:bg-[#15202b] border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col flex-shrink-0 z-20">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-white">Le Plan</h1>
            <p className="text-slate-400 text-xs font-normal">Peaceful Efficiency</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          
          return (
            <Link 
              key={item.label}
              href={item.href} 
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors",
                active 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
                item.disabled && "cursor-not-allowed opacity-60"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
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