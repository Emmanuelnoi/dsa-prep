import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

let highlighterPromise: Promise<HighlighterCore> | null = null

const htmlCache = new Map<string, string>()

export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [python, githubDark, githubLight] = await Promise.all([
        import('@shikijs/langs/python').then((m) => m.default),
        import('@shikijs/themes/github-dark').then((m) => m.default),
        import('@shikijs/themes/github-light').then((m) => m.default),
      ])
      return createHighlighterCore({
        themes: [githubDark, githubLight],
        langs: [python],
        engine: createJavaScriptRegexEngine(),
      })
    })()
  }
  return highlighterPromise
}

export async function highlightCode(
  code: string,
  cacheKey: string,
  theme: 'github-dark' | 'github-light' = 'github-dark',
): Promise<string> {
  const fullKey = `${cacheKey}-${theme}`
  const cached = htmlCache.get(fullKey)
  if (cached) return cached

  const highlighter = await getHighlighter()
  const html = highlighter.codeToHtml(code, {
    lang: 'python',
    theme,
  })

  htmlCache.set(fullKey, html)
  return html
}

export function clearHighlightCache(): void {
  htmlCache.clear()
}
