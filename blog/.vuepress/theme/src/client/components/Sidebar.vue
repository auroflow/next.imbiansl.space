<template>
  <!-- Sidebar starts -->
  <div class="sidebar sticky">
    <AuthorProfile v-if="frontmatter.author" />
  </div>
  <!-- Sidebar ends -->
</template>

<script lang="ts" setup>
import AuthorProfile from './AuthorProfile.vue'
import { usePageFrontmatter } from '@vuepress/client'

const frontmatter = usePageFrontmatter()
</script>
