<template>
  <nav v-if="pagination && (pagination.prev || pagination.next)" class="pagination">
    <router-link
      v-if="pagination.prev"
      :to="pagination.prev.path"
      class="pagination--pager"
      :title="pagination.prev.title"
    >
      Previous
    </router-link>
    <a v-else href="#" class="pagination--pager disabled">Previous</a>
    <router-link
      v-if="pagination.next"
      :to="pagination.next.path"
      class="pagination--pager"
      :title="pagination.next.title"
    >
      Next
    </router-link>
    <a v-else href="#" class="pagination--pager disabled">Next</a>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { usePageData, useArticles } from '../composables'

const pagedata = usePageData()
const { nav } = useArticles()
const pagination = computed(() => nav[pagedata.value.key])
</script>
