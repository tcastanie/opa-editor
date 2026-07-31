<script setup lang="ts">
useSeoMeta({
  title: 'OPA Editor',
})

const templates = [{
  title: 'Notion-like',
  to: '/notion',
  icon: 'i-tabler-text-caption',
  description: 'Édition sans barre d\'outils permanente',
}, {
  title: 'WYSIWYG',
  to: '/wysiwyg',
  icon: 'i-tabler-layout-navbar',
  description: 'Barre d\'outils classique',
}]
</script>

<template>
  <div>
    <AppHeader />

    <UMain>
      <UPageHero description="Templates TipTap prêt à être utilisés">
        <template #title>
          <span class="inline-flex rounded-2xl dark:bg-black px-8 py-6 ring ring-primary/20 shadow-[0_0_80px_-20px] shadow-primary/50">
            <img
              src="/opa-editor-logo.jpg"
              alt="OPA Editor"
              width="512"
              height="352"
              class="w-56 sm:w-72 h-auto mix-blend-screen light:invert"
            >
          </span>
        </template>
      </UPageHero>

      <UContainer class="pb-24">
        <UPageGrid class="lg:grid-cols-2">
          <UPageCard
            v-for="{ to, title, description, icon } in templates"
            :key="to"
            :title
            :description
            :icon
            :to
          />
        </UPageGrid>
      </UContainer>
    </UMain>
  </div>
</template>
