import { useNavigate, useParams, Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { getCategoryMeta, getTemplatesByCategory } from '@/data/index'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CategoryPageProps {
  progress: Record<string, string>
}

export function CategoryPage({ progress }: CategoryPageProps) {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()

  const category = getCategoryMeta(categoryId ?? '')
  const templates = getTemplatesByCategory(categoryId ?? '')

  if (!category) {
    return (
      <div className="p-8" style={{ color: 'var(--text-secondary)' }}>
        Category not found.
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            aria-label="Back to home"
            className="flex items-center rounded p-0.5 transition-colors hover:bg-[var(--bg-surface)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronLeft size={22} />
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {category.title}
          </h1>
        </div>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {templates.length} templates
        </p>
      </div>

      <div className="space-y-2">
        {templates.map((t) => {
          const status = progress[t.id] ?? 'not-started'
          return (
            <button
              key={t.id}
              onClick={() => navigate(`/category/${categoryId}/template/${t.id}`)}
              className="w-full flex items-center gap-4 rounded-lg border px-4 py-3 text-left transition-all hover:scale-[1.005]"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-default)',
              }}
            >
              {/* Status dot */}
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
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

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {t.title}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {t.timeComplexity} · {t.spaceComplexity} · ~{t.estimatedMinutes} min
                </p>
              </div>

              {/* Difficulty badge */}
              <Badge
                variant="outline"
                className="text-xs capitalize flex-shrink-0"
                style={{
                  borderColor:
                    t.difficulty === 'beginner'
                      ? 'var(--success)'
                      : t.difficulty === 'intermediate'
                        ? 'var(--warning)'
                        : 'var(--danger)',
                  color:
                    t.difficulty === 'beginner'
                      ? 'var(--success)'
                      : t.difficulty === 'intermediate'
                        ? 'var(--warning)'
                        : 'var(--danger)',
                }}
              >
                {t.difficulty}
              </Badge>

              <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
