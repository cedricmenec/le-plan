import { LayoutDashboard, Flag, FolderOpen, ChevronDown, ChevronRight, Hash } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { getProjects, type Project } from '@/lib/db'
import { DataManager } from './data-manager'
import { NetworkStatus } from './network-status'

export function Sidebar() {
  const location = useLocation()
  const pathname = location.pathname
  const [projects, setProjects] = useState<Project[]>([])
  const [isProjectsOpen, setIsProjectsOpen] = useState(true)

  useEffect(() => {
    getProjects().then(data => {
      if (data) setProjects(data)
    })
  }, [])

  useEffect(() => {
    if (pathname.startsWith('/projects/')) {
      setIsProjectsOpen(true)
    }
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || (href !== '/projects' && pathname.startsWith(href))
  }

  const isProjectActive = (projectId: string) => {
    return pathname === `/projects/${projectId}`
  }

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
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <Link 
          to="/projects" 
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors",
            pathname === '/projects'
              ? "bg-primary/10 text-primary" 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <div>
          <button
            onClick={() => setIsProjectsOpen(!isProjectsOpen)}
            className="flex w-full items-center justify-between px-3 py-2.5 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="h-5 w-5" />
              <span>Projects</span>
            </div>
            {isProjectsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {isProjectsOpen && (
            <div className="mt-1 ml-4 space-y-1">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isProjectActive(project.id)
                      ? "bg-primary/10 text-primary"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  <Hash className="h-4 w-4" />
                  <span className="truncate">{project.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link 
          to="/" 
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors",
            isActive('/') 
              ? "bg-primary/10 text-primary" 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
          )}
        >
          <Flag className="h-5 w-5" />
          <span>Missions</span>
        </Link>

        <div className="pt-4 pb-2">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            System
          </div>
          <div className="space-y-1">
            <Link 
              to="#" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-slate-600 dark:text-slate-400 opacity-60 cursor-not-allowed"
              onClick={(e) => e.preventDefault()}
            >
              <Flag className="h-5 w-5" />
              <span>History</span>
            </Link>
            <DataManager />
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <NetworkStatus />
        <p className="text-center text-xs text-slate-400">Local-First Mode</p>
      </div>
    </aside>
  )
}