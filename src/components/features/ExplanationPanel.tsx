import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Template } from '@/types'

function Callout({ variant, children }: { variant: 'tip' | 'pitfall' | 'note' | 'danger'; children: React.ReactNode }) {
  const styles = {
    tip: { bg: 'var(--accent-subtle)', border: 'var(--accent-primary)', icon: '💡', label: 'Tip' },
    pitfall: { bg: '#1a0f0f', border: 'var(--danger)', icon: '⚠️', label: 'Pitfall' },
    note: { bg: 'var(--bg-elevated)', border: 'var(--border-muted)', icon: '📝', label: 'Note' },
    danger: { bg: '#1a0f0f', border: 'var(--danger)', icon: '🚫', label: 'Danger' },
  }[variant]

  return (
    <div
      className="rounded-md p-3 border-l-2 text-sm"
      style={{ backgroundColor: styles.bg, borderLeftColor: styles.border }}
    >
      <span className="font-semibold mr-1" style={{ color: styles.border }}>
        {styles.icon} {styles.label}:
      </span>
      <span style={{ color: 'var(--text-secondary)' }}>{children}</span>
    </div>
  )
}

interface ExplanationPanelProps {
  template: Template
}

export function ExplanationPanel({ template }: ExplanationPanelProps) {
  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {template.title}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {template.description}
        </p>
      </div>

      {/* Difficulty + Time estimate */}
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="text-xs capitalize"
          style={{
            borderColor:
              template.difficulty === 'beginner'
                ? 'var(--success)'
                : template.difficulty === 'intermediate'
                  ? 'var(--warning)'
                  : 'var(--danger)',
            color:
              template.difficulty === 'beginner'
                ? 'var(--success)'
                : template.difficulty === 'intermediate'
                  ? 'var(--warning)'
                  : 'var(--danger)',
          }}
        >
          {template.difficulty}
        </Badge>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          ~{template.estimatedMinutes} min
        </span>
      </div>

      <Separator style={{ backgroundColor: 'var(--border-default)' }} />

      {/* Step-by-step explanation */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Line-by-Line Walkthrough
        </h3>
        <ol className="space-y-3">
          {template.explanation.map((step, i) => (
            <li key={i} className="flex gap-3">
              <div className="flex-shrink-0">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: 'var(--accent-subtle)',
                    color: 'var(--accent-hover)',
                  }}
                >
                  {i + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1 mb-1">
                  {step.lines.map((ln) => (
                    <code
                      key={ln}
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      L{ln}
                    </code>
                  ))}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Separator style={{ backgroundColor: 'var(--border-default)' }} />

      {/* Tags */}
      {template.tags.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
            Tags
          </h3>
          <div className="flex flex-wrap gap-1">
            {template.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-secondary)',
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Common Mistakes callout */}
      {template.commonMistakes.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            Common Mistakes
          </h3>
          {template.commonMistakes.map((m, i) => (
            <Callout key={i} variant="pitfall">
              {m}
            </Callout>
          ))}
        </div>
      )}
    </div>
  )
}
