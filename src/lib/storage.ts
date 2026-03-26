import type { AppState, TopicStatus, QuizRecord, StreakData, ViewMode, SidebarFilter, CodeSize } from '@/types'

const STORAGE_VERSION = 1
const STORAGE_KEY = 'dsa-patterns-state'

const DEFAULT_STATE: AppState = {
  version: STORAGE_VERSION,
  progress: {},
  bookmarks: [],
  streak: { current: 0, longest: 0, lastActiveDate: '' },
  theme: 'dark',
  quizRatings: {},
  viewMode: 'learn',
  expandedGroups: ['foundations'],
  sidebarFilter: 'all',
  codeSize: 13,
  onboardingComplete: false,
}

let inMemoryState: AppState = { ...DEFAULT_STATE }
let storageAvailable = true

function checkStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, '1')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

function migrate(state: AppState): AppState {
  return state
}

export function loadState(): AppState {
  if (!storageAvailable) return { ...inMemoryState }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      inMemoryState = { ...DEFAULT_STATE }
      return { ...inMemoryState }
    }

    const parsed = JSON.parse(raw) as AppState
    const migrated = migrate(parsed)

    if (migrated.version !== STORAGE_VERSION) {
      inMemoryState = { ...DEFAULT_STATE }
      return { ...inMemoryState }
    }

    inMemoryState = migrated
    return { ...inMemoryState }
  } catch {
    inMemoryState = { ...DEFAULT_STATE }
    return { ...inMemoryState }
  }
}

export function saveState(partial: Partial<AppState>): void {
  const current = loadState()
  const merged: AppState = { ...current, ...partial, version: STORAGE_VERSION }
  inMemoryState = merged

  if (!storageAvailable) return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. State saved in memory only.')
    }
    storageAvailable = false
  }
}

export function exportState(): string {
  return JSON.stringify(loadState(), null, 2)
}

export function importState(json: string): void {
  try {
    const parsed = JSON.parse(json)
    if (typeof parsed !== 'object' || parsed === null || !('version' in parsed)) {
      throw new Error('Invalid state format')
    }
    const migrated = migrate(parsed as AppState)
    saveState(migrated)
  } catch (e) {
    throw new Error(`Import failed: ${e instanceof Error ? e.message : 'unknown error'}`)
  }
}

export function resetState(): void {
  inMemoryState = { ...DEFAULT_STATE }
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // noop
  }
}

export function getNextInterval(rating: string, currentInterval: number): number {
  switch (rating) {
    case 'forgot':
      return 1
    case 'fuzzy':
      return Math.max(2, Math.floor(currentInterval * 1.2))
    case 'knew':
      return Math.min(30, Math.floor(currentInterval * 2.5))
    default:
      return 1
  }
}

// Initialize
storageAvailable = checkStorageAvailable()

// Re-export types to avoid import issues in consuming files
export type { TopicStatus, QuizRecord, StreakData, ViewMode, SidebarFilter, CodeSize }
