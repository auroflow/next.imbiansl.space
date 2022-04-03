import { Page } from '@vuepress/core'
import { MinimalMistakesPageFrontmatter } from './pageData'

export interface PageEntry<T = {}> {
  pageObject: Page<{}, T>
  key: string
  path: string
  title: string
  lang: string
  date: string
  excerpt?: string
  tags?: string[]
  categories?: string[]
  collection?: string
}

export type Articles = {
  all: PageEntry[]
  posts: {
    [year: number]: PageEntry[]
  }
  tags: {
    [tag: string]: PageEntry[]
  }
  categories: {
    [category: string]: PageEntry[]
  }
  collections: {
    [collection: string]: PageEntry[]
  }
  nav: {
    [key: string]: {
      prev?: {
        path: string
        title: string
      }
      next?: {
        path: string
        title: string
      }
    }
  }
}

function getArray<T>(obj: T | T[]) {
  if (!obj) return null
  return Array.isArray(obj) ? obj : [obj]
}

export function getPageEntry<T = MinimalMistakesPageFrontmatter>(page: Page<T>): PageEntry {
  const frontmatter: MinimalMistakesPageFrontmatter = page.frontmatter
  return {
    pageObject: page,
    key: page.key,
    path: page.path,
    title: frontmatter?.title,
    lang: page.lang,
    date: page.frontmatter?.date ? new Date(page.frontmatter?.date).toISOString() : null,
    excerpt: frontmatter?.excerpt,
    tags: getArray(frontmatter?.tags),
    categories: getArray(frontmatter?.categories),
    collection: frontmatter?.collection,
  }
}
