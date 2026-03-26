interface CodeViewerFallbackProps {
  code: string
  title?: string
}

export function CodeViewerFallback({ code, title }: CodeViewerFallbackProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // clipboard API not available
    }
  }

  return (
    <div
      role="region"
      aria-label={title ? `Code template: ${title}` : 'Code template'}
      className="relative overflow-auto rounded-md border"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Python (syntax highlighting unavailable)
        </span>
        <button
          onClick={handleCopy}
          className="rounded px-2 py-1 text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          Copy
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code style={{ color: 'var(--text-primary)' }}>{code}</code>
      </pre>
    </div>
  )
}
