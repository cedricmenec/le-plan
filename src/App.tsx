import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Shell } from './components/layout/shell'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import MissionDetail from './pages/MissionDetail'
import ErrorPage from './pages/Error'
import { Toaster } from './components/ui/toaster'
import { NetworkStatus } from './components/layout/network-status'

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/missions/:id" element={<MissionDetail />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Shell>
      <Toaster />
      <NetworkStatus />
    </BrowserRouter>
  )
}