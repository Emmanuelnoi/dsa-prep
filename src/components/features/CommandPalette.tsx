import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useCommandPalette } from '@/hooks/useSearch'
import { registerPaletteOpener } from '@/lib/paletteStore'

export function CommandPalette() {
  const navigate = useNavigate()
  const { open, setOpen, query, setQuery, results } = useCommandPalette()

  // Register so any component can call openPalette() without prop-drilling
  useEffect(() => {
    registerPaletteOpener(setOpen)
  }, [setOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [setOpen])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput
          placeholder="Search DSA templates…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No templates found.</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Templates">
              {results.slice(0, 8).map((t) => (
                <CommandItem
                  key={t.id}
                  value={t.id}
                  onSelect={() => {
                    navigate(`/category/${t.categoryId}/template/${t.id}`)
                    setOpen(false)
                    setQuery('')
                  }}
                >
                  <div className="flex flex-col">
                    <span>{t.title}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {t.categoryId} · {t.timeComplexity}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
