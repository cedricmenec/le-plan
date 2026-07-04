import { expect, test, describe } from 'vitest'
import { romToDays, calculateTaskRemainingLoad } from './load-utils'

describe('load-utils', () => {
  describe('romToDays', () => {
    test('returns correct days for each size', () => {
      expect(romToDays('XS')).toBe(0.5)
      expect(romToDays('S')).toBe(2)
      expect(romToDays('M')).toBe(5)
      expect(romToDays('L')).toBe(15)
      expect(romToDays('XL')).toBe(45)
      expect(romToDays('XXL')).toBe(100)
    })

    test('returns 0 for unknown size', () => {
      expect(romToDays('UNKNOWN' as any)).toBe(0)
    })
  })

  describe('calculateTaskRemainingLoad', () => {
    test('sums estimations of non-done tasks', () => {
      const tasks = [
        { is_completed: false, estimation: 1 },
        { is_completed: false, estimation: 2.5 },
        { is_completed: true, estimation: 5 },
      ]
      // @ts-ignore - testing with partial objects
      expect(calculateTaskRemainingLoad(tasks)).toBe(3.5)
    })

    test('returns 0 if all tasks are done', () => {
      const tasks = [
        { is_completed: true, estimation: 1 },
      ]
      // @ts-ignore
      expect(calculateTaskRemainingLoad(tasks)).toBe(0)
    })

    test('returns 0 if task list is empty', () => {
      expect(calculateTaskRemainingLoad([])).toBe(0)
    })
  })
})
