'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MISSION_TYPES = [
  { value: 'feature', label: 'Feature' },
  { value: 'study', label: 'Étude' },
  { value: 'support', label: 'Support' },
  { value: 'docs', label: 'Documentation' },
  { value: 'other', label: 'Autre' },
]

export function MissionForm() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const estimation = parseFloat(formData.get('estimation') as string)
    const confidence = parseFloat(formData.get('confidence') as string)
    const project_parent = formData.get('project_parent') as string

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Vous devez être connecté')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('missions')
      .insert({
        title,
        type,
        estimation,
        confidence,
        project_parent,
        user_id: user.id,
      })

    if (error) {
      alert('Erreur lors de la création de la mission')
    } else {
      event.currentTarget.reset()
      alert('Mission créée avec succès')
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Nouvelle Mission</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" name="title" placeholder="Nom de la mission" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select name="type" required>
              <SelectTrigger id="type">
                <SelectValue placeholder="Choisir un type" />
              </SelectTrigger>
              <SelectContent>
                {MISSION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimation">Estimation (jours)</Label>
              <Input id="estimation" name="estimation" type="number" step="0.5" defaultValue="1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence">Confiance (%)</Label>
              <Input id="confidence" name="confidence" type="number" min="0" max="100" defaultValue="100" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_parent">Projet Parent (Optionnel)</Label>
            <Input id="project_parent" name="project_parent" placeholder="Ex: Produit A" />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer la Mission'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
