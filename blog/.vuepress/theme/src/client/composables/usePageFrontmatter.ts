import type { PageFrontmatterRef } from '@vuepress/client'
import { usePageFrontmatter as useDefaultPageFrontmatter } from '@vuepress/client'
import { MinimalMistakesPageFrontmatter } from '../../shared'

export type MinimalMistakesPageFrontmatterRef = PageFrontmatterRef<MinimalMistakesPageFrontmatter>
export const usePageFrontmatter = (): MinimalMistakesPageFrontmatterRef => {
  return useDefaultPageFrontmatter<MinimalMistakesPageFrontmatter>()
}
