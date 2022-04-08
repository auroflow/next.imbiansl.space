import { defineClientAppEnhance } from '@vuepress/client'
import Btn from '../widgets/Btn.vue'

const makePromise = (obj: object, timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(obj)
    }, timeout)
  })
}

export default defineClientAppEnhance(({ app, router, siteData }) => {
  app.component('Btn', Btn)

  router.options.scrollBehavior = (to, from) => {
    let behavior: object

    if (from.path === to.path) {
      if (to.hash) {
        behavior = { el: to.hash, behavior: 'smooth' }
      } else {
        behavior = { top: 0, behavior: 'smooth' }
      }
    } else {
      if (to.hash) {
        behavior = makePromise({ el: to.hash, behavior: 'smooth' }, 250)
      } else {
        behavior = makePromise({ top: 0, behavior: 'smooth' }, 250)
      }
    }

    return behavior
  }
})
