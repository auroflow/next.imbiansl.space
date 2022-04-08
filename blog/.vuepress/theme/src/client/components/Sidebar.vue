<template>
  <!-- Sidebar starts -->
  <div class="sidebar sticky">
    <AuthorProfile v-if="frontmatter.author" />
    <SidebarNav :items="items" title="" />
  </div>
  <!-- Sidebar ends -->
</template>

<script lang="ts" setup>
import AuthorProfile from './AuthorProfile.vue'
import { usePageFrontmatter } from '../composables'
import { computed } from 'vue'
import { useArticles } from '../composables'
import SidebarNav from './SidebarNav.vue'

const frontmatter = usePageFrontmatter()
const collections = useArticles().collections

const collection = computed(() => collections[frontmatter.value.collection])

const items = computed(() => {
  if (!collection.value) {
    return []
  } else {
    return [
      {
        title: frontmatter.value.collection,
        url: '/collections/?collection=' + frontmatter.value.collection,
        children: collection.value
          .slice()
          .reverse()
          .map((item) => ({
            title: item.title,
            url: item.path,
          })),
      },
    ]
  }
})
</script>
