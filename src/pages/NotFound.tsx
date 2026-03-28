import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
      <p className="text-6xl font-bold" style={{ color: 'var(--text-muted)' }}>404</p>
      <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
        Page not found
      </h1>
      <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
        The page you're looking for doesn't exist.
      </p>
      <Button asChild size="sm" className="gap-2">
        <Link to="/"><Home size={14} /> Go Home</Link>
      </Button>
    </div>
  )
}
