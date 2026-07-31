<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { wysiwygDateTimeText } from '~/utils/i18n/wysiwyg-strings'

/** Équivalent du `DateTimeMenu` du manifeste (`insertdatetime`). */
const { editor } = defineProps<{
  editor: Editor
}>()

const menuItems = computed(() => dateTimeMenuItems().map(entry => ({
  label: entry.label,
  description: entry.description,
  onSelect: () => {
    editor.chain().focus().insertContent(entry.format(new Date())).run()
  },
})))
</script>

<template>
  <UDropdownMenu
    :modal="false"
    :items="menuItems"
    :content="{ align: 'start' }"
    size="sm"
  >
    <UTooltip :text="wysiwygDateTimeText.insertDateTime">
      <UButton
        icon="i-tabler-clock-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        :disabled="!editor.isEditable"
        :aria-label="wysiwygDateTimeText.insertDateTime"
      />
    </UTooltip>
  </UDropdownMenu>
</template>
