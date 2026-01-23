import { render, screen } from '@testing-library/react'
import { Breadcrumb } from './breadcrumb'
import { expect, test, vi } from 'vitest'

// Mock next/link
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    ),
  }
})

test('renders breadcrumb items', () => {
  const items = [
    { label: 'Projects', href: '/projects' },
    { label: 'Test Project' }
  ]
  
  render(<Breadcrumb items={items} />)
  
  expect(screen.getByText('Projects')).toBeDefined()
  expect(screen.getByText('Test Project')).toBeDefined()
})

test('renders links for items with href', () => {
  const items = [
    { label: 'Projects', href: '/projects' },
    { label: 'Test Project' }
  ]
  
  render(<Breadcrumb items={items} />)
  
  const link = screen.getByRole('link', { name: 'Projects' })
  expect(link.getAttribute('href')).toBe('/projects')
})

test('does not render link for current item (no href)', () => {
  const items = [
    { label: 'Projects', href: '/projects' },
    { label: 'Test Project' }
  ]
  
  render(<Breadcrumb items={items} />)
  
  const currentItem = screen.getByText('Test Project')
  expect(currentItem.tagName).not.toBe('A')
})
