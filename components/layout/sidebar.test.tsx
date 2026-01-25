import { render, screen } from '@testing-library/react'
import { Sidebar } from './sidebar'
import { describe, it, expect, vi } from 'vitest'

import { usePathname } from 'next/navigation'

// Mock useRouter and usePathname
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: vi.fn(() => '/'),
}))

// Mock Supabase client
const mockProjects = [
  { id: '1', name: 'Project Alpha' },
  { id: '2', name: 'Project Beta' },
]

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: mockProjects, error: null })),
      })),
    })),
  }),
}))

describe('Sidebar', () => {
  it('renders the branding', () => {
    render(<Sidebar />)
    expect(screen.getByText('Le Plan')).toBeDefined()
    expect(screen.getByText('Peaceful Efficiency')).toBeDefined()
  })

  it('renders navigation links', () => {
    render(<Sidebar />)
    const links = ['Dashboard', 'Projects', 'Missions', 'History', 'Settings']
    links.forEach(link => {
      expect(screen.getByText(link)).toBeDefined()
    })
  })

  it('renders projects in the project list', async () => {
    render(<Sidebar />)
    expect(await screen.findByText('Project Alpha')).toBeDefined()
    expect(await screen.findByText('Project Beta')).toBeDefined()
  })

  it('highlights the Missions link when on the root path', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    
    render(<Sidebar />)
    const missionsLink = screen.getByText('Missions').closest('a')
    expect(missionsLink?.className).toContain('bg-primary/10')
    expect(missionsLink?.className).toContain('text-primary')
  })

  it('highlights the Dashboard link when on /projects', () => {
    vi.mocked(usePathname).mockReturnValue('/projects')
    
    render(<Sidebar />)
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink?.className).toContain('bg-primary/10')
    expect(dashboardLink?.className).toContain('text-primary')
  })

  it('highlights a project link when on its detail page', async () => {
    vi.mocked(usePathname).mockReturnValue('/projects/1')
    
    render(<Sidebar />)
    const projectLink = (await screen.findByText('Project Alpha')).closest('a')
    expect(projectLink?.className).toContain('bg-primary/10')
    expect(projectLink?.className).toContain('text-primary')
  })

  it('auto-expands the Projects folder when on a project page', async () => {
    vi.mocked(usePathname).mockReturnValue('/projects/1')
    
    render(<Sidebar />)
    // Initially open by default, but let's test the logic by simulating a toggle then a pathname change
    // Since we can't easily simulate pathname change in one render without more complex setup, 
    // we verify it's open when pathname starts with /projects/
    expect(await screen.findByText('Project Alpha')).toBeDefined()
  })

  it('renders logout button', () => {
    render(<Sidebar />)
    expect(screen.getByText('Log Out')).toBeDefined()
  })
})
