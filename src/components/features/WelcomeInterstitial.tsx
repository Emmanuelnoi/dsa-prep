import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface WelcomeInterstitialProps {
  open: boolean
  onClose: () => void
}

const LEVELS = [
  {
    emoji: '🌱',
    label: 'Just Starting',
    description: 'Begin with the essentials — Sorting, Two Pointers, and Binary Search.',
    route: '/category/sorting',
  },
  {
    emoji: '🌿',
    label: 'Know the Basics',
    description: 'Jump into Trees, Graphs, and Dynamic Programming.',
    route: '/category/trees',
  },
  {
    emoji: '🌳',
    label: 'Reviewing It All',
    description: 'Full access — every pattern, every template.',
    route: '/',
  },
]

export function WelcomeInterstitial({ open, onClose }: WelcomeInterstitialProps) {
  const navigate = useNavigate()

  const handleSelect = (route: string) => {
    onClose()
    navigate(route)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent
        className="max-w-md"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--text-primary)' }}>
            Welcome to DSA Patterns
          </DialogTitle>
          <DialogDescription style={{ color: 'var(--text-secondary)' }}>
            Annotated Python 3+ templates for every technical interview pattern.
            Where are you starting from?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          {LEVELS.map((level) => (
            <button
              key={level.label}
              onClick={() => handleSelect(level.route)}
              className="w-full text-left rounded-lg border p-4 transition-all hover:scale-[1.01] hover:shadow-md focus:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-default)',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-primary)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-default)')
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{level.emoji}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {level.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {level.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>
          All content is always accessible — this just sets your starting point.
        </p>
      </DialogContent>
    </Dialog>
  )
}
