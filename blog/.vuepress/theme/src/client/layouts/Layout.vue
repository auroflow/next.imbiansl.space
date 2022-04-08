<template>
  <DefaultLayout>
    <PageHero
      v-if="frontmatter.header?.overlay_color || frontmatter.header?.overlay_image || frontmatter.header?.image"
    />

    <div id="main" role="main">
      <Sidebar />

      <article class="page" itemscope itemtype="https://schema.org/CreativeWork">
        <div class="page__inner-wrap">
          <header v-if="!frontmatter.header?.overlay_color && !frontmatter.header?.overlay_image">
            <h1 v-if="frontmatter.title" id="page-title" class="page__title" itemprop="headline">
              <span v-html="renderedTitle"></span>
            </h1>
            <div class="intro" v-if="frontmatter.excerpt">
              <span v-html="renderedExcerpt"></span>
            </div>
          </header>

          <section class="page__content" itemprop="text">
            <TableOfContents v-if="frontmatter.toc" />
            <Content />
          </section>

          <footer class="page__meta">
            <PageMeta />
          </footer>

          <SocialShare v-if="frontmatter.share" />

          <PostPagination />
        </div>
      </article>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from './DefaultLayout.vue'
import TableOfContents from '../components/TableOfContents.vue'
import PageMeta from '../components/PageMeta.vue'
import Sidebar from '../components/Sidebar.vue'
import SocialShare from '../components/SocialShare.vue'
import PostPagination from '../components/PostPagination.vue'
import PageHero from '../components/PageHero.vue'

import { usePageFrontmatter } from '../composables'
import md from '../scripts/markdown'
import { computed } from 'vue'

const frontmatter = usePageFrontmatter()

const renderedTitle = computed(() => md.renderInline(frontmatter.value.title ?? ''))
const renderedExcerpt = computed(() => md.renderInline(frontmatter.value.excerpt ?? ''))
</script>
