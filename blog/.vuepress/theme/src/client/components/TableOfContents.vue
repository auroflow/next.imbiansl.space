<template>
  <!-- TableOfContents starts -->
  <aside class="sidebar__right sticky">
    <nav ref="container" class="toc">
      <header>
        <h4 class="nav__title">
          <i class="fa-solid fa-file-lines" aria-hidden="true"></i>
          On this page
        </h4>
      </header>
      <Toc />
    </nav>
  </aside>
  <!-- TableOfContents ends -->
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import Gumshoe from '../scripts/gumshoe'

onMounted(() => {
  // Gumshoe scroll spy init
  var spy = new Gumshoe('nav.toc a', {
    // Active classes
    navClass: 'active', // applied to the nav list item
    contentClass: 'active', // applied to the content

    // Nested navigation
    nested: false, // if true, add classes to parents of active link
    nestedClass: 'active', // applied to the parent items

    // Offset & reflow
    offset: 20, // how far from the top of the page to activate a content area
    reflow: true, // if true, listen for reflows

    // Event support
    events: true, // if true, emit custom events
  })
})
</script>
