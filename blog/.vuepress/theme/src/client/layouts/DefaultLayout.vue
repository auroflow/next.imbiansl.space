<template>
  <Transition>
    <div class="initial_content" :key="key">
      <MastheadSection />

      <div class="initial-content">
        <slot />
      </div>

      <div id="footer" class="page__footer">
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scss src="../styles/minimal-mistakes.scss"></style>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePageData } from '@vuepress/client'
import MastheadSection from '../components/MastheadSection.vue'
import Footer from '../components/Footer.vue'

const pagedata = usePageData()
const route = useRoute()
let key = computed(() => {
  if (route.query.page) {
    return `${pagedata.value.key}-${route.query.page}`
  }
  return pagedata.value.key
})
</script>
