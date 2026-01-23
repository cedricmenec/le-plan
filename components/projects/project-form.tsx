'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
]

interface ProjectFormProps {
  initialData?: {
    name: string
    label?: string | null
    description?: string | null
    color: string
    status: 'active' | 'archived'
  }
  onSubmit: (data: any) => void
  loading?: boolean
  buttonText?: string
}

export function ProjectForm({ initialData, onSubmit, loading, buttonText }: ProjectFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [label, setLabel] = useState(initialData?.label || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [color, setColor] = useState(initialData?.color || COLORS[0])
  const [status, setStatus] = useState(initialData?.status || 'active')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, label, description, color, status })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du projet</Label>
        <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Ex: Refonte Site Web" 
            required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Label (Optionnel)</Label>
        <Input 
            id="label" 
            value={label || ''} 
            onChange={(e) => setLabel(e.target.value)} 
            placeholder="Ex: MKTG-2024" 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optionnelle)</Label>
        <Input 
            id="description" 
            value={description || ''} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Détails du projet..." 
        />
      </div>

      <div className="space-y-2">
        <Label>Couleur</Label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center",
                color === c ? "border-slate-900 scale-110" : "border-transparent hover:scale-105"
              )}
              style={{ backgroundColor: c }}
              title={`Sélectionner la couleur ${c}`}
              aria-label={`Sélectionner la couleur ${c}`}
            >
              {color === c && <Check className="h-4 w-4 text-white" />}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Chargement...' : (buttonText || 'Enregistrer')}
      </Button>
    </form>
  )
}
