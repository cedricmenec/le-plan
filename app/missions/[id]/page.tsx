import { getMission } from '../actions'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { SubtaskList } from '@/components/missions/subtask-list'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MissionDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  let mission;
  try {
    mission = await getMission(id)
  } catch (error) {
    console.error('Error fetching mission:', error)
    return notFound()
  }

  if (!mission) {
    return notFound()
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
      <Breadcrumb 
        items={[
          { label: 'Missions', href: '/' },
          { label: mission.title }
        ]} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{mission.title}</h1>
            {mission.goal && (
              <p className="mt-2 text-muted-foreground">{mission.goal}</p>
            )}
          </div>
        </div>

        <div>
          <SubtaskList missionId={mission.id} />
        </div>
      </div>
    </div>
  )
}
