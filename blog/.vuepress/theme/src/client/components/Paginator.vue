<template>
  <nav class="pagination">
    <ul>
      <!-- Link for previous page -->
      <li v-if="current > 1">
        <router-link :to="dest(current - 1)">
          <span>Previous</span>
        </router-link>
      </li>
      <li v-else>
        <a href="#" class="disabled">
          <span aria-hidden="true">Previous</span>
        </a>
      </li>

      <!-- Link for next page -->
      <li v-if="current < count">
        <router-link :to="dest(current + 1)">
          <span>Next</span>
        </router-link>
      </li>
      <li v-else>
        <a href="#" class="disabled">
          <span aria-hidden="true">Next</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
const props = defineProps({
  count: {
    type: Number,
    required: true,
  },
  current: {
    type: Number,
    required: true,
  },
})

const route = useRoute()
const dest = (page: number) => ({
  path: route.path,
  query: {
    page: page,
  },
})
</script>
