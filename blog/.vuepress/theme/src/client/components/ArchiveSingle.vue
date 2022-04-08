<template>
  <div :class="`${type}__item`">
    <article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">
      <h2 class="archive__item-title no_toc" itemprop="headline">
        <router-link :to="{ path: post.path }"><span v-html="renderedTitle"></span></router-link>
      </h2>
      <p v-if="post.excerpt" class="archive__item-excerpt" itemprop="description">
        <span v-html="renderedExcerpt"></span>
      </p>
    </article>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import md from '../scripts/markdown'

const props = defineProps({
  type: {
    type: String,
    default: 'list',
  },
  post: {
    type: Object,
    required: true,
  },
  teaser: {
    type: String,
    required: false,
  },
})

const renderedTitle = computed(() => md.renderInline(props.post.title ?? ''))
const renderedExcerpt = computed(() => md.renderInline(props.post.excerpt ?? ''))
</script>
