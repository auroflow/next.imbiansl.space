<template>
  <!-- MastheadSection starts -->
  <div class="masthead">
    <div class="masthead__inner-wrap">
      <div class="masthead__menu">
        <nav ref="navbar" id="site-nav" class="greedy-nav">
          <router-link ref="siteTitle" class="site-title" :to="{ path: '/' }">{{ title }}</router-link>
          <ul ref="vlinkContainer" class="visible-links">
            <li v-for="(link, index) in visibleLinks" :key="index" class="masthead__menu-item">
              <a v-if="isExternalLink(link.url)" href="link.url" :title="link.description">{{ link.title }}</a>
              <router-link v-else :to="{ path: link.url }" :title="link.description">{{ link.title }}</router-link>
            </li>
          </ul>
          <button
            ref="button"
            class="greedy-nav__toggle"
            :class="{ hidden: !hiddenLinks.length, close: showHiddenLinks }"
            @click="showHiddenLinks = !showHiddenLinks"
          >
            <span class="visually-hidden">更多导航</span>
            <div class="navicon"></div>
          </button>
          <ul
            ref="hlinkContainer"
            class="hidden-links"
            :class="{ hidden: !hiddenLinks.length || !showHiddenLinks }"
            @click="showHiddenLinks = false"
          >
            <li v-for="link in hiddenLinks" class="masthead__menu-item">
              <a v-if="isExternalLink(link.url)" href="link.url" title="link.description">{{ link.title }}</a>
              <router-link v-else :to="{ path: link.url }" title="link.description">{{ link.title }}</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
  <!-- MastheadSection ends -->
</template>

<script lang="ts" setup>
import { useSiteData } from '@vuepress/client'
import { useThemeData } from '@vuepress/plugin-theme-data/lib/client'
import { nextTick, onMounted, reactive, ref } from 'vue'
import type { Ref } from 'vue'
import _ from 'lodash'
import type { MinimalMistakesThemeConfig } from '../types'

const { title } = useSiteData().value
const { navigation } = useThemeData<MinimalMistakesThemeConfig>().value.header

const isExternalLink = (link: string) => /^https?:\/\//.test(link)

const visibleLinks = reactive(navigation)
const hiddenLinks = reactive([])
const showHiddenLinks = ref(false)

const navbar: Ref<HTMLElement> = ref(null)
const button: Ref<HTMLButtonElement> = ref(null)
const vlinkContainer: Ref<HTMLUListElement> = ref(null)
const hlinkContainer: Ref<HTMLUListElement> = ref(null)

onMounted(() => {
  let numOfItems = 0
  let totalSpace = 0
  let checkFrequency = 500
  let breakWidths = []

  let initialVlinks = Array.from(vlinkContainer.value.children) as HTMLLIElement[]

  initialVlinks.forEach((link) => {
    numOfItems += 1
    totalSpace += link.offsetWidth
    breakWidths.push(totalSpace)
  })

  let availableSpace: number
  let numOfVisibleItems: number
  let requiredSpace: number

  function check() {
    // Get instant state
    let vlinks = Array.from(vlinkContainer.value.children) as HTMLLIElement[]
    availableSpace = vlinkContainer.value.offsetWidth - button.value.offsetWidth
    numOfVisibleItems = vlinks.length
    requiredSpace = breakWidths[numOfVisibleItems - 1]

    if (requiredSpace > availableSpace) {
      hiddenLinks.unshift(visibleLinks.pop())
      numOfVisibleItems -= 1
      nextTick(check)
    } else if (availableSpace > breakWidths[numOfVisibleItems]) {
      visibleLinks.push(hiddenLinks.shift())
      numOfVisibleItems += 1
      nextTick(check)
    }

    button.value.setAttribute('count', (numOfItems - numOfVisibleItems).toString())
    if (numOfVisibleItems === numOfItems) {
      button.value.classList.add('hidden')
    } else {
      button.value.classList.remove('hidden')
    }
  }

  let checkThrottled = _.throttle(check, checkFrequency)

  const observer = new ResizeObserver(checkThrottled)
  observer.observe(navbar.value)

  check()
})
</script>
