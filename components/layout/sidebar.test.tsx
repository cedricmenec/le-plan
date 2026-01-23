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
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signOut: vi.fn(),
    },
  }),
}))

describe('Sidebar', () => {
  it('renders the branding', () => {
    render(<Sidebar />)
    expect(screen.getByText('Workload')).toBeDefined()
    expect(screen.getByText('Productivity Tool')).toBeDefined()
  })

  it('renders navigation links', () => {
    render(<Sidebar />)
    const links = ['Missions', 'Projects', 'History', 'Settings']
    links.forEach(link => {
      expect(screen.getByText(link)).toBeDefined()
    })
  })

  it('highlights the Missions link when on the root path', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    
    render(<Sidebar />)
    const missionsLink = screen.getByText('Missions').closest('a')
    expect(missionsLink?.className).toContain('bg-primary/10')
    expect(missionsLink?.className).toContain('text-primary')
  })

  it('highlights the Projects link when on /projects', () => {
    vi.mocked(usePathname).mockReturnValue('/projects')
    
    render(<Sidebar />)
    const projectsLink = screen.getByText('Projects').closest('a')
    expect(projectsLink?.className).toContain('bg-primary/10')
    expect(projectsLink?.className).toContain('text-primary')
  })

  it('highlights the Projects link when on a subpath like /projects/123', () => {
    vi.mocked(usePathname).mockReturnValue('/projects/123')
    
    render(<Sidebar />)
    const projectsLink = screen.getByText('Projects').closest('a')
    expect(projectsLink?.className).toContain('bg-primary/10')
    expect(projectsLink?.className).toContain('text-primary')
  })

  it('renders logout button', () => {
    render(<Sidebar />)
    expect(screen.getByText('Log Out')).toBeDefined()
  })
})
