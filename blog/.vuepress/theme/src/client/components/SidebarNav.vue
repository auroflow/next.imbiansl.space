<template>
  <nav class="nav__list">
    <input id="ac-toc" name="accordion-toc" type="checkbox" />
    <label for="ac-toc">Toggle Menu</label>
    <ul class="nav__items">
      <li v-for="(item, index) in items" :key="index">
        <template v-if="item.url">
          <a v-if="isLinkExternal(item.url)" :href="item.url">
            <span class="nav__sub-title">{{ item.title }}</span>
          </a>
          <router-link v-else :to="item.url">
            <span class="nav__sub-title">{{ item.title }}</span>
          </router-link>
        </template>
        <span v-else class="nav__sub-title">{{ item.title }}</span>

        <ul v-if="item.children?.length">
          <li v-for="(child, i) in item.children" :key="i">
            <a v-if="isLinkExternal(child.url)" :href="child.url">
              <span v-html="md.renderInline(child.title)"></span>
            </a>
            <router-link v-else :to="child.url">
              <span v-html="md.renderInline(child.title)"></span>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { isLinkExternal } from '@vuepress/shared'
import md from '../scripts/markdown'

const props = defineProps<{
  items: {
    title: string
    url: string
    children: {
      title: string
      url: string
    }[]
  }[]
}>()
</script>
