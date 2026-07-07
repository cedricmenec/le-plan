import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { ConfidenceLevel } from '@/lib/db'
import { cn } from '@/lib/utils'

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = { 1: 'Très faible', 2: 'Faible', 3: 'Moyen', 4: 'Haute', 5: 'Très haute' }
const HELP: Record<ConfidenceLevel, string> = {
  1: "L'estimation est encore très incertaine.", 2: 'Quelques éléments sont connus, plusieurs inconnues subsistent.',
  3: "L'estimation repose sur une compréhension raisonnable.", 4: "L'essentiel est maîtrisé, avec peu de risques identifiés.",
  5: "L'estimation est fondée sur des éléments éprouvés.",
}
export const ESTIMATION_PRESETS = [['XS', 0.5], ['S', 2], ['M', 5], ['L', 15], ['XL', 45], ['XXL', 100]] as const

export function ConfidenceSelect({ value, onChange, showTooltip = true, disabled = false }: {
  value: ConfidenceLevel | null; onChange: (value: ConfidenceLevel) => void; showTooltip?: boolean; disabled?: boolean
}) {
  return <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Niveau de confiance">
    {([1, 2, 3, 4, 5] as ConfidenceLevel[]).map(level => {
      const button = <button type="button" role="radio" aria-checked={value === level} aria-label={`${level}/5 — ${CONFIDENCE_LABELS[level]}`}
        disabled={disabled} onClick={() => onChange(level)} className={cn('h-8 w-8 rounded-full border-2 text-xs font-bold transition-colors disabled:opacity-50',
          level <= (value ?? 0) ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-transparent text-slate-500')}>{level}</button>
      return showTooltip ? <Tooltip key={level}><TooltipTrigger asChild>{button}</TooltipTrigger><TooltipContent><p className="font-semibold">{CONFIDENCE_LABELS[level]}</p><p className="max-w-56 text-xs">{HELP[level]}</p></TooltipContent></Tooltip> : <span key={level}>{button}</span>
    })}
    {value && <span className="ml-1 text-sm text-slate-600 dark:text-slate-300">{CONFIDENCE_LABELS[value]}</span>}
  </div>
}
