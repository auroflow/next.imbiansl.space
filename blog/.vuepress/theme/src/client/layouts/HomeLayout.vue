<template>
  <ArchiveLayout>
    <Content />
    <h3 class="archive__subtitle">Recent Posts</h3>
    <ArchiveSingle v-for="entry in entries" :key="entry.key" type="list" :post="entry" />
    <Paginator type="entries_layout" :count="pageCount" :current="page" />
  </ArchiveLayout>
</template>

<script lang="ts" setup>
import { useArticles } from '../composables'
import ArchiveLayout from './ArchiveLayout.vue'
import ArchiveSingle from '../components/ArchiveSingle.vue'
import Paginator from '../components/Paginator.vue'
import { useThemeData } from '../composables'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const themedata = useThemeData()
const route = useRoute()
let pagination = computed(() => (themedata.value.pagination ? themedata.value.pagination : 10))
let page = computed(() => {
  let pageString = route.query.page
  if (Array.isArray(pageString)) {
    pageString = pageString[0]
  }
  let pageNum = parseInt(pageString)
  return pageNum || 1
})

const all = useArticles().all
const entries = computed(() => all.slice(pagination.value * (page.value - 1), pagination.value * page.value))
const pageCount = computed(() => Math.ceil(all.length / pagination.value))
</script>
