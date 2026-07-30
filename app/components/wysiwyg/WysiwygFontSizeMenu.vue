<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const { editor, items = fontSizes, width = 80 } = defineProps<{
  editor: Editor
  items?: FontOption[]
  width?: number
}>()

const current = computed<string | null>(() => editor.getAttributes('textStyle')?.fontSize ?? null)

const currentLabel = computed(() =>
  items.find(item => item.value === current.value)?.label ?? items[0]?.label ?? 'Taille de police',
)

const disabled = computed(() => !editor.isEditable || !editor.schema.marks.textStyle)

function apply(option: FontOption) {
  const chain = editor.chain().focus();

  (option.value ? chain.setFontSize(option.value) : chain.unsetFontSize()).run()
}

const menuItems = computed(() => items.map(option => ({
  label: option.label,
  description: option.description,
  type: 'checkbox' as const,
  checked: option.value === current.value,
  onSelect: (event: Event) => {
    event.preventDefault()
    apply(option)
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
    <UTooltip text="Taille de police">
      <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        :disabled="disabled"
        :label="currentLabel"
        aria-label="Taille de police"
        trailing-icon="i-tabler-chevron-down"
        class="justify-between shrink-0"
        :style="{ width: `${width}px` }"
        :ui="{ label: 'truncate' }"
      />
    </UTooltip>
  </UDropdownMenu>
</template>
