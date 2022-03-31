<template>
  <MastheadSection />
  <div class="initial-content">
    <slot />
  </div>
</template>

<style scss src="../styles/minimal-mistakes.scss"></style>

<script setup lang="ts">
import MastheadSection from '../components/MastheadSection.vue'
</script>
