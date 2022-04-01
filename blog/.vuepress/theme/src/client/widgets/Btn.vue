<template>
  <a v-if="href" class="btn" :class="classObject" :href="href" v-bind="$attrs">
    <slot />
  </a>
  <router-link v-else-if="to" class="btn" :class="classObject" :to="to" v-bind="$attrs">
    <slot />
  </router-link>
  <button v-else class="btn" :class="classObject" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: false,
    validator(values: string) {
      return values
        .split(' ')
        .every((value) =>
          [
            'primary',
            'success',
            'warning',
            'danger',
            'info',
            'inverse',
            'light-outline',
            'x-large',
            'large',
            'small',
          ].includes(value)
        )
    },
  },
  href: {
    type: String,
    required: false,
  },
  to: {
    type: [String, Object],
    required: false,
  },
})

const classObject = reactive({})

onMounted(() => {
  props.type?.split(' ')?.forEach((type: string) => {
    classObject[`btn--${type}`] = true
  })
})
</script>
