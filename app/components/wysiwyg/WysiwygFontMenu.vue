<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

/**
 * Équivalent du `StyleListMenu` du manifeste : liste déroulante qui pilote un
 * attribut de la marque `textStyle` (police ou corps).
 */
const props = withDefaults(defineProps<{
  editor: Editor
  label: string
  attr: 'fontFamily' | 'fontSize'
  items: FontOption[]
  /** Affiche chaque entrée dans sa propre police. */
  previewFont?: boolean
  width?: number
}>(), {
  previewFont: false,
  width: 132,
})

const current = computed<string | null>(() => props.editor.getAttributes('textStyle')?.[props.attr] ?? null)

const currentLabel = computed(() =>
  props.items.find(item => item.value === current.value)?.label ?? props.items[0]?.label ?? props.label,
)

const disabled = computed(() => !props.editor.isEditable || !props.editor.schema.marks.textStyle)

function apply(option: FontOption) {
  const chain = props.editor.chain().focus()

  if (props.attr === 'fontFamily') {
    (option.value ? chain.setFontFamily(option.value) : chain.unsetFontFamily()).run()
    return
  }

  (option.value ? chain.setFontSize(option.value) : chain.unsetFontSize()).run()
}

const menuItems = computed(() => props.items.map(option => ({
  label: option.label,
  type: 'checkbox' as const,
  checked: option.value === current.value,
  style: props.previewFont && option.value ? { fontFamily: option.value } : undefined,
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
    :ui="{ content: 'max-h-80 overflow-y-auto' }"
  >
    <UTooltip :text="label">
      <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        :disabled="disabled"
        :label="currentLabel"
        :aria-label="label"
        trailing-icon="i-lucide-chevron-down"
        class="justify-between shrink-0"
        :style="{ width: `${width}px` }"
        :ui="{ label: 'truncate' }"
      />
    </UTooltip>

    <template #item-label="{ item }">
      <span
        class="truncate"
        :style="(item as { style?: Record<string, string> }).style"
      >{{ item.label }}</span>
    </template>
  </UDropdownMenu>
</template>
