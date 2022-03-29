<template>
  <div class="initial-content">
    <slot />
  </div>
</template>

<style scss src="../styles/minimal-mistakes.scss"></style>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { hash } = useRoute()
const router = useRouter()

onMounted(() => {
  console.log(hash)
  setTimeout(() => {
    router.push({ hash })
  }, 500)
})
</script>
