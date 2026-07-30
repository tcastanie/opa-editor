<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

/** Équivalent du `TableMenu` du manifeste, au-dessus de `@tiptap/extension-table`. */
const { editor } = defineProps<{
  editor: Editor
}>()

const inTable = computed(() => editor.isActive('table'))

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
  const chain = () => editor.chain().focus()

  return [
    [action('Insérer un tableau 3×3', 'i-tabler-table', () => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }))],
    [
      action('Ligne au-dessus', 'i-tabler-row-insert-top', () => chain().addRowBefore().run(), inTable.value),
      action('Ligne en dessous', 'i-tabler-row-insert-bottom', () => chain().addRowAfter().run(), inTable.value),
      action('Colonne avant', 'i-tabler-column-insert-left', () => chain().addColumnBefore().run(), inTable.value),
      action('Colonne après', 'i-tabler-column-insert-right', () => chain().addColumnAfter().run(), inTable.value),
    ],
    [
      action('Basculer la ligne d\'en-tête', 'i-tabler-layout-navbar', () => chain().toggleHeaderRow().run(), inTable.value),
      action('Basculer la colonne d\'en-tête', 'i-tabler-layout-sidebar', () => chain().toggleHeaderColumn().run(), inTable.value),
      action('Fusionner les cellules', 'i-tabler-arrows-join', () => chain().mergeCells().run(), editor.can().mergeCells()),
      action('Scinder la cellule', 'i-tabler-arrows-split', () => chain().splitCell().run(), editor.can().splitCell()),
    ],
    [
      action('Supprimer la ligne', 'i-tabler-row-remove', () => chain().deleteRow().run(), inTable.value),
      action('Supprimer la colonne', 'i-tabler-column-remove', () => chain().deleteColumn().run(), inTable.value),
      action('Supprimer le tableau', 'i-tabler-trash', () => chain().deleteTable().run(), inTable.value),
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
        icon="i-tabler-table"
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
