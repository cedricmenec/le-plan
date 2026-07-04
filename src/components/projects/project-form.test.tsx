import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectForm } from './project-form'
import { vi, expect, test } from 'vitest'

const onSubmit = vi.fn()

test('renders form fields', () => {
  render(<ProjectForm onSubmit={onSubmit} />)
  expect(screen.getByLabelText(/Nom/i)).toBeDefined()
  expect(screen.getByLabelText(/Label/i)).toBeDefined()
  expect(screen.getByText(/Description/i)).toBeDefined()
})

test('renders color palette', () => {
  render(<ProjectForm onSubmit={onSubmit} />)
  // We'll check for the color selection buttons
  // Assuming they have a role or aria-label
  const colorButtons = screen.getAllByRole('button', { name: /Sélectionner la couleur/i })
  expect(colorButtons.length).toBeGreaterThanOrEqual(6)
})

test('calls onSubmit with form data', async () => {
  render(<ProjectForm onSubmit={onSubmit} buttonText="Créer le Projet" />)
  
  fireEvent.change(screen.getByLabelText(/Nom/i), { target: { value: 'New Project' } })
  fireEvent.change(screen.getByLabelText(/Label/i), { target: { value: 'NP' } })
  
  // Select first color
  const colorButtons = screen.getAllByRole('button', { name: /Sélectionner la couleur/i })
  fireEvent.click(colorButtons[0])
  
  const submitBtn = screen.getByRole('button', { name: /Créer le Projet/i })
  fireEvent.click(submitBtn)
  
  expect(onSubmit).toHaveBeenCalledWith({
    name: 'New Project',
    label: 'NP',
    description: '',
    color: '#ef4444',
    status: 'active'
  })
})
