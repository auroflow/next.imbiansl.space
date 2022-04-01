<template>
  <MastheadSection />
  <Transition>
    <div class="initial-content" :key="pagedata.key">
      <slot />
    </div>
  </Transition>
  <div id="footer" class="page__footer">
    <footer>
      <Footer />
    </footer>
  </div>
</template>

<style scss src="../styles/minimal-mistakes.scss"></style>

<script setup lang="ts">
import { Transition } from 'vue'
import { usePageData } from '@vuepress/client'
import MastheadSection from '../components/MastheadSection.vue'
import Footer from '../components/Footer.vue'

const pagedata = usePageData()
</script>
