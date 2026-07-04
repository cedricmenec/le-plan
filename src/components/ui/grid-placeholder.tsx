interface GridPlaceholderProps {
  label?: string
}

export function GridPlaceholder({ label = 'Grid placeholder' }: GridPlaceholderProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-slate-100 dark:border-slate-900/50 bg-transparent min-h-[200px] h-full transition-colors hover:border-slate-200 dark:hover:border-slate-800"
    >
      <span className="text-[13px] font-medium text-slate-300 dark:text-slate-600 italic px-8 text-center leading-relaxed">
        {label}
      </span>
    </div>
  )
}