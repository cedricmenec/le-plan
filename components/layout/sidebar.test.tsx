import { render, screen } from '@testing-library/react'
import { Sidebar } from './sidebar'
import { describe, it, expect, vi } from 'vitest'

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
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

  it('renders logout button', () => {
    render(<Sidebar />)
    expect(screen.getByText('Log Out')).toBeDefined()
  })
})
