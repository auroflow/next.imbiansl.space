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

<style lang="scss" src="../styles/minimal-mistakes.scss"></style>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePageData } from '@vuepress/client'
import MastheadSection from '../components/MastheadSection.vue'
import Footer from '../components/Footer.vue'

const pagedata = usePageData()
const route = useRoute()
let key = computed(() => {
  let result = pagedata.value.key
  for (let q in route.query) {
    result += '-' + q + '-' + route.query[q]
  }
  return result
})
</script>
