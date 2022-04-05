import { PageFrontmatter } from '@vuepress/shared'

export interface MinimalMistakesPageFrontmatter extends PageFrontmatter {
  excerpt?: string
  last_modified_at?: string
  tags?: string[]
  categories?: string[]
  collection?: string

  /** Whether sharing is enabled. */
  share?: boolean

  /** Defines which list to render if the layout is postlist */
  list_type?: 'posts' | 'tags' | 'categories' | 'collections'

  /** Whether the page should appear in any list and is included in page navigation */
  hidden?: boolean
}
