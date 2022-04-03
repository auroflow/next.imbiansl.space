import { defineClientAppEnhance } from '@vuepress/client'
import Btn from '../widgets/Btn.vue'

export default defineClientAppEnhance(({ app, router, siteData }) => {
  app.component('Btn', Btn)

  router.options.scrollBehavior = (to, from) => {
    if (to.hash) {
      if (!from.name) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ el: to.hash })
          }, 250)
        })
      } else {
        return { el: to.hash }
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ top: 0 })
        }, 250)
      })
    }
  }

  router.options.linkActiveClass = ''
  router.options.linkExactActiveClass = ''
})
