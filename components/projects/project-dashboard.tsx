'use client'

import { Database } from '@/types/database.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, ListTodo, PlayCircle } from 'lucide-react'

type Mission = Database['public']['Tables']['missions']['Row']

interface ProjectDashboardProps {
  missions: Mission[]
}

export function ProjectDashboard({ missions }: ProjectDashboardProps) {
  const todoCount = missions.filter(m => m.status === 'todo').length
  const inProgressCount = missions.filter(m => m.status === 'in_progress').length
  
  const remainingWorkload = missions
    .filter(m => m.status !== 'done')
    .reduce((sum, m) => sum + (m.estimation || 0), 0)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En cours</CardTitle>
          <PlayCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressCount}</div>
          <p className="text-xs text-muted-foreground">
            Missions actives
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">À faire</CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todoCount}</div>
          <p className="text-xs text-muted-foreground">
            Missions non démarrées
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Charge restante</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{remainingWorkload} jours</div>
          <p className="text-xs text-muted-foreground">
            Estimation totale (non terminées)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
