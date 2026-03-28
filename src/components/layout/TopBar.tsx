import { Moon, Sun } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface TopBarProps {
  theme: 'dark' | 'light'
  onThemeToggle: () => void
}

export function TopBar({ theme, onThemeToggle }: TopBarProps) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header
      className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0"
      style={{
        backgroundColor: 'var(--bg-canvas)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Left: breadcrumb text on non-home pages */}
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {isHome ? 'DSA Patterns' : ''}
      </span>

      {/* Right: theme toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onThemeToggle}
        aria-label="Toggle theme"
        style={{ color: 'var(--text-muted)' }}
      >
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </Button>
    </header>
  )
}
