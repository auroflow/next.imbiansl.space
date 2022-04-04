<template>
  <!-- MastheadSection starts -->
  <div class="masthead">
    <div class="masthead__inner-wrap">
      <div class="masthead__menu">
        <nav ref="navbar" id="site-nav" class="greedy-nav">
          <router-link ref="siteTitle" class="site-title" :to="{ path: '/' }">{{ sitedata.title }}</router-link>
          <ul id="v-link-container" class="visible-links">
            <li v-for="(link, index) in visibleLinks" :key="index" class="masthead__menu-item">
              <a v-if="isExternalLink(link.url)" href="link.url" :title="link.description">{{ link.title }}</a>
              <router-link v-else :to="{ path: link.url }" :title="link.description">{{ link.title }}</router-link>
            </li>
          </ul>
          <button
            id="nav-toggle-button"
            class="greedy-nav__toggle"
            :class="{ hidden: !hiddenLinks.length, close: showHiddenLinks }"
            @click="showHiddenLinks = !showHiddenLinks"
          >
            <span class="visually-hidden">More</span>
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
              <router-link v-else :to="{ path: link.url }" title="link.description">
                {{ link.title }}
              </router-link>
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
import { useThemeData } from '../composables'
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import type { Ref } from 'vue'
import _ from 'lodash'

const sitedata = useSiteData()
const themedata = useThemeData()

const isExternalLink = (link: string) => /^https?:\/\//.test(link)

const visibleLinks = reactive([...themedata.value.header.navigation])
const hiddenLinks = reactive([])
const showHiddenLinks = ref(false)

// Adjust the navbar upon window resize by moving links between
// visibleLinks and hiddenLinks
onMounted(() => {
  let numOfItems = 0
  let totalSpace = 0
  let checkFrequency = 500
  let breakWidths = []

  let vlinkContainer = document.querySelector<HTMLDivElement>('#v-link-container')

  let initialVlinks = Array.from(vlinkContainer.children) as HTMLLIElement[]
  if (initialVlinks.length !== visibleLinks.length) {
    // This is a nasty workaround when initialVlinks is not yet updated on mounted when
    // routing to a new page.
    for (let i = 0; i < visibleLinks.length; i++) {
      breakWidths[i] = 100 * (i + 1)
    }
  } else {
    initialVlinks.forEach((link) => {
      numOfItems += 1
      totalSpace += link.offsetWidth
      breakWidths.push(totalSpace)
    })
  }

  let availableSpace: number
  let numOfVisibleItems: number
  let requiredSpace: number

  function check() {
    // Get instant state
    vlinkContainer = document.querySelector<HTMLDivElement>('#v-link-container')
    if (!vlinkContainer) return
    const button = document.querySelector<HTMLButtonElement>('#nav-toggle-button')

    availableSpace = vlinkContainer.offsetWidth - button.offsetWidth
    numOfVisibleItems = visibleLinks.length
    // Note that there is a slight mismatch when the window breakpoint is triggered,
    // but this does not severely affect the layout.
    requiredSpace = breakWidths[numOfVisibleItems - 1]

    if (requiredSpace > availableSpace) {
      hiddenLinks.unshift(visibleLinks.pop())
      nextTick(check)
    } else if (availableSpace > breakWidths[numOfVisibleItems]) {
      visibleLinks.push(hiddenLinks.shift())
      nextTick(check)
    }

    button.setAttribute('count', (numOfItems - numOfVisibleItems).toString())
    if (numOfVisibleItems === numOfItems) {
      button.classList.add('hidden')
    } else {
      button.classList.remove('hidden')
    }
  }

  let checkThrottled = _.throttle(check, checkFrequency)

  // Listen to resizes of the navbar
  const observer = new ResizeObserver(checkThrottled)
  const navbar = document.querySelector<HTMLDivElement>('#site-nav')
  observer.observe(navbar)

  check()
})
</script>
