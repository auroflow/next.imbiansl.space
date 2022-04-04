<template>
  <!-- AuthorProfile starts -->
  <div itemscope itemtype="https://schema.org/Person">
    <div v-if="author.avatar" class="author__avatar">
      <!-- No link to home -->
      <img v-if="!author.home" :src="author.avatar" :alt="author.name" itemprop="image" />
      <!-- External link, use a -->
      <a v-else-if="isExternalLink(author.home)" :href="author.home">
        <img :src="author.avatar" :alt="author.name" itemprop="image" />
      </a>
      <!-- Internal link, use router-link -->
      <router-link v-else :to="author.home">
        <img :src="author.avatar" :alt="author.name" itemprop="image" />
      </router-link>
    </div>

    <div class="author__content">
      <!-- Name -->
      <a v-if="author.home" :href="author.home">
        <h3 class="author__name" itemprop="name">
          {{ author.name }}
        </h3>
      </a>
      <h3 v-else class="author__name" itemprop="name">
        {{ author.name }}
      </h3>

      <!-- Bio -->
      <p v-if="author.bio" class="author__bio" itemprop="description">
        {{ author.bio }}
      </p>
    </div>

    <div v-if="author.location || author.links.length" class="author__urls-wrapper">
      <button id="follow-button" class="btn btn--inverse" @click="toggleFollowList">Follow</button>

      <ul id="follow-list" class="author__urls social-icons">
        <!-- location -->
        <li v-if="author.location" itemprop="homeLocation" itemscope itemtype="https://schema.org/Place">
          <i class="fa-solid fa-location-arrow fa-fw" aria-hidden="true"></i>
          <span class="label" itemprop="name">{{ author.location }}</span>
        </li>
        <!-- other links -->
        <li v-for="link in author.links">
          <a :href="link.url" itemprop="url">
            <i :class="link.icon" class="fa-fw" aria-hidden="true"></i>
            <span class="label">{{ link.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
  <!-- AuthorProfile ends -->
</template>

<script lang="ts" setup>
import { useThemeData } from '../composables'
import { onMounted, onUnmounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { onBeforeRouteUpdate } from 'vue-router'

const { author } = useThemeData().value

const isExternalLink = (link: string) => /^https?:\/\//.test(link)

const followList = ref<HTMLUListElement>(null)
const followButton = ref<HTMLButtonElement>(null)

const toggleFollowList = () => {
  if (window.getComputedStyle(followList.value).getPropertyValue('display') === 'none') {
    followList.value.style.display = 'block'
  } else {
    followList.value.style.display = null
  }
}

onMounted(() => {
  followList.value = document.querySelector<HTMLUListElement>('#follow-list')
  followButton.value = document.querySelector<HTMLButtonElement>('#follow-button')

  onClickOutside(
    followList,
    () => {
      followList.value.style.display = null
    },
    {
      ignore: [followButton],
    }
  )

  // when screen width > $large (1024px), show follow list
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    followList.value.style.display = null
  })
})
</script>
