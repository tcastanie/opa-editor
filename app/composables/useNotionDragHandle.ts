import { upperFirst } from 'scule'
import type { DropdownMenuItem, EditorCustomHandlers } from '@nuxt/ui'
import type { Editor, JSONContent } from '@tiptap/vue-3'
import { mapEditorItems } from '@nuxt/ui/utils/editor'
import { notionBlockTypeLabels, notionDragHandleText } from '~/utils/i18n/notion-strings'

const CONVERTIBLE_TYPES = ['paragraph', 'heading', 'bulletList', 'orderedList', 'taskList', 'blockquote', 'codeBlock', 'listItem', 'taskItem']

const TYPE_LABELS: Record<string, string> = notionDragHandleText.typeLabels

/** Menu de la poignée de déplacement (à gauche de chaque bloc). */
export function useNotionDragHandle<T extends EditorCustomHandlers>(customHandlers?: T) {
  const selectedNode = ref<{ node: JSONContent | null, pos: number }>()

  const getTypeSpecificItems = (editor: Editor, nodeType: string): DropdownMenuItem[] => {
    const pos = selectedNode.value?.pos

    if (CONVERTIBLE_TYPES.includes(nodeType)) {
      return [{
        label: notionDragHandleText.transformInto,
        icon: 'i-tabler-repeat',
        children: [
          { kind: 'paragraph', label: notionBlockTypeLabels.paragraph, icon: 'i-tabler-pilcrow' },
          { kind: 'heading', level: 1, label: notionBlockTypeLabels.heading1, icon: 'i-tabler-h-1' },
          { kind: 'heading', level: 2, label: notionBlockTypeLabels.heading2, icon: 'i-tabler-h-2' },
          { kind: 'heading', level: 3, label: notionBlockTypeLabels.heading3, icon: 'i-tabler-h-3' },
          { kind: 'heading', level: 4, label: notionBlockTypeLabels.heading4, icon: 'i-tabler-h-4' },
          { kind: 'bulletList', label: notionBlockTypeLabels.bulletList, icon: 'i-tabler-list' },
          { kind: 'orderedList', label: notionBlockTypeLabels.orderedList, icon: 'i-tabler-list-numbers' },
          { kind: 'taskList', label: notionBlockTypeLabels.taskList, icon: 'i-tabler-list-check' },
          { kind: 'blockquote', label: notionBlockTypeLabels.blockquote, icon: 'i-tabler-quote' },
          { kind: 'codeBlock', label: notionBlockTypeLabels.codeBlock, icon: 'i-tabler-codeblock' },
        ],
      }, {
        kind: 'clearFormatting',
        pos,
        label: notionDragHandleText.resetFormatting,
        icon: 'i-tabler-rotate',
      }]
    }

    if (nodeType === editorYoutubePreset.node) {
      const node = pos !== undefined ? editor.state.doc.nodeAt(pos) : null

      return [{
        label: editorYoutubePreset.openLabel,
        icon: 'i-tabler-external-link',
        to: node?.attrs?.src,
        target: '_blank',
      }]
    }

    const mediaPreset = editorMediaPresetOf(nodeType)

    if (mediaPreset && mediaPreset.node === nodeType) {
      const node = pos !== undefined ? editor.state.doc.nodeAt(pos) : null

      return [{
        label: mediaPreset.downloadLabel,
        icon: 'i-tabler-download',
        to: node?.attrs?.src,
        download: true,
      }]
    }

    if (nodeType === 'table') {
      return [{
        label: notionDragHandleText.clearTable,
        icon: 'i-tabler-square-x',
        onSelect: () => {
          if (pos === undefined) return

          const tableNode = editor.state.doc.nodeAt(pos)
          if (!tableNode) return

          const cellRanges: { from: number, to: number }[] = []

          tableNode.descendants((node, nodePos) => {
            if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
              const cellStart = pos + 1 + nodePos + 1
              if (node.content.size > 0) {
                cellRanges.push({ from: cellStart, to: cellStart + node.content.size })
              }
            }
            return true
          })

          // Suppression en ordre inverse pour que les positions restent valides.
          const { tr } = editor.state
          cellRanges.reverse().forEach(({ from, to }) => tr.delete(from, to))
          editor.view.dispatch(tr)
        },
      }]
    }

    return []
  }

  const getItems = (editor: Editor): DropdownMenuItem[][] => {
    if (!selectedNode.value?.node?.type) {
      return []
    }

    const nodeType = selectedNode.value.node.type
    const pos = selectedNode.value.pos

    return mapEditorItems(editor, [[
      { type: 'label', label: TYPE_LABELS[nodeType] ?? upperFirst(nodeType) },
      ...getTypeSpecificItems(editor, nodeType),
    ], [
      { kind: 'duplicate', pos, label: notionDragHandleText.duplicate, icon: 'i-tabler-copy' },
      {
        label: notionDragHandleText.copyToClipboard,
        icon: 'i-tabler-clipboard',
        onSelect: async () => {
          const node = editor.state.doc.nodeAt(pos)
          if (node) {
            await navigator.clipboard.writeText(node.textContent)
          }
        },
      },
    ], [
      { kind: 'moveUp', pos, label: notionDragHandleText.moveUp, icon: 'i-tabler-arrow-up' },
      { kind: 'moveDown', pos, label: notionDragHandleText.moveDown, icon: 'i-tabler-arrow-down' },
    ], [
      { kind: 'delete', pos, label: notionDragHandleText.delete, icon: 'i-tabler-trash' },
    ]], customHandlers) as DropdownMenuItem[][]
  }

  const onNodeChange = (event: { node: JSONContent | null, pos: number }) => {
    selectedNode.value = event
  }

  return {
    selectedNode,
    getItems,
    onNodeChange,
  }
}
