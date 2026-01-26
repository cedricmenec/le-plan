import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { PriorityBadge } from './priority-badge'

test('renders low priority badge', () => {
  render(<PriorityBadge priority="low" />)
  expect(screen.getByText('Basse')).toBeDefined()
})

test('renders medium priority badge', () => {
  render(<PriorityBadge priority="medium" />)
  expect(screen.getByText('Moyenne')).toBeDefined()
})

test('renders high priority badge', () => {
  render(<PriorityBadge priority="high" />)
  expect(screen.getByText('Haute')).toBeDefined()
})

test('renders critical priority badge', () => {
  render(<PriorityBadge priority="critical" />)
  expect(screen.getByText('CRITIQUE')).toBeDefined()
})

test('renders without icon when showIcon is false', () => {
  const { container } = render(<PriorityBadge priority="low" showIcon={false} />)
  expect(container.querySelector('svg')).toBeNull()
})
