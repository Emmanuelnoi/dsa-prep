import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { categories } from '@/data/index'
import { useSearch } from '@/hooks/useSearch'
import { Search, X, Flame, FileText } from 'lucide-react'
import type { CategoryGroup } from '@/types'

const GROUPS: { id: CategoryGroup; label: string }[] = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'trees-graphs', label: 'Trees & Graphs' },
  { id: 'advanced', label: 'Advanced' },
]

const DIFFICULTY_COLORS = {
  foundations: 'var(--success)',
  'trees-graphs': 'var(--warning)',
  advanced: 'var(--danger)',
} as const

// Most frequently tested DSA patterns in interviews
const TOP_PATTERNS = [
  { categoryId: 'two-pointers', label: 'Two Pointers' },
  { categoryId: 'sliding-window', label: 'Sliding Window' },
  { categoryId: 'binary-search', label: 'Binary Search' },
  { categoryId: 'bfs-dfs', label: 'BFS / DFS' },
  { categoryId: 'dynamic-programming', label: 'Dynamic Programming' },
  { categoryId: 'backtracking', label: 'Backtracking' },
  { categoryId: 'trees', label: 'Trees' },
  { categoryId: 'heap', label: 'Heap' },
]

export function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const results = useSearch(query)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          DSA Patterns
        </h1>
        <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
          Master the 14 essential algorithm patterns for technical interviews — with annotated Python
          3+ templates and step-by-step explanations.
        </p>
      </div>

      {/* Search bar */}
      <div ref={wrapperRef} className="relative mb-8">
        <div
          className="flex items-center gap-2 rounded-lg border px-3 py-2"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
        >
          <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search templates… (e.g. binary search, LRU, LCS)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowResults(true)
            }}
            onFocus={() => query && setShowResults(true)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          {query && (
            <button onClick={() => { setQuery(''); setShowResults(false) }} aria-label="Clear search">
              <X size={14} style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </div>

        {/* Inline results dropdown */}
        {showResults && query && (
          <div
            className="absolute z-50 mt-1 w-full rounded-lg border shadow-lg overflow-hidden"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
          >
            {results.length === 0 ? (
              <p className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                No templates found for "{query}"
              </p>
            ) : (
              results.slice(0, 8).map((t) => (
                <button
                  key={t.id}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-[var(--bg-canvas)]"
                  onClick={() => {
                    navigate(`/category/${t.categoryId}/template/${t.id}`)
                    setQuery('')
                    setShowResults(false)
                  }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>{t.title}</span>
                  <span className="text-xs ml-4 shrink-0" style={{ color: 'var(--text-muted)' }}>
                    {t.categoryId.replace(/-/g, ' ')} · {t.timeComplexity}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Top interview patterns */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            <Flame size={13} style={{ color: 'var(--warning)' }} />
            Most Asked in Interviews
          </h2>
          <Link
            to="/cheatsheet"
            className="flex items-center gap-1 text-xs hover:underline"
            style={{ color: 'var(--accent-primary)' }}
          >
            <FileText size={12} />
            Cheat Sheet &amp; Blind 75
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {TOP_PATTERNS.map((p) => (
            <button
              key={p.categoryId}
              onClick={() => navigate(`/category/${p.categoryId}`)}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--accent-primary)',
                color: 'var(--accent-primary)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* All categories grouped */}
      {GROUPS.map((group) => {
        const groupCats = categories.filter((c) => c.group === group.id)
        return (
          <div key={group.id} className="mb-8">
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              {group.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {groupCats.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className="text-left rounded-lg border p-4 transition-all hover:scale-[1.01] hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {cat.title}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: DIFFICULTY_COLORS[group.id],
                        color: DIFFICULTY_COLORS[group.id],
                      }}
                    >
                      {cat.templateCount} templates
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
