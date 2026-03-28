import { useEffect } from 'react'
import type { ViewMode } from '@/types'

interface ShortcutOptions {
  onPrev?: () => void
  onNext?: () => void
  onViewMode?: (mode: ViewMode) => void
}

const VIEW_MODE_MAP: Record<string, ViewMode> = {
  '1': 'learn',
  '2': 'code',
  '3': 'split',
}

export function useKeyboardShortcuts({ onPrev, onNext, onViewMode }: ShortcutOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) return

      if (e.key === 'ArrowLeft' && !e.metaKey && !e.ctrlKey && onPrev) {
        e.preventDefault()
        onPrev()
      }
      if (e.key === 'ArrowRight' && !e.metaKey && !e.ctrlKey && onNext) {
        e.preventDefault()
        onNext()
      }
      if (onViewMode && VIEW_MODE_MAP[e.key] && !e.metaKey && !e.ctrlKey && !e.altKey) {
        onViewMode(VIEW_MODE_MAP[e.key])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onPrev, onNext, onViewMode])
}
