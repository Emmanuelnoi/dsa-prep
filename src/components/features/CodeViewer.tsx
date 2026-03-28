import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Copy, Check, Maximize2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useHighlighter } from '@/hooks/useHighlighter'
import { CodeViewerFallback } from '@/components/CodeViewerFallback'
import type { Template, CodeTab } from '@/types'

interface CodeViewerProps {
  template: Template
  theme?: 'github-dark' | 'github-light'
  fontSize?: number
}

function HighlightedCode({
  code,
  cacheKey,
  theme,
  fallback,
}: {
  code: string
  cacheKey: string
  theme: 'github-dark' | 'github-light'
  fallback: string
}) {
  const { html, loading, error } = useHighlighter(code, cacheKey, theme)

  if (loading) {
    return (
      <div className="p-4 animate-pulse">
        <div className="h-4 rounded mb-2" style={{ backgroundColor: 'var(--bg-elevated)', width: '80%' }} />
        <div className="h-4 rounded mb-2" style={{ backgroundColor: 'var(--bg-elevated)', width: '60%' }} />
        <div className="h-4 rounded" style={{ backgroundColor: 'var(--bg-elevated)', width: '70%' }} />
      </div>
    )
  }

  if (error) return <CodeViewerFallback code={fallback} />

  return (
    <div
      className="overflow-x-auto p-4 [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function CodeViewer({ template, theme = 'github-dark', fontSize = 13 }: CodeViewerProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>('annotated')
  const [copied, setCopied] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  const currentCode = activeTab === 'annotated' ? template.annotatedCode : template.code

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable
    }
  }

  const codeBlock = (
    <div
      className="rounded-md border overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-default)',
        fontSize: `${fontSize}px`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Python 3
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs gap-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFullscreen(true)}
            className="h-7 px-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Maximize2 size={12} />
          </Button>
        </div>
      </div>

      {activeTab === 'complexity' ? (
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Time</span>
            <code
              className="px-2 py-0.5 rounded text-sm font-mono"
              style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--accent-hover)' }}
            >
              {template.timeComplexity}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Space</span>
            <code
              className="px-2 py-0.5 rounded text-sm font-mono"
              style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--accent-hover)' }}
            >
              {template.spaceComplexity}
            </code>
          </div>
          {template.commonMistakes.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                Common Mistakes
              </p>
              <ul className="space-y-1">
                {template.commonMistakes.map((m, i) => (
                  <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--danger)' }}>✕</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <HighlightedCode
          code={currentCode}
          cacheKey={`${template.id}-${activeTab}`}
          theme={theme}
          fallback={currentCode}
        />
      )}
    </div>
  )

  return (
    <>
      <div className="flex flex-col gap-3">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CodeTab)}>
          <TabsList className="h-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <TabsTrigger value="annotated" className="text-xs h-7">Annotated</TabsTrigger>
            <TabsTrigger value="template" className="text-xs h-7">Template</TabsTrigger>
            <TabsTrigger value="complexity" className="text-xs h-7">Complexity</TabsTrigger>
          </TabsList>
        </Tabs>
        {codeBlock}
      </div>

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent
          className="max-w-5xl w-full h-[80vh] flex flex-col"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          <DialogTitle className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {template.title}
          </DialogTitle>
          <div className="flex-1 overflow-auto">{codeBlock}</div>
        </DialogContent>
      </Dialog>
    </>
  )
}
