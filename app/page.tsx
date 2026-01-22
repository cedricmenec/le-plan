import { MissionList } from '@/components/missions/mission-list'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
      <DashboardHeader />
      <MissionList />
    </div>
  )
}
