import type { PageDataRef } from '@vuepress/client'
import { usePageData as useDefaultPageData } from '@vuepress/client'

export type MinimalMistakesPageDataRef = PageDataRef

export const usePageData = (): MinimalMistakesPageDataRef => {
  return useDefaultPageData()
}
