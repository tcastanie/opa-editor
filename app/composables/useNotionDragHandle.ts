import { upperFirst } from 'scule'
import type { DropdownMenuItem, EditorCustomHandlers } from '@nuxt/ui'
import type { Editor, JSONContent } from '@tiptap/vue-3'
import { mapEditorItems } from '@nuxt/ui/utils/editor'

const CONVERTIBLE_TYPES = ['paragraph', 'heading', 'bulletList', 'orderedList', 'taskList', 'blockquote', 'codeBlock', 'listItem', 'taskItem']

const TYPE_LABELS: Record<string, string> = {
  paragraph: 'Paragraphe',
  heading: 'Titre',
  bulletList: 'Liste à puces',
  orderedList: 'Liste numérotée',
  taskList: 'Liste de tâches',
  listItem: 'Élément de liste',
  taskItem: 'Tâche',
  blockquote: 'Citation',
  codeBlock: 'Bloc de code',
  image: 'Image',
  imageUpload: 'Envoi d\'image',
  video: 'Vidéo',
  videoUpload: 'Envoi de vidéo',
  audio: 'Audio',
  audioUpload: 'Envoi de fichier audio',
  table: 'Tableau',
  horizontalRule: 'Séparateur',
}

/** Menu de la poignée de déplacement (à gauche de chaque bloc). */
export function useNotionDragHandle<T extends EditorCustomHandlers>(customHandlers?: T) {
  const selectedNode = ref<{ node: JSONContent | null, pos: number }>()

  const getTypeSpecificItems = (editor: Editor, nodeType: string): DropdownMenuItem[] => {
    const pos = selectedNode.value?.pos

    if (CONVERTIBLE_TYPES.includes(nodeType)) {
      return [{
        label: 'Transformer en',
        icon: 'i-tabler-repeat',
        children: [
          { kind: 'paragraph', label: 'Paragraphe', icon: 'i-tabler-pilcrow' },
          { kind: 'heading', level: 1, label: 'Titre 1', icon: 'i-tabler-h-1' },
          { kind: 'heading', level: 2, label: 'Titre 2', icon: 'i-tabler-h-2' },
          { kind: 'heading', level: 3, label: 'Titre 3', icon: 'i-tabler-h-3' },
          { kind: 'heading', level: 4, label: 'Titre 4', icon: 'i-tabler-h-4' },
          { kind: 'bulletList', label: 'Liste à puces', icon: 'i-tabler-list' },
          { kind: 'orderedList', label: 'Liste numérotée', icon: 'i-tabler-list-numbers' },
          { kind: 'taskList', label: 'Liste de tâches', icon: 'i-tabler-list-check' },
          { kind: 'blockquote', label: 'Citation', icon: 'i-tabler-quote' },
          { kind: 'codeBlock', label: 'Bloc de code', icon: 'i-tabler-codeblock' },
        ],
      }, {
        kind: 'clearFormatting',
        pos,
        label: 'Réinitialiser le formatage',
        icon: 'i-tabler-rotate',
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
        label: 'Vider le tableau',
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
      { kind: 'duplicate', pos, label: 'Dupliquer', icon: 'i-tabler-copy' },
      {
        label: 'Copier dans le presse-papiers',
        icon: 'i-tabler-clipboard',
        onSelect: async () => {
          const node = editor.state.doc.nodeAt(pos)
          if (node) {
            await navigator.clipboard.writeText(node.textContent)
          }
        },
      },
    ], [
      { kind: 'moveUp', pos, label: 'Monter', icon: 'i-tabler-arrow-up' },
      { kind: 'moveDown', pos, label: 'Descendre', icon: 'i-tabler-arrow-down' },
    ], [
      { kind: 'delete', pos, label: 'Supprimer', icon: 'i-tabler-trash' },
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
