import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom'
import { Sidebar } from './components/layout/sidebar'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import MissionDetail from './pages/MissionDetail'
import ErrorPage from './pages/Error'
import { Toaster } from './components/ui/toaster'
import { NetworkStatus } from './components/layout/network-status'

function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10">
        <Outlet />
      </main>
    </div>
  )
}

// Hash router works for all deployment scenarios:
// - Development (localhost)
// - GitHub Pages (static hosting)
// - Hostinger static pages
// - VPS with static file serving
// - Netlify, Vercel, Surge, etc.
const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
      { path: 'missions/:id', element: <MissionDetail /> },
      { path: '*', element: <ErrorPage /> }
    ],
    errorElement: <ErrorPage />
  }
])

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      <NetworkStatus />
    </>
  )
}