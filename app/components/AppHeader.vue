<script setup lang="ts">
const items = [
  { label: 'Notion-like', to: '/notion', icon: 'i-tabler-text-caption' },
  { label: 'WYSIWYG', to: '/wysiwyg', icon: 'i-tabler-layout-navbar' },
]
</script>

<template>
  <UHeader>
    <template #title>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-tabler-atom-2"
          class="size-6 text-primary"
        />
        OPA Editor
      </div>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
      />
    </template>

    <template #right>
      <slot />

      <UColorModeButton size="sm" />
    </template>
  </UHeader>
</template>
