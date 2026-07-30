<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

/** Équivalent du `DateTimeMenu` du manifeste (`insertdatetime`). */
const props = defineProps<{
  editor: Editor
}>()

const menuItems = computed(() => {
  const now = new Date()

  return dateTimeFormats.map(entry => ({
    label: entry.label,
    kbds: undefined,
    onSelect: () => {
      props.editor.chain().focus().insertContent(entry.format(new Date())).run()
    },
    // Aperçu figé au moment du rendu du menu : suffisant pour se repérer.
    description: entry.format(now),
  }))
})
</script>

<template>
  <UDropdownMenu
    :modal="false"
    :items="menuItems"
    :content="{ align: 'start' }"
    size="sm"
  >
    <UTooltip text="Insérer date/heure">
      <UButton
        icon="i-tabler-clock-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        :disabled="!editor.isEditable"
        aria-label="Insérer date/heure"
      />
    </UTooltip>
  </UDropdownMenu>
</template>
