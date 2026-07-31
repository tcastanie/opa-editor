<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { wysiwygTableText } from '~/utils/i18n/wysiwyg-strings'

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
    [action(wysiwygTableText.insertTable, 'i-tabler-table', () => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }))],
    [
      action(wysiwygTableText.rowAbove, 'i-tabler-row-insert-top', () => chain().addRowBefore().run(), inTable.value),
      action(wysiwygTableText.rowBelow, 'i-tabler-row-insert-bottom', () => chain().addRowAfter().run(), inTable.value),
      action(wysiwygTableText.columnBefore, 'i-tabler-column-insert-left', () => chain().addColumnBefore().run(), inTable.value),
      action(wysiwygTableText.columnAfter, 'i-tabler-column-insert-right', () => chain().addColumnAfter().run(), inTable.value),
    ],
    [
      action(wysiwygTableText.toggleHeaderRow, 'i-tabler-layout-navbar', () => chain().toggleHeaderRow().run(), inTable.value),
      action(wysiwygTableText.toggleHeaderColumn, 'i-tabler-layout-sidebar', () => chain().toggleHeaderColumn().run(), inTable.value),
      action(wysiwygTableText.mergeCells, 'i-tabler-arrows-join', () => chain().mergeCells().run(), editor.can().mergeCells()),
      action(wysiwygTableText.splitCell, 'i-tabler-arrows-split', () => chain().splitCell().run(), editor.can().splitCell()),
    ],
    [
      action(wysiwygTableText.deleteRow, 'i-tabler-row-remove', () => chain().deleteRow().run(), inTable.value),
      action(wysiwygTableText.deleteColumn, 'i-tabler-column-remove', () => chain().deleteColumn().run(), inTable.value),
      action(wysiwygTableText.deleteTable, 'i-tabler-trash', () => chain().deleteTable().run(), inTable.value),
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
    <UTooltip :text="wysiwygTableText.tableTooltip">
      <UButton
        icon="i-tabler-table"
        color="neutral"
        active-color="primary"
        variant="ghost"
        active-variant="soft"
        size="sm"
        :active="inTable"
        :disabled="!editor.isEditable"
        :aria-label="wysiwygTableText.tableTooltip"
      />
    </UTooltip>
  </UDropdownMenu>
</template>
