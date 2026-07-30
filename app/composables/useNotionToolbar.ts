import type { EditorToolbarItem, EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'

export function useNotionToolbar<T extends EditorCustomHandlers>(_customHandlers?: T) {
  const toolbarItems: EditorToolbarItem<T>[][] = [[{
    'kind': 'undo',
    'icon': 'i-lucide-undo',
    'tooltip': { text: 'Annuler' },
    'aria-label': 'Annuler',
  }, {
    'kind': 'redo',
    'icon': 'i-lucide-redo',
    'tooltip': { text: 'Rétablir' },
    'aria-label': 'Rétablir',
  }], [{
    kind: 'imageUpload',
    label: 'Image',
    icon: 'i-lucide-image-plus',
    tooltip: { text: 'Ajouter une image' },
  }]]

  const bubbleToolbarItems: EditorToolbarItem<T>[][] = [[{
    label: 'Transformer en',
    trailingIcon: 'i-lucide-chevron-down',
    activeColor: 'neutral',
    activeVariant: 'ghost',
    tooltip: { text: 'Transformer en' },
    content: { align: 'start' },
    ui: { label: 'text-xs' },
    items: [{
      type: 'label',
      label: 'Transformer en',
    }, {
      kind: 'paragraph',
      label: 'Paragraphe',
      icon: 'i-lucide-type',
    }, {
      kind: 'heading',
      level: 1,
      label: 'Titre 1',
      icon: 'i-lucide-heading-1',
    }, {
      kind: 'heading',
      level: 2,
      label: 'Titre 2',
      icon: 'i-lucide-heading-2',
    }, {
      kind: 'heading',
      level: 3,
      label: 'Titre 3',
      icon: 'i-lucide-heading-3',
    }, {
      kind: 'heading',
      level: 4,
      label: 'Titre 4',
      icon: 'i-lucide-heading-4',
    }, {
      kind: 'bulletList',
      label: 'Liste à puces',
      icon: 'i-lucide-list',
    }, {
      kind: 'orderedList',
      label: 'Liste numérotée',
      icon: 'i-lucide-list-ordered',
    }, {
      kind: 'taskList',
      label: 'Liste de tâches',
      icon: 'i-lucide-list-check',
    }, {
      kind: 'blockquote',
      label: 'Citation',
      icon: 'i-lucide-quote',
    }, {
      kind: 'codeBlock',
      label: 'Bloc de code',
      icon: 'i-lucide-square-code',
    }],
  }], [{
    'kind': 'mark',
    'mark': 'bold',
    'icon': 'i-lucide-bold',
    'tooltip': { text: 'Gras' },
    'aria-label': 'Gras',
  }, {
    'kind': 'mark',
    'mark': 'italic',
    'icon': 'i-lucide-italic',
    'tooltip': { text: 'Italique' },
    'aria-label': 'Italique',
  }, {
    'kind': 'mark',
    'mark': 'underline',
    'icon': 'i-lucide-underline',
    'tooltip': { text: 'Souligné' },
    'aria-label': 'Souligné',
  }, {
    'kind': 'mark',
    'mark': 'strike',
    'icon': 'i-lucide-strikethrough',
    'tooltip': { text: 'Barré' },
    'aria-label': 'Barré',
  }, {
    'kind': 'mark',
    'mark': 'code',
    'icon': 'i-lucide-code',
    'tooltip': { text: 'Code' },
    'aria-label': 'Code',
  }], [{
    slot: 'link' as const,
    icon: 'i-lucide-link',
  }, {
    'kind': 'imageUpload',
    'icon': 'i-lucide-image',
    'tooltip': { text: 'Image' },
    'aria-label': 'Image',
  }]]

  const getImageToolbarItems = (editor: Editor): EditorToolbarItem<T>[][] => {
    const node = editor.state.doc.nodeAt(editor.state.selection.from)

    return [[{
      'icon': 'i-lucide-download',
      'to': node?.attrs?.src,
      'download': true,
      'tooltip': { text: 'Télécharger' },
      'aria-label': 'Télécharger',
    }, {
      'icon': 'i-lucide-refresh-cw',
      'tooltip': { text: 'Remplacer' },
      'aria-label': 'Remplacer',
      'onClick': () => {
        const pos = editor.state.selection.from
        const current = editor.state.doc.nodeAt(pos)

        if (current?.type.name === 'image') {
          editor.chain().focus()
            .deleteRange({ from: pos, to: pos + current.nodeSize })
            .insertContentAt(pos, { type: 'imageUpload' })
            .run()
        }
      },
    }], [{
      'icon': 'i-lucide-trash-2',
      'tooltip': { text: 'Supprimer' },
      'aria-label': 'Supprimer',
      'onClick': () => {
        const pos = editor.state.selection.from
        const current = editor.state.doc.nodeAt(pos)

        if (current?.type.name === 'image') {
          editor.chain().focus().deleteRange({ from: pos, to: pos + current.nodeSize }).run()
        }
      },
    }]]
  }

  const getTableToolbarItems = (editor: Editor): EditorToolbarItem<T>[][] => [[{
    'icon': 'i-lucide-between-vertical-start',
    'tooltip': { text: 'Ligne au-dessus' },
    'aria-label': 'Ligne au-dessus',
    'onClick': () => editor.chain().focus().addRowBefore().run(),
  }, {
    'icon': 'i-lucide-between-vertical-end',
    'tooltip': { text: 'Ligne en dessous' },
    'aria-label': 'Ligne en dessous',
    'onClick': () => editor.chain().focus().addRowAfter().run(),
  }, {
    'icon': 'i-lucide-between-horizontal-start',
    'tooltip': { text: 'Colonne avant' },
    'aria-label': 'Colonne avant',
    'onClick': () => editor.chain().focus().addColumnBefore().run(),
  }, {
    'icon': 'i-lucide-between-horizontal-end',
    'tooltip': { text: 'Colonne après' },
    'aria-label': 'Colonne après',
    'onClick': () => editor.chain().focus().addColumnAfter().run(),
  }], [{
    'icon': 'i-lucide-rows-3',
    'tooltip': { text: 'Supprimer la ligne' },
    'aria-label': 'Supprimer la ligne',
    'onClick': () => editor.chain().focus().deleteRow().run(),
  }, {
    'icon': 'i-lucide-columns-3',
    'tooltip': { text: 'Supprimer la colonne' },
    'aria-label': 'Supprimer la colonne',
    'onClick': () => editor.chain().focus().deleteColumn().run(),
  }], [{
    'icon': 'i-lucide-trash-2',
    'tooltip': { text: 'Supprimer le tableau' },
    'aria-label': 'Supprimer le tableau',
    'onClick': () => editor.chain().focus().deleteTable().run(),
  }]]

  return {
    toolbarItems,
    bubbleToolbarItems,
    getImageToolbarItems,
    getTableToolbarItems,
  }
}
