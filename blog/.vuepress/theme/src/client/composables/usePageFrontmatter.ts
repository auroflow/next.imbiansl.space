import type { PageFrontmatter } from '@vuepress/shared'
import type { PageFrontmatterRef } from '@vuepress/client'
import { usePageFrontmatter as useDefaultPageFrontmatter } from '@vuepress/client'

export type MinimalMistakesPageFrontmatter = PageFrontmatter & {
  last_modified_at?: string
  tags?: string[]
  categories?: string[]
  collection?: string
  share?: boolean
}

export type MinimalMistakesPageFrontmatterRef = PageFrontmatterRef<MinimalMistakesPageFrontmatter>

export const usePageFrontmatter = (): MinimalMistakesPageFrontmatterRef => {
  return useDefaultPageFrontmatter<MinimalMistakesPageFrontmatter>()
}
