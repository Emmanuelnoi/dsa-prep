export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type TopicStatus = 'not-started' | 'in-progress' | 'reviewed' | 'mastered'

export type ViewMode = 'learn' | 'code' | 'split'

export type CodeTab = 'annotated' | 'template' | 'complexity'

export type CalloutVariant = 'tip' | 'pitfall' | 'note' | 'danger' | 'example'

export type QuizType = 'recall' | 'predict-output' | 'complexity-choice'

export type QuizRating = 'forgot' | 'fuzzy' | 'knew'

export type SidebarFilter = 'all' | 'bookmarked' | 'review-due' | 'completed'

export type CategoryGroup = 'foundations' | 'trees-graphs' | 'advanced'

export type CodeSize = 12 | 13 | 14

export interface ExplanationStep {
  lines: number[]
  text: string
}

export interface Quiz {
  question: string
  answer: string
  type: QuizType
}

export interface Template {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  estimatedMinutes: number
  code: string
  annotatedCode: string
  explanation: ExplanationStep[]
  timeComplexity: string
  spaceComplexity: string
  tags: string[]
  commonMistakes: string[]
  quizzes: Quiz[]
  variants: string[]
  prerequisites?: string[]
  relatedTemplates?: string[]
  nextTemplate?: string
  diagram?: string
}

export interface Category {
  id: string
  title: string
  icon: string
  group: CategoryGroup
  templates: Template[]
}

export interface CategoryMeta {
  id: string
  title: string
  icon: string
  group: CategoryGroup
  templateCount: number
}

export interface TemplateMeta {
  id: string
  title: string
  categoryId: string
  difficulty: Difficulty
  estimatedMinutes: number
  tags: string[]
  timeComplexity: string
  spaceComplexity: string
}

export interface QuizRecord {
  templateId: string
  lastRating: QuizRating
  lastReviewed: string
  nextReviewDate: string
  interval: number
}

export interface StreakData {
  current: number
  longest: number
  lastActiveDate: string
}

export interface AppState {
  version: number
  progress: Record<string, TopicStatus>
  bookmarks: string[]
  streak: StreakData
  theme: 'dark' | 'light'
  quizRatings: Record<string, QuizRecord>
  viewMode: ViewMode
  expandedGroups: string[]
  sidebarFilter: SidebarFilter
  codeSize: CodeSize
  onboardingComplete: boolean
}
