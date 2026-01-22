import { render, screen } from '@testing-library/react'
import { Shell } from './shell'
import { describe, it, expect, vi } from 'vitest'
import { usePathname } from 'next/navigation'

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// Mock Sidebar and Supabase client
vi.mock('./sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar Mock</div>
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { signOut: vi.fn() },
  }),
}))

describe('Shell', () => {
  it('renders sidebar on dashboard routes', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Shell>Content</Shell>)
    expect(screen.getByTestId('sidebar')).toBeDefined()
    expect(screen.getByText('Content')).toBeDefined()
  })

  it('hides sidebar on login route', () => {
    vi.mocked(usePathname).mockReturnValue('/login')
    render(<Shell>Content</Shell>)
    expect(screen.queryByTestId('sidebar')).toBeNull()
    expect(screen.getByText('Content')).toBeDefined()
  })
})
