'use client'

interface GridPlaceholderProps {
  label?: string
}

export function GridPlaceholder({ label = 'Grid placeholder' }: GridPlaceholderProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-transparent min-h-[200px] h-full transition-colors hover:border-slate-300 dark:hover:border-slate-700"
    >
      <span className="text-sm font-medium text-slate-400 dark:text-slate-500 italic">
        {label}
      </span>
    </div>
  )
}
