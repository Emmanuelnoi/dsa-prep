import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { MobileSidebar } from '@/components/layout/MobileSidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CommandPalette } from '@/components/features/CommandPalette'
import { WelcomeInterstitial } from '@/components/features/WelcomeInterstitial'
import { HomePage } from '@/pages/HomePage'
import { CategoryPage } from '@/pages/CategoryPage'
import { TemplatePage } from '@/pages/TemplatePage'
import { CheatsheetPage } from '@/pages/CheatsheetPage'
import { NotFound } from '@/pages/NotFound'
import useAppState from '@/hooks/useAppState'

function AppShell() {
  const {
    state,
    setProgress,
    toggleBookmark,
    setTheme,
    completeOnboarding,
    setViewMode,
    setSidebarFilter,
  } = useAppState()

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Apply theme class on mount and on change
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(state.theme)
  }, [state.theme])

  const sidebarProps = {
    progress: state.progress,
    bookmarks: state.bookmarks,
    streak: state.streak,
    quizRatings: state.quizRatings,
    sidebarFilter: state.sidebarFilter,
    onFilterChange: setSidebarFilter,
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-canvas)' }}>
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:flex flex-shrink-0">
        <AppSidebar {...sidebarProps} />
      </div>

      {/* Mobile sidebar drawer */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        {...sidebarProps}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          theme={state.theme}
          onThemeToggle={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}
          onMenuOpen={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cheatsheet" element={<CheatsheetPage />} />
            <Route
              path="/category/:categoryId"
              element={<CategoryPage progress={state.progress} />}
            />
            <Route
              path="/category/:categoryId/template/:templateId"
              element={
                <TemplatePage
                  progress={state.progress}
                  bookmarks={state.bookmarks}
                  theme={state.theme}
                  viewMode={state.viewMode}
                  onProgressChange={(id, status) => setProgress(id, status as import("@/types").TopicStatus)}
                  onBookmarkToggle={toggleBookmark}
                  onViewModeChange={setViewMode}
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      {/* ⌘K command palette — always present */}
      <CommandPalette />

      {/* First-visit onboarding */}
      <WelcomeInterstitial
        open={!state.onboardingComplete}
        onClose={completeOnboarding}
      />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <TooltipProvider>
          <AppShell />
        </TooltipProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
