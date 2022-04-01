<template>
  <!-- SocialShare starts -->
  <section class="page__share">
    <h4 class="page__share-title">Share on</h4>
    <ClientOnly>
      <a
        :href="`https://twitter.com/intent/tweet?text=${frontmatter.title}%20${absolutePath}`"
        class="btn btn--twitter"
        target="_blank"
        rel="noopener noreferrer"
        title="Share on Twitter"
      >
        <i class="fa-brands fa-twitter fa-fw" aria-hidden="true"></i>
        <span> Twitter</span>
      </a>
      <a
        :href="`https://www.facebook.com/sharer/sharer.php?u=${absolutePath}`"
        class="btn btn--facebook"
        target="_blank"
        rel="noopener noreferrer"
        title="Share on Facebook"
      >
        <i class="fa-brands fa-facebook fa-fw" aria-hidden="true"></i>
        <span> Facebook</span>
      </a>
    </ClientOnly>
  </section>
  <!-- SocialShare ends -->
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeData, usePageFrontmatter } from '../composables'
import { usePageData, useRoute } from '@vuepress/client'

const themedata = useThemeData()
const frontmatter = usePageFrontmatter()
const route = useRoute()
const pagedata = usePageData()

let absolutePath = computed(() => encodeURIComponent(window.location.origin + route.fullPath))
</script>
