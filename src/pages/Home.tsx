import { MissionList } from '@/components/missions/mission-list'
import { DashboardHeader } from '@/components/layout/dashboard-header'

export default function Home() {
  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 space-y-8">
      <DashboardHeader />
      <MissionList layout="split" showProjectName={true} />
    </div>
  )
}