<template>
  <div :class="rootClassObject" :style="rootStyleObject">
    <div v-if="frontmatter.header?.overlay_color || frontmatter.header?.overlay_image" class="wrapper">
      <h1 id="page-title" class="page__title" itemprop="headline">
        <span v-html="renderedTitle"></span>
      </h1>
      <p v-if="frontmatter.excerpt" class="page__lead">
        <span v-html="renderedExcerpt"></span>
      </p>
    </div>
    <img
      v-else
      :src="frontmatter.header?.image"
      :alt="frontmatter.header?.image_description"
      class="page__hero-image"
    />

    <span v-if="frontmatter.header?.caption" class="page__hero-caption"
      ><span v-html="renderedHeaderCaption"></span
    ></span>
  </div>
</template>

<script lang="ts" setup>
import { usePageFrontmatter } from '../composables'
import { computed } from 'vue'
import md from '../scripts/markdown'

const frontmatter = usePageFrontmatter()

const rootClassObject = computed(() => ({
  page__hero: !frontmatter.value.header?.overlay_color && !frontmatter.value.header?.overlay_image,
  'page__hero--overlay': frontmatter.value.header?.overlay_color || frontmatter.value.header?.overlay_image,
}))

const rootStyleObject = computed(() => ({
  backgroundColor: frontmatter.value.header?.overlay_color ?? 'transparent',
  backgroundImage: frontmatter.value.header?.overlay_image ? `url(${frontmatter.value.header.overlay_image})` : 'none',
}))

const renderedTitle = computed(() => md.renderInline(frontmatter.value.title ?? ''))
const renderedExcerpt = computed(() => md.renderInline(frontmatter.value.excerpt ?? ''))
const renderedHeaderCaption = computed(() => md.renderInline(frontmatter.value.header?.caption ?? ''))
</script>
