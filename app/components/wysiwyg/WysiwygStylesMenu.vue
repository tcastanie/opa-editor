<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

/**
 * Équivalent du `StylesMenu` du manifeste (`customFormats`). Dans Directus la
 * liste vient de la configuration du champ ; ici elle est fournie en prop et
 * chaque format applique une classe CSS au bloc courant — ce qui n'est possible
 * que parce que l'extension `PreservedAttributes` conserve `class` en HTML.
 */
const props = withDefaults(defineProps<{
  editor: Editor
  items?: CustomFormat[]
  width?: number
}>(), {
  items: () => customFormats,
  width: 132,
})

const BLOCK_TYPES = ['paragraph', 'heading', 'blockquote']

function currentBlockType() {
  return BLOCK_TYPES.find(type => props.editor.isActive(type)) ?? 'paragraph'
}

function currentClasses() {
  const type = currentBlockType()
  return String(props.editor.getAttributes(type)?.class ?? '').split(/\s+/).filter(Boolean)
}

const activeFormat = computed(() => {
  const classes = currentClasses()
  return props.items.find(format => classes.includes(format.className)) ?? null
})

const disabled = computed(() => !props.editor.isEditable)

function toggle(format: CustomFormat) {
  const type = currentBlockType()
  const classes = currentClasses().filter(name => !props.items.some(item => item.className === name))

  if (activeFormat.value?.className !== format.className) {
    classes.push(format.className)
  }

  props.editor.chain().focus().updateAttributes(type, { class: classes.join(' ') || null }).run()
}

const menuItems = computed(() => props.items.map(format => ({
  label: format.label,
  description: format.description,
  type: 'checkbox' as const,
  checked: activeFormat.value?.className === format.className,
  onSelect: (event: Event) => {
    event.preventDefault()
    toggle(format)
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
    <UTooltip text="Styles">
      <UButton
        icon="i-lucide-paintbrush"
        color="neutral"
        active-color="primary"
        variant="ghost"
        active-variant="soft"
        size="sm"
        :active="!!activeFormat"
        :disabled="disabled"
        :label="activeFormat?.label ?? 'Styles'"
        aria-label="Styles"
        trailing-icon="i-lucide-chevron-down"
        class="justify-between shrink-0"
        :style="{ width: `${width}px` }"
        :ui="{ label: 'truncate' }"
      />
    </UTooltip>
  </UDropdownMenu>
</template>
