import { Ref } from 'vue'
import { MinimalMistakesThemeData } from '../../shared'
import { useThemeData as useDefaultThemeData } from '@vuepress/plugin-theme-data/lib/client'

export type MinimalMistakesThemeDataRef = Ref<MinimalMistakesThemeData>
export const useThemeData = (): MinimalMistakesThemeDataRef => {
  return useDefaultThemeData<MinimalMistakesThemeData>()
}
