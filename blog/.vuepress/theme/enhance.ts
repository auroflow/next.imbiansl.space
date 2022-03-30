import { defineClientAppEnhance } from '@vuepress/client'
import Btn from './widgets/Btn.vue'

export default defineClientAppEnhance(({ app, router, siteData }) => {
  app.component('Btn', Btn)
})
