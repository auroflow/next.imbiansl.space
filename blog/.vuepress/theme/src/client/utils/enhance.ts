import { defineClientAppEnhance } from '@vuepress/client'
import Btn from '../widgets/Btn.vue'
import nProgress from 'nprogress'

const makePromise = (obj: object, timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(obj)
    }, timeout)
  })
}

export default defineClientAppEnhance(({ app, router, siteData }) => {
  app.component('Btn', Btn)

  router.beforeEach((to, from) => {
    if (to.path !== from.path) {
      nProgress.start()
    }
  })

  router.afterEach(() => {
    nProgress.done()
  })

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
        behavior = makePromise({ el: to.hash, behavior: 'smooth' }, 750)
      } else {
        behavior = makePromise({ top: 0, behavior: 'smooth' }, 750)
      }
    }

    return behavior
  }
})
