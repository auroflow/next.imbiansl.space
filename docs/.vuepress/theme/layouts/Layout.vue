<template>
  <DefaultLayout>
    <div id="main" role="main">
      <article
        class="page"
        itemscope
        itemtype="https://schema.org/CreativeWork"
      >
        <div class="page__inner-wrap">
          <header>
            <h1
              v-if="title"
              id="page-title"
              class="page__title"
              itemprop="headline"
            >
              {{ title }}
            </h1>
            <div class="intro" v-if="excerpt">
              {{ excerpt }}
            </div>
          </header>

          <section class="page__content" itemprop="text">
            <Content />
          </section>
        </div>
      </article>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from './DefaultLayout.vue'
import { usePageFrontmatter } from '@vuepress/client'

const { title, excerpt } = usePageFrontmatter().value
console.log(excerpt)
</script>
