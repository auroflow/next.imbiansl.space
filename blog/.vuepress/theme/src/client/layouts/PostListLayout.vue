<template>
  <ArchiveLayout>
    <ul v-if="['posts', 'tags', 'categories'].includes(type)" class="taxonomy__index">
      <li v-for="key in keys" :key="key">
        <router-link :to="{ hash: `#${slugify(key)}` }">
          <strong>{{ key }}</strong> <span class="taxonomy__count">{{ labels[key].length }}</span>
        </router-link>
      </li>
    </ul>

    <section v-for="key in keys" :key="key" :id="slugify(key)" class="taxonomy__section">
      <h2 class="archive__subtitle">{{ key }}</h2>
      <div class="entries-list">
        <ArchiveSingle v-for="post in labels[key]" :key="post.key" :post="post" type="list" />
      </div>
      <BackToTop />
    </section>
  </ArchiveLayout>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { slugify } from '../scripts/slugify'
import { useArticles, usePageFrontmatter } from '../composables'
import ArchiveLayout from './ArchiveLayout.vue'
import ArchiveSingle from '../components/ArchiveSingle.vue'
import BackToTop from '../widgets/BackToTop.vue'

const frontmatter = usePageFrontmatter()

const type = computed(() => frontmatter.value.list_type)
const articles = useArticles()
const labels = computed(() => {
  return articles[type.value]
})
const keys = computed(() => {
  if (type.value === 'posts') {
    // key is the year, should be in decrement order
    return Object.keys(labels.value).sort((a, b) => parseInt(b) - parseInt(a))
  } else {
    // key is a string
    return Object.keys(labels.value).sort((a, b) => a.localeCompare(b, frontmatter.value.lang))
  }
})
</script>
