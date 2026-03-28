import { useState, useRef } from 'react'
import { Moon, Sun, Menu, Download, Upload, RotateCcw, Settings } from 'lucide-react'
import { useLocation, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { exportState, importState, resetState } from '@/lib/storage'
import { categories } from '@/data/index'

interface TopBarProps {
  theme: 'dark' | 'light'
  onThemeToggle: () => void
  onMenuOpen?: () => void
}

function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')

  const handleExport = () => {
    const json = exportState()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dsa-progress-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg('Exported!')
    setTimeout(() => setMsg(''), 2000)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        importState(ev.target?.result as string)
        setMsg('Imported! Reload to see changes.')
      } catch (err) {
        setMsg(`Error: ${err instanceof Error ? err.message : 'invalid file'}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleReset = () => {
    if (confirm('Reset ALL progress? This cannot be undone.')) {
      resetState()
      window.location.reload()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--text-primary)' }}>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Progress Data
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-xs"
              onClick={handleExport}
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
            >
              <Download size={13} /> Export progress JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-xs"
              onClick={() => fileRef.current?.click()}
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
            >
              <Upload size={13} /> Import progress JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
          <div className="border-t pt-3" style={{ borderColor: 'var(--border-default)' }}>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-xs"
              onClick={handleReset}
              style={{ borderColor: 'var(--border-default)', color: 'var(--destructive, #ef4444)' }}
            >
              <RotateCcw size={13} /> Reset all progress
            </Button>
          </div>
          {msg && (
            <p className="text-xs text-center py-1" style={{ color: 'var(--accent-primary)' }}>
              {msg}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function TopBar({ theme, onThemeToggle, onMenuOpen }: TopBarProps) {
  const location = useLocation()
  const { categoryId, templateId } = useParams()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const isHome = location.pathname === '/'

  // Build breadcrumb
  let breadcrumb: React.ReactNode = 'DSA Patterns'
  if (categoryId) {
    const cat = categories.find((c) => c.id === categoryId)
    if (cat) {
      breadcrumb = (
        <span className="flex items-center gap-1">
          <span>{cat.title}</span>
          {templateId && (
            <>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                {templateId.replace(/-/g, ' ')}
              </span>
            </>
          )}
        </span>
      )
    }
  } else if (!isHome) {
    breadcrumb = location.pathname.replace('/', '').replace(/-/g, ' ')
  }

  return (
    <>
      <header
        className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0"
        style={{
          backgroundColor: 'var(--bg-canvas)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center gap-2">
          {/* Mobile hamburger */}
          {onMenuOpen && (
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-1"
              onClick={onMenuOpen}
              aria-label="Open sidebar"
              style={{ color: 'var(--text-muted)' }}
            >
              <Menu size={16} />
            </Button>
          )}
          <span className="text-xs truncate max-w-[200px] sm:max-w-none" style={{ color: 'var(--text-muted)' }}>
            {breadcrumb}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
            style={{ color: 'var(--text-muted)' }}
          >
            <Settings size={15} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onThemeToggle}
            aria-label="Toggle theme"
            style={{ color: 'var(--text-muted)' }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </Button>
        </div>
      </header>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
