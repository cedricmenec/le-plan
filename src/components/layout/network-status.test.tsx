import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NetworkStatus } from './network-status'

describe('NetworkStatus', () => {
  beforeEach(() => {
    // Mock navigator.onLine to true by default
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows online status when navigator.onLine is true', () => {
    render(<NetworkStatus />)
    expect(screen.getByText('En ligne')).toBeDefined()
  })

  it('shows offline indicator when navigator.onLine is false', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false,
    })
    render(<NetworkStatus />)
    expect(screen.getAllByText('Hors ligne').length).toBeGreaterThanOrEqual(1)
  })

  it('updates when online event fires', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false,
    })
    render(<NetworkStatus />)
    expect(screen.getAllByText('Hors ligne').length).toBeGreaterThanOrEqual(1)

    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        value: true,
      })
      window.dispatchEvent(new Event('online'))
    })

    expect(screen.getByText('En ligne')).toBeDefined()
  })

  it('updates when offline event fires', () => {
    render(<NetworkStatus />)
    expect(screen.getByText('En ligne')).toBeDefined()

    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        value: false,
      })
      window.dispatchEvent(new Event('offline'))
    })

    expect(screen.getAllByText('Hors ligne').length).toBeGreaterThanOrEqual(1)
  })
})