import { useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { templateIndex } from '@/data/index'
import type { TemplateMeta } from '@/types'

const fuse = new Fuse<TemplateMeta>(templateIndex, {
  keys: ['title', 'tags', 'categoryId'],
  threshold: 0.3,
  includeScore: true,
})

export function useSearch(query: string) {
  const results = useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).map((r) => r.item)
  }, [query])

  return results
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const results = useSearch(query)

  return { open, setOpen, query, setQuery, results }
}
