'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

interface Option {
  label: string
  value: string
}

interface InlineEditableFieldProps {
  value: string | number | null
  onSave: (value: any) => Promise<void>
  type?: 'text' | 'textarea' | 'select' | 'number'
  options?: Option[]
  className?: string
  displayClassName?: string
  placeholder?: string
  trigger?: 'click' | 'doubleClick'
  isExternalPending?: boolean
}

export function InlineEditableField({
  value,
  onSave,
  type = 'text',
  options,
  className,
  displayClassName,
  placeholder = 'Cliquer pour éditer...',
  trigger = 'click',
  isExternalPending = false
}: InlineEditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(value ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    setCurrentValue(value ?? '')
  }, [value])

  const handleSave = async () => {
    if (currentValue === value) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(currentValue)
      setIsEditing(false)
      toast({
        title: "Modifié",
        description: "La modification a été enregistrée.",
        duration: 2000,
      })
    } catch (error) {
      console.error('Error saving field:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la modification.",
        variant: "destructive",
      })
      setCurrentValue(value ?? '')
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave()
    }
    if (e.key === 'Escape') {
      setCurrentValue(value ?? '')
      setIsEditing(false)
    }
  }

  if (isEditing) {
    if (type === 'select' && options) {
      return (
        <div className={cn("w-full", className)}>
          <Select 
            value={String(currentValue)} 
            onValueChange={(val) => {
              setCurrentValue(val)
            }}
            onOpenChange={(open) => {
                if (!open) handleSave()
            }}
          >
            <SelectTrigger className="w-full h-8">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }

    const Component = type === 'textarea' ? Textarea : Input
    
    return (
      <div className={cn("w-full", className)} ref={containerRef}>
        <Component
          autoFocus
          className={cn(
            "w-full h-auto min-h-[2rem]",
            type === 'textarea' && "min-h-[100px]"
          )}
          value={String(currentValue)}
          onChange={(e) => setCurrentValue(type === 'number' ? Number(e.target.value) : e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          type={type === 'number' ? 'number' : 'text'}
          placeholder={placeholder}
          disabled={isSaving}
        />
      </div>
    )
  }

  const displayValue = options?.find(opt => opt.value === String(value))?.label || value
  const handleTrigger = () => setIsEditing(true)
  const isPending = isSaving || isExternalPending

  return (
    <div 
      onClick={trigger === 'click' ? handleTrigger : undefined}
      onDoubleClick={trigger === 'doubleClick' ? handleTrigger : undefined}
      className={cn(
        "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded px-1 -mx-1 transition-colors min-h-[1.5rem] flex items-center",
        !value && "italic text-muted-foreground",
        isPending && "text-muted-foreground/50 animate-pulse cursor-wait",
        displayClassName
      )}
    >
      {displayValue || placeholder}
    </div>
  )
}