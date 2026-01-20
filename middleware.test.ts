import { expect, test } from 'vitest'
import { config } from './middleware'

test('middleware config has correct matcher', () => {
  expect(config.matcher).toBeDefined()
  expect(Array.isArray(config.matcher)).toBe(true)
})
