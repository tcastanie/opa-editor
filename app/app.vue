<script setup lang="ts">
import { fr } from '@nuxt/ui/locale'

useHead({
  htmlAttrs: {
    lang: 'fr',
  },
})

const title = 'OPA Editor templates'
const description = 'Editor templates for Nuxt & Nuxt UI, built on Tiptap'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})
</script>

<template>
  <UApp :locale="fr">
    <NuxtPage />
  </UApp>
</template>
