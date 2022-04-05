<template>
  <ArchiveLayout>
    <template v-if="['posts', 'tags', 'categories', 'collections'].includes(type)">
      <ul class="taxonomy__index">
        <li v-for="key in keys" :key="key">
          <router-link :to="getHash(key)">
            <strong>{{ key }}</strong> <span class="taxonomy__count">{{ labels[key].length }}</span>
          </router-link>
        </li>
      </ul>

      <Transition name="list">
        <div>
          <section v-for="key in keysToShow" :key="key" :id="slugify(key)" class="taxonomy__section">
            <h2 class="archive__subtitle">{{ key }}</h2>
            <div class="entries-list">
              <ArchiveSingle v-for="post in labels[key]" :key="post.key" :post="post" type="list" />
            </div>
            <BackToTop />
          </section>
        </div>
      </Transition>
    </template>
  </ArchiveLayout>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { slugify } from '../scripts/slugify'
import { useArticles, usePageFrontmatter } from '../composables'
import ArchiveLayout from './ArchiveLayout.vue'
import ArchiveSingle from '../components/ArchiveSingle.vue'
import BackToTop from '../widgets/BackToTop.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
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
const keysToShow = computed(() => {
  if (type.value !== 'collections') {
    return keys.value
  } else {
    let query = route.query.collection
    if (Array.isArray(query)) {
      query = query[0]
    }
    if (query && keys.value.includes(query)) {
      return [query]
    } else {
      return []
    }
  }
})

const getHash = (key: string) => {
  if (type.value !== 'collections') {
    return { hash: `#${slugify(key)}` }
  } else {
    return {
      path: route.path,
      query: { collection: key },
    }
  }
}
</script>

<style scss>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
  transform: translate(-15px, 0);
}
</style>
