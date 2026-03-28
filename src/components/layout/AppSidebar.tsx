import { useState } from 'react'
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronRight, Search, PanelLeftClose, PanelLeftOpen, FileText } from 'lucide-react'
import { categories, getTemplatesByCategory, templateIndex } from '@/data/index'
import { openPalette } from '@/lib/paletteStore'
import { ProgressRing } from '@/components/features/ProgressRing'
import { cn } from '@/lib/utils'
import type { CategoryGroup, SidebarFilter, StreakData, QuizRecord } from '@/types'

const GROUPS: { id: CategoryGroup; label: string }[] = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'trees-graphs', label: 'Trees & Graphs' },
  { id: 'advanced', label: 'Advanced' },
]

const FILTERS: { id: SidebarFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'bookmarked', label: '⭐' },
  { id: 'review-due', label: '🔄' },
  { id: 'completed', label: '✅' },
]

interface AppSidebarProps {
  progress: Record<string, string>
  bookmarks: string[]
  streak: StreakData
  quizRatings: Record<string, QuizRecord>
  sidebarFilter: SidebarFilter
  onFilterChange: (filter: SidebarFilter) => void
}

export function AppSidebar({ progress, bookmarks, streak, quizRatings, sidebarFilter, onFilterChange }: AppSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { categoryId, templateId } = useParams()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [expandedCategories, setExpandedCategories] = useState<string[]>([categoryId ?? ''])

  const toggleGroup = (id: string) =>
    setExpandedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    )

  const toggleCategory = (id: string) =>
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )

  // Open the ⌘K command palette via the singleton store
  const openSearch = () => openPalette()

  const isCheatsheet = location.pathname === '/cheatsheet'
  const today = new Date().toISOString().split('T')[0]

  const isTemplateVisible = (id: string): boolean => {
    switch (sidebarFilter) {
      case 'bookmarked':
        return bookmarks.includes(id)
      case 'review-due':
        return !!quizRatings[id] && quizRatings[id].nextReviewDate <= today
      case 'completed':
        return progress[id] === 'reviewed' || progress[id] === 'mastered'
      default:
        return true
    }
  }

  // ── Collapsed state: narrow strip with toggle only ──────────────────────
  if (collapsed) {
    return (
      <aside
        className="flex flex-col h-full border-r items-center py-3 gap-3"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-default)',
          width: '48px',
          minWidth: '48px',
        }}
      >
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          className="p-1.5 rounded hover:bg-[var(--bg-elevated)] transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <PanelLeftOpen size={16} />
        </button>
        <button
          onClick={openSearch}
          aria-label="Search"
          className="p-1.5 rounded hover:bg-[var(--bg-elevated)] transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <Search size={16} />
        </button>
        <button
          onClick={() => navigate('/cheatsheet')}
          aria-label="Cheat Sheet"
          className={cn(
            'p-1.5 rounded transition-colors',
            isCheatsheet ? 'bg-[var(--accent-subtle)]' : 'hover:bg-[var(--bg-elevated)]',
          )}
          style={{ color: isCheatsheet ? 'var(--accent-primary)' : 'var(--text-muted)' }}
        >
          <FileText size={16} />
        </button>
      </aside>
    )
  }

  // ── Expanded sidebar ─────────────────────────────────────────────────────
  return (
    <aside
      className="flex flex-col h-full border-r"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-default)',
        width: '260px',
        minWidth: '260px',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <Link to="/" className="group">
          <h1 className="text-sm font-bold group-hover:opacity-80 transition-opacity" style={{ color: 'var(--text-primary)' }}>
            DSA Patterns
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Interview Prep
          </p>
        </Link>
        <button
          onClick={() => setCollapsed(true)}
          aria-label="Collapse sidebar"
          className="p-1 rounded hover:bg-[var(--bg-elevated)] transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <PanelLeftClose size={15} />
        </button>
      </div>

      {/* Search — functional: opens ⌘K palette */}
      <div className="px-3 py-2">
        <button
          onClick={openSearch}
          className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[var(--bg-elevated)]"
          style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
        >
          <Search size={13} />
          <span className="flex-1 text-left text-xs">Search templates…</span>
          <kbd
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--text-muted)' }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Filter chips */}
      <div className="px-3 pb-2 flex gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className="flex-1 rounded-md py-1 text-xs font-medium transition-colors"
            aria-pressed={sidebarFilter === f.id}
            style={{
              backgroundColor: sidebarFilter === f.id ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
              color: sidebarFilter === f.id ? 'var(--accent-primary)' : 'var(--text-muted)',
              border: `1px solid ${sidebarFilter === f.id ? 'var(--accent-primary)' : 'transparent'}`,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Navigation — invisible scrollbar */}
      <div className="sidebar-scroll flex-1 px-2 pb-2 overflow-y-auto">
        {GROUPS.map((group) => {
          const groupCategories = categories.filter((c) => c.group === group.id)
          const isGroupOpen = expandedGroups.includes(group.id)

          return (
            <Collapsible
              key={group.id}
              open={isGroupOpen}
              onOpenChange={() => toggleGroup(group.id)}
              className="mb-1"
            >
              <CollapsibleTrigger className="w-full flex items-center gap-1 px-2 py-1.5 rounded text-xs font-semibold uppercase tracking-wide hover:bg-[var(--bg-elevated)] transition-colors">
                <ChevronRight
                  size={12}
                  className={cn('transition-transform duration-200', isGroupOpen && 'rotate-90')}
                  style={{ color: 'var(--text-muted)' }}
                />
                <span style={{ color: 'var(--text-muted)' }}>{group.label}</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {groupCategories.map((cat) => {
                  const allTemplates = getTemplatesByCategory(cat.id)
                  const templates = allTemplates.filter((t) => isTemplateVisible(t.id))
                  if (sidebarFilter !== 'all' && templates.length === 0) return null
                  const isCatOpen = expandedCategories.includes(cat.id)
                  const isActiveCat = categoryId === cat.id

                  return (
                    <Collapsible
                      key={cat.id}
                      open={isCatOpen}
                      onOpenChange={() => toggleCategory(cat.id)}
                      className="ml-3"
                    >
                      <CollapsibleTrigger
                        className={cn(
                          'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors',
                          isActiveCat ? 'font-semibold' : 'hover:bg-[var(--bg-elevated)]',
                        )}
                        style={{
                          color: isActiveCat ? 'var(--accent-hover)' : 'var(--text-secondary)',
                          backgroundColor: isActiveCat ? 'var(--accent-subtle)' : undefined,
                        }}
                      >
                        <ChevronRight
                          size={11}
                          className={cn('transition-transform duration-200', isCatOpen && 'rotate-90')}
                        />
                        <span className="flex-1 text-left truncate">{cat.title}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {cat.templateCount}
                        </span>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <ul className="ml-4 mt-0.5 space-y-0.5">
                          {templates.map((t) => {
                            const status = progress[t.id] ?? 'not-started'
                            const isActive = templateId === t.id

                            return (
                              <li key={t.id}>
                                <button
                                  onClick={() => navigate(`/category/${cat.id}/template/${t.id}`)}
                                  className={cn(
                                    'w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-left transition-colors',
                                    isActive ? 'font-medium' : 'hover:bg-[var(--bg-elevated)]',
                                  )}
                                  style={{
                                    color: isActive ? 'var(--accent-hover)' : 'var(--text-secondary)',
                                    backgroundColor: isActive ? 'var(--accent-subtle)' : undefined,
                                  }}
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{
                                      backgroundColor:
                                        status === 'mastered'
                                          ? 'var(--success)'
                                          : status === 'reviewed'
                                            ? 'var(--accent-primary)'
                                            : status === 'in-progress'
                                              ? 'var(--warning)'
                                              : 'var(--bg-overlay)',
                                    }}
                                  />
                                  <span className="truncate">{t.title}</span>
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
          )
        })}

        {/* Cheat Sheet link — below Advanced */}
        <div className="mt-2 mb-1 px-1">
          <div className="border-t mb-2" style={{ borderColor: 'var(--border-default)' }} />
          <Link
            to="/cheatsheet"
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors',
              isCheatsheet ? 'font-semibold' : 'hover:bg-[var(--bg-elevated)]',
            )}
            style={{
              color: isCheatsheet ? 'var(--accent-hover)' : 'var(--text-secondary)',
              backgroundColor: isCheatsheet ? 'var(--accent-subtle)' : undefined,
            }}
          >
            <FileText size={13} />
            <span>Cheat Sheet</span>
            <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
              Blind 75
            </span>
          </Link>
        </div>
      </div>

      {/* Footer — progress ring + streak */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-t flex-shrink-0"
        style={{ borderColor: 'var(--border-default)' }}
      >
        {(() => {
          const total = templateIndex.length
          const done = Object.values(progress).filter(
            (s) => s === 'reviewed' || s === 'mastered',
          ).length
          const pct = total > 0 ? (done / total) * 100 : 0
          return (
            <>
              <ProgressRing value={pct} size={32} strokeWidth={3} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium leading-none" style={{ color: 'var(--text-primary)' }}>
                  {done} / {total}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  templates reviewed
                </p>
              </div>
              {streak.current > 0 && (
                <span
                  className="text-xs font-semibold flex items-center gap-0.5"
                  style={{ color: 'var(--warning)' }}
                  title={`${streak.current}-day streak (longest: ${streak.longest})`}
                >
                  🔥 {streak.current}
                </span>
              )}
            </>
          )
        })()}
      </div>
    </aside>
  )
}

