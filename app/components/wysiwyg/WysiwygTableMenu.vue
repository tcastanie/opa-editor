<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

/** Équivalent du `TableMenu` du manifeste, au-dessus de `@tiptap/extension-table`. */
const props = defineProps<{
  editor: Editor
}>()

const inTable = computed(() => props.editor.isActive('table'))

function action(label: string, icon: string, run: () => boolean, enabled = true) {
  return {
    label,
    icon,
    disabled: !enabled,
    onSelect: () => {
      run()
    },
  }
}

const menuItems = computed(() => {
  const editor = props.editor
  const chain = () => editor.chain().focus()

  return [
    [action('Insérer un tableau 3×3', 'i-lucide-table', () => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }))],
    [
      action('Ligne au-dessus', 'i-lucide-between-vertical-start', () => chain().addRowBefore().run(), inTable.value),
      action('Ligne en dessous', 'i-lucide-between-vertical-end', () => chain().addRowAfter().run(), inTable.value),
      action('Colonne avant', 'i-lucide-between-horizontal-start', () => chain().addColumnBefore().run(), inTable.value),
      action('Colonne après', 'i-lucide-between-horizontal-end', () => chain().addColumnAfter().run(), inTable.value),
    ],
    [
      action('Basculer la ligne d\'en-tête', 'i-lucide-panel-top', () => chain().toggleHeaderRow().run(), inTable.value),
      action('Basculer la colonne d\'en-tête', 'i-lucide-panel-left', () => chain().toggleHeaderColumn().run(), inTable.value),
      action('Fusionner les cellules', 'i-lucide-table-cells-merge', () => chain().mergeCells().run(), editor.can().mergeCells()),
      action('Scinder la cellule', 'i-lucide-table-cells-split', () => chain().splitCell().run(), editor.can().splitCell()),
    ],
    [
      action('Supprimer la ligne', 'i-lucide-rows-3', () => chain().deleteRow().run(), inTable.value),
      action('Supprimer la colonne', 'i-lucide-columns-3', () => chain().deleteColumn().run(), inTable.value),
      action('Supprimer le tableau', 'i-lucide-trash-2', () => chain().deleteTable().run(), inTable.value),
    ],
  ]
})
</script>

<template>
  <UDropdownMenu
    :modal="false"
    :items="menuItems"
    :content="{ align: 'start' }"
    size="sm"
    :ui="{ content: 'w-60' }"
  >
    <UTooltip text="Tableau">
      <UButton
        icon="i-lucide-table"
        color="neutral"
        active-color="primary"
        variant="ghost"
        active-variant="soft"
        size="sm"
        :active="inTable"
        :disabled="!editor.isEditable"
        aria-label="Tableau"
      />
    </UTooltip>
  </UDropdownMenu>
</template>
