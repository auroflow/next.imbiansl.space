<template>
  <aside class="sidebar__right sticky">
    <nav ref="container" class="toc">
      <header>
        <h4 class="nav__title">
          <i class="fa-solid fa-file-lines" aria-hidden></i>
          目录
        </h4>
      </header>
      <Toc />
    </nav>
  </aside>
</template>

<script lang="ts" setup>
// import { ref, onMounted, Ref } from 'vue'

// // the toc plugin will add the listClass class to all submenus, which causes
// // layout problems. We only want the outer list to have the class 'toc__menu'.
// const container: Ref<HTMLElement> | null = ref(null)
// onMounted(() => {
//   const menu = container?.value.querySelector('.toc__submenu')
//   if (menu) {
//     menu.classList.remove('toc__submenu')
//     menu.classList.add('toc__menu')
//   }
// })
</script>
