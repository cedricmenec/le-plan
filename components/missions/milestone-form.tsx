'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Database } from '@/types/database.types'
import { getMilestoneTypes } from '@/app/missions/actions'

type MilestoneType = Database['public']['Tables']['milestone_types']['Row']

interface MilestoneFormProps {
  missionId: string
  initialData?: {
    id?: string
    title: string
    date: string
    type_id: string
    note?: string | null
  }
  onSubmit: (data: any) => void
  loading?: boolean
  buttonText?: string
}

export function MilestoneForm({ missionId, initialData, onSubmit, loading, buttonText }: MilestoneFormProps) {
  const [types, setTypes] = useState<MilestoneType[]>([])
  const [title, setTitle] = useState(initialData?.title || '')
  const [date, setDate] = useState(initialData?.date || '')
  const [typeId, setTypeId] = useState(initialData?.type_id || '')
  const [note, setNote] = useState(initialData?.note || '')

  useEffect(() => {
    async function fetchTypes() {
      try {
        const data = await getMilestoneTypes()
        setTypes(data || [])
        // Set default type if not editing
        if (!initialData?.type_id && data && data.length > 0) {
          setTypeId(data[0].id)
        }
      } catch (error) {
        console.error('Failed to fetch milestone types', error)
      }
    }
    fetchTypes()
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      mission_id: missionId,
      title,
      date,
      type_id: typeId,
      note: note || null
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Ex: Réunion de cadrage" 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type_id">Type</Label>
        <Select value={typeId} onValueChange={setTypeId} required>
          <SelectTrigger id="type_id">
            <SelectValue placeholder="Choisir un type" />
          </SelectTrigger>
          <SelectContent>
            {types.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input 
          id="date" 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note (Optionnelle)</Label>
        <Textarea 
          id="note" 
          value={note || ''} 
          onChange={(e) => setNote(e.target.value)} 
          placeholder="Détails, ordre du jour, etc." 
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading || types.length === 0}>
        {loading ? 'Chargement...' : (buttonText || 'Enregistrer')}
      </Button>
    </form>
  )
}
