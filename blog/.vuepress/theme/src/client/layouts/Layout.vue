<template>
  <DefaultLayout>
    <div id="main" role="main">
      <Sidebar />
      <article class="page" itemscope itemtype="https://schema.org/CreativeWork">
        <div class="page__inner-wrap">
          <header>
            <h1 v-if="frontmatter.title" id="page-title" class="page__title" itemprop="headline">
              {{ frontmatter.title }}
            </h1>
            <div class="intro" v-if="frontmatter.excerpt">
              {{ frontmatter.excerpt }}
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
        </div>
      </article>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from './DefaultLayout.vue'
import TableOfContents from '../components/TableOfContents.vue'
import PageMeta from '../components/PageMeta.vue'
import { usePageFrontmatter } from '@vuepress/client'
import Sidebar from '../components/Sidebar.vue'
import SocialShare from '../components/SocialShare.vue'

const frontmatter = usePageFrontmatter()
</script>
