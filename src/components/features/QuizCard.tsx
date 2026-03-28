import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Quiz, QuizRating } from '@/types'

interface QuizCardProps {
  quiz: Quiz
  index: number
  onRate?: (rating: QuizRating) => void
}

export function QuizCard({ quiz, index, onRate }: QuizCardProps) {
  const [revealed, setRevealed] = useState(false)
  const [rated, setRated] = useState<QuizRating | null>(null)

  const handleRate = (rating: QuizRating) => {
    setRated(rating)
    onRate?.(rating)
  }

  return (
    <div
      className="rounded-md border overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-default)',
      }}
    >
      <button
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-[var(--bg-elevated)] transition-colors"
        onClick={() => setRevealed((v) => !v)}
      >
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
          style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-hover)' }}
        >
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {quiz.question}
          </p>
          <p className="text-xs mt-0.5 capitalize" style={{ color: 'var(--text-muted)' }}>
            {quiz.type.replace('-', ' ')}
          </p>
        </div>
        {revealed ? (
          <ChevronUp size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        ) : (
          <ChevronDown size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        )}
      </button>

      {revealed && (
        <div
          className="px-4 pb-4 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <p className="text-sm mt-3 mb-4" style={{ color: 'var(--text-secondary)' }}>
            {quiz.answer}
          </p>
          {!rated ? (
            <div className="flex gap-2">
              <p className="text-xs self-center mr-1" style={{ color: 'var(--text-muted)' }}>
                How well did you know this?
              </p>
              {(['forgot', 'fuzzy', 'knew'] as QuizRating[]).map((r) => (
                <Button
                  key={r}
                  size="sm"
                  variant="outline"
                  onClick={() => handleRate(r)}
                  className="text-xs h-7 capitalize"
                  style={{
                    borderColor:
                      r === 'forgot'
                        ? 'var(--danger)'
                        : r === 'fuzzy'
                          ? 'var(--warning)'
                          : 'var(--success)',
                    color:
                      r === 'forgot'
                        ? 'var(--danger)'
                        : r === 'fuzzy'
                          ? 'var(--warning)'
                          : 'var(--success)',
                  }}
                >
                  {r}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Rated: <span className="capitalize font-medium">{rated}</span> — review scheduled
            </p>
          )}
        </div>
      )}
    </div>
  )
}
