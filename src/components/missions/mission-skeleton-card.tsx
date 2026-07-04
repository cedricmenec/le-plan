export function MissionSkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#15202b] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between animate-pulse">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0" />
            <div className="h-5 w-16 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-4 w-4 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-6 w-12 rounded-md bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-4 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>

        <div className="mb-4">
          <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-800 mb-2" />
          <div className="h-5 w-48 rounded bg-slate-100 dark:bg-slate-800 mb-2" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-auto">
        <div className="pt-3 flex justify-between items-center border-t border-slate-50 dark:border-slate-800/50 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  )
}