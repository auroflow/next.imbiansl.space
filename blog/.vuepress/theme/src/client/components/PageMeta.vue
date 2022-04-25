<template>
  <p v-if="sortedTags.length" class="page__taxonomy">
    <strong>
      <i class="fa-solid fa-tags fa-fw" aria-hidden="true"></i>
      Tags:
    </strong>
    <span itemprop="keywords">
      <router-link
        :to="`/tags/#${slugify(tag)}`"
        v-for="tag in sortedTags"
        class="page__taxonomy-item p-category"
        rel="tag"
      >
        {{ tag }}
      </router-link>
    </span>
  </p>

  <p v-if="sortedCategories.length" class="page__taxonomy">
    <strong>
      <i class="fa-solid fa-folder-open fa-fw" aria-hidden="true"></i>
      Categories:
    </strong>
    <span itemprop="keywords">
      <router-link
        :to="`/categories/#${slugify(category)}`"
        v-for="category in sortedCategories"
        class="page__taxonomy-item p-category"
        rel="tag"
      >
        {{ category }}
      </router-link>
    </span>
  </p>

  <p class="page__date" v-if="displayDate">
    <strong>
      <i class="fa-solid fa-calendar-days fa-fw" aria-hidden="true"></i>
      {{ frontmatter.last_modified_at ? 'Updated: ' : 'Published: ' }}
    </strong>
    <time class="dt-published" :datetime="displayDate">{{ displayDate }}</time>
  </p>
</template>

<script lang="ts" setup>
import { useSiteData } from '@vuepress/client'
import { computed } from 'vue'
import { usePageFrontmatter } from '../composables'
import { slugify } from '../scripts/slugify'

const frontmatter = usePageFrontmatter()
const sitedata = useSiteData()

let displayDate = computed(() => {
  let date = frontmatter.value.last_modified_at ?? frontmatter.value.date
  if (!date) {
    return null
  } else if (date instanceof Date) {
    return date.toLocaleDateString(sitedata.value.lang)
  } else {
    return new Date(date).toLocaleDateString(sitedata.value.lang)
  }
})

let sortedTags = computed(() => {
  let tags = frontmatter.value.tags ?? []
  return tags.sort((a, b) => a.localeCompare(b, sitedata.value.lang))
})

let sortedCategories = computed(() => {
  let categories = frontmatter.value.categories ?? []
  return categories.sort((a, b) => a.localeCompare(b, sitedata.value.lang))
})
</script>
