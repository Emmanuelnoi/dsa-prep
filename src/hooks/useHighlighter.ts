import { useState, useEffect, useRef } from 'react'
import { highlightCode } from '@/lib/shiki'

export function useHighlighter(
  code: string,
  cacheKey: string,
  theme: 'github-dark' | 'github-light' = 'github-dark',
) {
  const [html, setHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    const run = async () => {
      try {
        const result = await highlightCode(code, cacheKey, theme)
        if (isMounted.current) {
          setHtml(result)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setLoading(false)
        }
      }
    }
    run()
    return () => {
      isMounted.current = false
    }
  }, [code, cacheKey, theme])

  return { html, loading, error }
}
