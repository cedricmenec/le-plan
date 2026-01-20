import { MissionForm } from '@/components/missions/mission-form'
import { MissionList } from '@/components/missions/mission-list'
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
    <main className="container mx-auto py-8 px-4 space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Tableau de Bord de Charge</h1>
        <p className="text-muted-foreground">Bienvenue, {user.email}</p>
      </header>

      <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
        <aside>
          <MissionForm />
        </aside>
        
        <section>
          <MissionList />
        </section>
      </div>
    </main>
  )
}