import { describe, it, expect, beforeEach } from 'vitest'
import { loadState, saveState, resetState, getNextInterval } from '../src/lib/storage'

describe('storage', () => {
  beforeEach(() => resetState())

  it('returns default state when nothing is saved', () => {
    const state = loadState()
    expect(state.theme).toBe('dark')
    expect(state.progress).toEqual({})
    expect(state.bookmarks).toEqual([])
    expect(state.version).toBe(1)
  })

  it('persists and reads back a partial update', () => {
    saveState({ theme: 'light' })
    const state = loadState()
    expect(state.theme).toBe('light')
  })

  it('resets to default state', () => {
    saveState({ theme: 'light', bookmarks: ['bs-classic'] })
    resetState()
    const state = loadState()
    expect(state.theme).toBe('dark')
    expect(state.bookmarks).toEqual([])
  })
})

describe('getNextInterval', () => {
  it('resets to 1 on forgot', () => {
    expect(getNextInterval('forgot', 10)).toBe(1)
  })

  it('applies 1.2x multiplier on fuzzy', () => {
    expect(getNextInterval('fuzzy', 10)).toBe(12)
  })

  it('applies 2.5x multiplier on knew (capped at 30)', () => {
    expect(getNextInterval('knew', 5)).toBe(12)
    expect(getNextInterval('knew', 20)).toBe(30)
  })
})
