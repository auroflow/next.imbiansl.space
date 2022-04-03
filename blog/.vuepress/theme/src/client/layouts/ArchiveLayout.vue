<template>
  <DefaultLayout>
    <div id="main" role="main">
      <Sidebar />

      <div class="archive">
        <h1 id="page-title" class="page__title">
          {{ pagedata.title }}
        </h1>
        <slot />
      </div>
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import DefaultLayout from './DefaultLayout.vue'
import Sidebar from '../components/Sidebar.vue'
import { usePageData } from '../composables'

const pagedata = usePageData()
</script>
