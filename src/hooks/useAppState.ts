import { useState, useCallback } from 'react'
import { loadState, saveState, recordActivity, getNextInterval } from '@/lib/storage'
import type { AppState, TopicStatus, ViewMode, SidebarFilter, CodeSize, QuizRating } from '@/types'

function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState())

  const update = useCallback((partial: Partial<AppState>) => {
    saveState(partial)
    setState((prev) => ({ ...prev, ...partial }))
  }, [])

  const setProgress = useCallback(
    (templateId: string, status: TopicStatus) => {
      recordActivity()
      const progress = { ...state.progress, [templateId]: status }
      update({ progress })
    },
    [state.progress, update],
  )

  const toggleBookmark = useCallback(
    (templateId: string) => {
      const bookmarks = state.bookmarks.includes(templateId)
        ? state.bookmarks.filter((id) => id !== templateId)
        : [...state.bookmarks, templateId]
      update({ bookmarks })
    },
    [state.bookmarks, update],
  )

  const setTheme = useCallback(
    (theme: 'dark' | 'light') => {
      document.documentElement.classList.remove('dark', 'light')
      document.documentElement.classList.add(theme)
      update({ theme })
    },
    [update],
  )

  const recordQuiz = useCallback(
    (templateId: string, rating: QuizRating) => {
      const existing = state.quizRatings[templateId]
      const interval = existing?.interval ?? 1
      const nextInterval = getNextInterval(rating, interval)
      const nextDate = new Date(Date.now() + nextInterval * 86400000).toISOString().split('T')[0]
      const quizRatings = {
        ...state.quizRatings,
        [templateId]: {
          templateId,
          lastRating: rating,
          lastReviewed: new Date().toISOString().split('T')[0],
          nextReviewDate: nextDate,
          interval: nextInterval,
        },
      }
      update({ quizRatings })
    },
    [state.quizRatings, update],
  )

  return {
    state,
    setProgress,
    toggleBookmark,
    setTheme,
    recordQuiz,
    setViewMode: (viewMode: ViewMode) => update({ viewMode }),
    setSidebarFilter: (sidebarFilter: SidebarFilter) => update({ sidebarFilter }),
    setCodeSize: (codeSize: CodeSize) => update({ codeSize }),
    setExpandedGroups: (expandedGroups: string[]) => update({ expandedGroups }),
    completeOnboarding: () => update({ onboardingComplete: true }),
  }
}

export default useAppState
