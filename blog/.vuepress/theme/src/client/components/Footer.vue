<template>
  <div class="page__footer-follow">
    <ul class="social-icons">
      <li><strong>Follow</strong></li>
      <li v-for="link in links" :key="link.label">
        <a :href="link.url" target="_blank" rel="nofollow noopener noreferrer">
          <i :class="link.icon" class="fa-fw" aria-hidden="true"></i>
          {{ link.label }}
        </a>
      </li>
      <li v-if="feed">
        <a :href="feed">
          <i class="fa-solid fa-square-rss fa-fw" aria-hidden="true"></i>
          Feed
        </a>
      </li>
    </ul>
  </div>

  <div class="page__footer-copyright">
    &copy; {{ new Date().getFullYear() }} {{ author.name }}. Built with Vuepress. Powered by Minimal Mistakes, which is
    originally a Jekyll theme.
  </div>
</template>

<script lang="ts" setup>
import { useThemeData } from '@vuepress/plugin-theme-data/lib/client'
import { MinimalMistakesThemeConfig } from '../types'

const { author, footer } = useThemeData<MinimalMistakesThemeConfig>().value
const { links, feed } = footer
</script>
