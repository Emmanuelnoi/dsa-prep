import { describe, it, expect } from 'vitest'
import { categories, templateIndex, getTemplatesByCategory, getCategoryMeta } from '../src/data/index'

describe('data/index', () => {
  it('has 14 categories', () => {
    expect(categories).toHaveLength(14)
  })

  it('has at least 60 template metadata entries', () => {
    expect(templateIndex.length).toBeGreaterThanOrEqual(60)
  })

  it('getTemplatesByCategory returns correct templates', () => {
    const bsTemplates = getTemplatesByCategory('binary-search')
    expect(bsTemplates.every((t) => t.categoryId === 'binary-search')).toBe(true)
    expect(bsTemplates.length).toBeGreaterThan(0)
  })

  it('getCategoryMeta returns undefined for unknown id', () => {
    expect(getCategoryMeta('does-not-exist')).toBeUndefined()
  })

  it('all templateIndex entries have required fields', () => {
    for (const t of templateIndex) {
      expect(t.id).toBeTruthy()
      expect(t.title).toBeTruthy()
      expect(t.categoryId).toBeTruthy()
      expect(['beginner', 'intermediate', 'advanced']).toContain(t.difficulty)
    }
  })
})
