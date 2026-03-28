import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, CheckCircle2 } from 'lucide-react'
import { loadCategory } from '@/data/index'
import { CodeViewer } from '@/components/features/CodeViewer'
import { ExplanationPanel } from '@/components/features/ExplanationPanel'
import { QuizCard } from '@/components/features/QuizCard'
import type { Template } from '@/types'

interface TemplatePageProps {
  progress: Record<string, string>
  bookmarks: string[]
  theme: 'dark' | 'light'
  onProgressChange: (id: string, status: string) => void
  onBookmarkToggle: (id: string) => void
}

export function TemplatePage({
  progress,
  bookmarks,
  theme,
  onProgressChange,
  onBookmarkToggle,
}: TemplatePageProps) {
  const { categoryId, templateId } = useParams<{ categoryId: string; templateId: string }>()
  const navigate = useNavigate()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [allTemplates, setAllTemplates] = useState<Template[]>([])

  useEffect(() => {
    if (!categoryId) return
    let cancelled = false
    const run = async () => {
      try {
        const cat = await loadCategory(categoryId)
        if (cancelled) return
        setAllTemplates(cat.templates)
        const t = cat.templates.find((t) => t.id === templateId)
        setTemplate(t ?? cat.templates[0] ?? null)
        setLoading(false)
      } catch {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [categoryId, templateId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-muted)' }}>
        Loading…
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p style={{ color: 'var(--text-secondary)' }}>Template not found.</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    )
  }

  const currentIndex = allTemplates.findIndex((t) => t.id === template.id)
  const prevTemplate = currentIndex > 0 ? allTemplates[currentIndex - 1] : null
  const nextTemplate = currentIndex < allTemplates.length - 1 ? allTemplates[currentIndex + 1] : null
  const isBookmarked = bookmarks.includes(template.id)
  const status = progress[template.id] ?? 'not-started'

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/category/${categoryId}`)}
            className="gap-0.5 px-1"
            aria-label="Back to home"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {template.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmarkToggle(template.id)}
            style={{ color: isBookmarked ? 'var(--accent-primary)' : 'var(--text-muted)' }}
          >
            {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </Button>
          <Button
            size="sm"
            onClick={() => onProgressChange(template.id, status === 'reviewed' ? 'not-started' : 'reviewed')}
            className="text-xs gap-1"
            style={{
              backgroundColor: status === 'reviewed' ? 'var(--accent-filled)' : 'var(--bg-elevated)',
              color: status === 'reviewed' ? 'var(--text-inverse)' : 'var(--text-secondary)',
            }}
          >
            <CheckCircle2 size={13} />
            {status === 'reviewed' ? 'Reviewed' : 'Mark Reviewed'}
          </Button>
        </div>
      </div>

      {/* 3-panel layout on desktop, tabs on mobile */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Desktop: side-by-side */}
        <div className="hidden lg:flex flex-1 min-w-0">
          {/* Explanation (left) */}
          <ScrollArea className="w-[45%] border-r" style={{ borderColor: 'var(--border-default)' }}>
            <ExplanationPanel template={template} />
            {/* Quizzes */}
            {template.quizzes.length > 0 && (
              <div className="px-4 pb-6 space-y-3">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Practice Questions
                </h3>
                {template.quizzes.map((q, i) => (
                  <QuizCard key={i} quiz={q} index={i} />
                ))}
              </div>
            )}
          </ScrollArea>
          {/* Code (right) */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              <CodeViewer
                template={template}
                theme={theme === 'dark' ? 'github-dark' : 'github-light'}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Mobile: tabs */}
        <div className="flex lg:hidden flex-col flex-1 min-h-0 overflow-hidden">
          <Tabs defaultValue="explain" className="flex flex-col flex-1 min-h-0">
            <TabsList
              className="mx-4 mt-2 h-8 flex-shrink-0"
              style={{ backgroundColor: 'var(--bg-elevated)' }}
            >
              <TabsTrigger value="explain" className="text-xs flex-1 h-7">
                Explain
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs flex-1 h-7">
                Code
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-xs flex-1 h-7">
                Quiz
              </TabsTrigger>
            </TabsList>
            <TabsContent value="explain" className="flex-1 overflow-auto mt-0">
              <ExplanationPanel template={template} />
            </TabsContent>
            <TabsContent value="code" className="flex-1 overflow-auto mt-0">
              <div className="p-4">
                <CodeViewer
                  template={template}
                  theme={theme === 'dark' ? 'github-dark' : 'github-light'}
                  fontSize={12}
                />
              </div>
            </TabsContent>
            <TabsContent value="quiz" className="flex-1 overflow-auto mt-0">
              <div className="p-4 space-y-3">
                {template.quizzes.map((q, i) => (
                  <QuizCard key={i} quiz={q} index={i} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Prev / Next footer */}
      <div
        className="flex items-center justify-between px-6 py-3 border-t flex-shrink-0"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-default)',
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          disabled={!prevTemplate}
          onClick={() =>
            prevTemplate && navigate(`/category/${categoryId}/template/${prevTemplate.id}`)
          }
          className="gap-1 text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ChevronLeft size={14} />
          {prevTemplate?.title ?? 'Previous'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={!nextTemplate}
          onClick={() =>
            nextTemplate && navigate(`/category/${categoryId}/template/${nextTemplate.id}`)
          }
          className="gap-1 text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          {nextTemplate?.title ?? 'Next'}
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}
