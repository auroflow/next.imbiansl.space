import { PageFrontmatter } from '@vuepress/shared'

export interface MinimalMistakesPageFrontmatter extends PageFrontmatter {
  excerpt?: string
  last_modified_at?: string
  tags?: string[]
  categories?: string[]
  collection?: string
  share?: boolean
}
