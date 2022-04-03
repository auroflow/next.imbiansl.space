<template>
  <div :class="`${type}__item`">
    <article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">
      <h2 class="archive__item-title no_toc" itemprop="headline">
        <router-link :to="{ path: post.path }">{{ post.title }}</router-link>
      </h2>
      <p v-if="post.excerpt" class="archive__item-excerpt" itemprop="description">{{ post.excerpt }}</p>
    </article>
  </div>
</template>

<script lang="ts" setup>
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
</script>
